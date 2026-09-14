
-- ============ GuardDesk Phase 1 schema ============

create extension if not exists pgcrypto;

-- Roles within an organization
create type public.org_role as enum ('admin','operations','supervisor','finance','guard','client');

-- ---------- organizations ----------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default 'LK',
  timezone text not null default 'Asia/Colombo',
  currency_code text not null default 'LKR',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- organization_members ----------
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.org_role not null default 'guard',
  display_name text not null default '',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
grant select, insert, update, delete on public.organization_members to authenticated;
grant all on public.organization_members to service_role;
alter table public.organization_members enable row level security;

-- ---------- tenant helper functions (security definer, no recursion) ----------
create or replace function public.is_org_member(_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organization_members
    where organization_id = _org and user_id = auth.uid())
$$;

create or replace function public.has_org_role(_org uuid, _roles public.org_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organization_members
    where organization_id = _org and user_id = auth.uid() and role = any(_roles))
$$;

-- managers = anyone who can run operations day to day
create or replace function public.is_org_manager(_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_org_role(_org, array['admin','operations','supervisor']::public.org_role[])
$$;

create policy "orgs_select_member" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "orgs_insert_authed" on public.organizations for insert to authenticated with check (true);
create policy "orgs_update_admin" on public.organizations for update to authenticated using (public.has_org_role(id, array['admin']::public.org_role[]));

create policy "members_select" on public.organization_members for select to authenticated using (public.is_org_member(organization_id) or user_id = auth.uid());
create policy "members_insert_admin" on public.organization_members for insert to authenticated with check (public.has_org_role(organization_id, array['admin']::public.org_role[]) or (user_id = auth.uid() and not exists (select 1 from public.organization_members om where om.organization_id = organization_id)));
create policy "members_update_admin" on public.organization_members for update to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));
create policy "members_delete_admin" on public.organization_members for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]) or user_id = auth.uid());

-- ---------- clients ----------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  industry text,
  contact_name text, contact_email text, contact_phone text,
  billing_email text, billing_address text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.clients to authenticated;
grant all on public.clients to service_role;
alter table public.clients enable row level security;

-- ---------- sites ----------
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  address text,
  city text,
  latitude double precision, longitude double precision,
  geofence_radius_m integer not null default 150,
  contact_name text, contact_phone text,
  supervisor_user_id uuid references auth.users(id) on delete set null,
  required_guards integer not null default 1,
  operating_hours text,
  emergency_contacts jsonb not null default '[]',
  instructions text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.sites to authenticated;
grant all on public.sites to service_role;
alter table public.sites enable row level security;
create index sites_org_idx on public.sites(organization_id);
create index sites_client_idx on public.sites(client_id);

-- ---------- posts ----------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null,
  required_guards integer not null default 1,
  shift_pattern text not null default 'day_night',
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create index posts_site_idx on public.posts(site_id);

-- ---------- contracts ----------
create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  reference text,
  title text not null,
  service_type text not null default 'guarding',
  start_date date not null,
  end_date date,
  value numeric(14,2) not null default 0,
  billing_frequency text not null default 'monthly',
  required_guards integer not null default 1,
  overtime_rules jsonb not null default '{}',
  status text not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.contracts to authenticated;
grant all on public.contracts to service_role;
alter table public.contracts enable row level security;
create index contracts_client_idx on public.contracts(client_id);

-- ---------- guards ----------
create table public.guards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  employee_id text not null,
  full_name text not null,
  nic_number text,
  phone text, email text,
  emergency_contact_name text, emergency_contact_phone text,
  supervisor_user_id uuid references auth.users(id) on delete set null,
  skills text[] not null default '{}',
  hire_date date,
  status text not null default 'active',
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_id)
);
grant select, insert, update, delete on public.guards to authenticated;
grant all on public.guards to service_role;
alter table public.guards enable row level security;
create index guards_org_idx on public.guards(organization_id);

-- ---------- document types & guard documents ----------
create table public.document_types (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  required boolean not null default false,
  has_expiry boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);
grant select, insert, update, delete on public.document_types to authenticated;
grant all on public.document_types to service_role;
alter table public.document_types enable row level security;

create table public.guard_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  guard_id uuid not null references public.guards(id) on delete cascade,
  document_type_id uuid not null references public.document_types(id) on delete cascade,
  document_number text,
  issued_date date, expiry_date date,
  file_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guard_id, document_type_id)
);
grant select, insert, update, delete on public.guard_documents to authenticated;
grant all on public.guard_documents to service_role;
alter table public.guard_documents enable row level security;
create index guard_documents_guard_idx on public.guard_documents(guard_id);
create index guard_documents_expiry_idx on public.guard_documents(expiry_date);

-- ---------- shifts & assignments ----------
create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  shift_date date not null,
  start_time time not null,
  end_time time not null,
  shift_type text not null default 'day',
  required_guards integer not null default 1,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.shifts to authenticated;
grant all on public.shifts to service_role;
alter table public.shifts enable row level security;
create index shifts_org_date_idx on public.shifts(organization_id, shift_date);
create index shifts_site_idx on public.shifts(site_id);

create table public.shift_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  shift_id uuid not null references public.shifts(id) on delete cascade,
  guard_id uuid not null references public.guards(id) on delete cascade,
  status text not null default 'assigned',
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shift_id, guard_id)
);
grant select, insert, update, delete on public.shift_assignments to authenticated;
grant all on public.shift_assignments to service_role;
alter table public.shift_assignments enable row level security;
create index shift_assignments_guard_idx on public.shift_assignments(guard_id);
create index shift_assignments_shift_idx on public.shift_assignments(shift_id);

-- prevent double-booking a guard on overlapping shifts same day
create or replace function public.prevent_double_booking()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_date date; new_start time; new_end time;
  conflict_count int;
begin
  select s.shift_date, s.start_time, s.end_time into new_date, new_start, new_end
    from public.shifts s where s.id = new.shift_id;
  select count(*) into conflict_count
    from public.shift_assignments sa
    join public.shifts s on s.id = sa.shift_id
   where sa.guard_id = new.guard_id
     and sa.id is distinct from new.id
     and sa.status not in ('cancelled')
     and s.shift_date = new_date
     and (new_start < s.end_time and new_end > s.start_time);
  if conflict_count > 0 then
    raise exception 'Guard is already assigned to an overlapping shift on this date';
  end if;
  return new;
end $$;
create trigger trg_prevent_double_booking before insert or update on public.shift_assignments
  for each row execute function public.prevent_double_booking();

-- ---------- attendance ----------
create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  guard_id uuid not null references public.guards(id) on delete cascade,
  shift_id uuid references public.shifts(id) on delete set null,
  site_id uuid not null references public.sites(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  clock_in_at timestamptz,
  clock_in_lat double precision, clock_in_lng double precision,
  clock_in_within_geofence boolean,
  clock_out_at timestamptz,
  clock_out_lat double precision, clock_out_lng double precision,
  clock_out_within_geofence boolean,
  flags text[] not null default '{}',
  status text not null default 'pending',
  source text not null default 'guard',
  approval_status text not null default 'pending',
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.attendance_records to authenticated;
grant all on public.attendance_records to service_role;
alter table public.attendance_records enable row level security;
create index attendance_org_idx on public.attendance_records(organization_id, clock_in_at);
create index attendance_guard_idx on public.attendance_records(guard_id);

-- corrections keep original value, new value, reason, actor, timestamp
create table public.attendance_corrections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  attendance_id uuid not null references public.attendance_records(id) on delete cascade,
  field text not null,
  original_value text,
  new_value text,
  reason text not null,
  corrected_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
grant select, insert on public.attendance_corrections to authenticated;
grant all on public.attendance_corrections to service_role;
alter table public.attendance_corrections enable row level security;
create index attendance_corrections_att_idx on public.attendance_corrections(attendance_id);

-- ---------- notifications ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'info',
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create index notifications_user_idx on public.notifications(user_id, read_at);

-- ---------- audit logs ----------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  entity_label text,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create index audit_logs_org_idx on public.audit_logs(organization_id, created_at desc);

-- ---------- updated_at trigger ----------
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['organizations','profiles','clients','sites','posts','contracts','guards','guard_documents','shifts','shift_assignments','attendance_records']
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.update_updated_at_column()', t);
  end loop;
end $$;

-- ---------- RLS policies for tenant tables ----------
-- clients, sites, posts, contracts: members read; managers+finance write clients/contracts; managers write sites/posts
create policy "clients_select" on public.clients for select to authenticated using (public.is_org_member(organization_id));
create policy "clients_insert" on public.clients for insert to authenticated with check (public.has_org_role(organization_id, array['admin','operations','finance']::public.org_role[]));
create policy "clients_update" on public.clients for update to authenticated using (public.has_org_role(organization_id, array['admin','operations','finance']::public.org_role[]));
create policy "clients_delete" on public.clients for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));

create policy "sites_select" on public.sites for select to authenticated using (public.is_org_member(organization_id));
create policy "sites_write" on public.sites for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "sites_update" on public.sites for update to authenticated using (public.is_org_manager(organization_id));
create policy "sites_delete" on public.sites for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));

create policy "posts_select" on public.posts for select to authenticated using (public.is_org_member(organization_id));
create policy "posts_write" on public.posts for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "posts_update" on public.posts for update to authenticated using (public.is_org_manager(organization_id));
create policy "posts_delete" on public.posts for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));

create policy "contracts_select" on public.contracts for select to authenticated using (public.is_org_member(organization_id));
create policy "contracts_write" on public.contracts for insert to authenticated with check (public.has_org_role(organization_id, array['admin','operations','finance']::public.org_role[]));
create policy "contracts_update" on public.contracts for update to authenticated using (public.has_org_role(organization_id, array['admin','operations','finance']::public.org_role[]));
create policy "contracts_delete" on public.contracts for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));

create policy "guards_select" on public.guards for select to authenticated using (public.is_org_member(organization_id));
create policy "guards_write" on public.guards for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "guards_update" on public.guards for update to authenticated using (public.is_org_manager(organization_id));
create policy "guards_delete" on public.guards for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));

create policy "doctypes_select" on public.document_types for select to authenticated using (public.is_org_member(organization_id));
create policy "doctypes_write" on public.document_types for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "doctypes_update" on public.document_types for update to authenticated using (public.is_org_manager(organization_id));
create policy "doctypes_delete" on public.document_types for delete to authenticated using (public.has_org_role(organization_id, array['admin']::public.org_role[]));

create policy "guarddocs_select" on public.guard_documents for select to authenticated using (public.is_org_member(organization_id));
create policy "guarddocs_write" on public.guard_documents for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "guarddocs_update" on public.guard_documents for update to authenticated using (public.is_org_manager(organization_id));
create policy "guarddocs_delete" on public.guard_documents for delete to authenticated using (public.is_org_manager(organization_id));

create policy "shifts_select" on public.shifts for select to authenticated using (public.is_org_member(organization_id));
create policy "shifts_write" on public.shifts for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "shifts_update" on public.shifts for update to authenticated using (public.is_org_manager(organization_id));
create policy "shifts_delete" on public.shifts for delete to authenticated using (public.is_org_manager(organization_id));

create policy "assign_select" on public.shift_assignments for select to authenticated using (public.is_org_member(organization_id));
create policy "assign_write" on public.shift_assignments for insert to authenticated with check (public.is_org_manager(organization_id));
create policy "assign_update" on public.shift_assignments for update to authenticated using (public.is_org_manager(organization_id));
create policy "assign_delete" on public.shift_assignments for delete to authenticated using (public.is_org_manager(organization_id));

-- attendance: members read; guards clock their own (linked user); managers manage & approve
create policy "attendance_select" on public.attendance_records for select to authenticated using (public.is_org_member(organization_id));
create policy "attendance_insert_guard" on public.attendance_records for insert to authenticated with check (
  public.is_org_manager(organization_id)
  or exists (select 1 from public.guards g where g.id = guard_id and g.user_id = auth.uid() and g.organization_id = attendance_records.organization_id)
);
create policy "attendance_update" on public.attendance_records for update to authenticated using (
  public.is_org_manager(organization_id)
  or exists (select 1 from public.guards g where g.id = guard_id and g.user_id = auth.uid() and g.organization_id = attendance_records.organization_id)
);
create policy "attendance_delete" on public.attendance_records for delete to authenticated using (public.is_org_manager(organization_id));

create policy "corrections_select" on public.attendance_corrections for select to authenticated using (public.is_org_member(organization_id));
create policy "corrections_insert" on public.attendance_corrections for insert to authenticated with check (public.is_org_manager(organization_id) and corrected_by = auth.uid());

create policy "notifications_select" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications_insert" on public.notifications for insert to authenticated with check (public.is_org_member(organization_id));
create policy "notifications_update" on public.notifications for update to authenticated using (user_id = auth.uid());

create policy "audit_select" on public.audit_logs for select to authenticated using (public.is_org_member(organization_id));
create policy "audit_insert" on public.audit_logs for insert to authenticated with check (public.is_org_member(organization_id));

-- ---------- demo workspace generator ----------
-- Creates a demo organization with realistic Sri Lankan sample data for the calling user.
create or replace function public.create_demo_organization(_company_name text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org uuid;
  v_uid uuid := auth.uid();
  v_name text := coalesce(nullif(trim(_company_name),''), 'Demo Security (Pvt) Ltd');
  c1 uuid; c2 uuid; c3 uuid;
  s1 uuid; s2 uuid; s3 uuid; s4 uuid;
  p1 uuid; p2 uuid; p3 uuid; p4 uuid;
  g uuid[] := array[]::uuid[];
  gid uuid;
  i int;
  dt_license uuid; dt_nic uuid; dt_training uuid;
  sh uuid;
  guard_names text[] := array['Nuwan Perera','Kasun Fernando','Saman Jayasuriya','Dinesh Silva','Ruwan Gunawardena','Chaminda Rathnayake','Asanka Wijeratne','Pradeep Kumara','Tharindu Bandara','Lasith Malinga','Roshan De Silva','Ajith Mendis'];
  today date := current_date;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;

  insert into public.organizations (name) values (v_name) returning id into v_org;
  insert into public.organization_members (organization_id, user_id, role, display_name)
    select v_org, v_uid, 'admin', coalesce(p.full_name,'Admin') from public.profiles p where p.id = v_uid;

  -- clients
  insert into public.clients (organization_id, name, industry, contact_name, contact_email, contact_phone, billing_email, billing_address, status) values
    (v_org, 'Ceylon Retail Group', 'Retail', 'Nimal Wickramasinghe', 'nimal@ceylonretail.lk', '+94 77 555 0101', 'accounts@ceylonretail.lk', '42 Galle Road, Colombo 03', 'active') returning id into c1;
  insert into public.clients (organization_id, name, industry, contact_name, contact_email, contact_phone, billing_email, billing_address, status) values
    (v_org, 'Lanka Industrial Parks', 'Industrial', 'Sithum Perera', 'sithum@lankaindustrial.lk', '+94 71 555 0102', 'finance@lankaindustrial.lk', 'Export Processing Zone, Katunayake', 'active') returning id into c2;
  insert into public.clients (organization_id, name, industry, contact_name, contact_email, contact_phone, billing_email, billing_address, status) values
    (v_org, 'Heritage Hotels Colombo', 'Hospitality', 'Dilani Fonseka', 'dilani@heritagehotels.lk', '+94 76 555 0103', 'ap@heritagehotels.lk', '88 Marine Drive, Colombo 06', 'active') returning id into c3;

  -- sites
  insert into public.sites (organization_id, client_id, name, address, city, latitude, longitude, geofence_radius_m, contact_name, contact_phone, required_guards, operating_hours, instructions) values
    (v_org, c1, 'Ceylon Retail — Head Office', '42 Galle Road', 'Colombo 03', 6.9055, 79.8518, 150, 'Nimal Wickramasinghe', '+94 77 555 0101', 3, '24 hours', 'Check visitor passes at main gate. Log all deliveries.') returning id into s1;
  insert into public.sites (organization_id, client_id, name, address, city, latitude, longitude, geofence_radius_m, contact_name, contact_phone, required_guards, operating_hours, instructions) values
    (v_org, c1, 'Ceylon Retail — Kandy Store', '15 Dalada Veediya', 'Kandy', 7.2936, 80.6413, 120, 'Sunil Rajapaksa', '+94 77 555 0104', 2, '08:00–22:00', 'Two guards during opening hours, one overnight.') returning id into s2;
  insert into public.sites (organization_id, client_id, name, address, city, latitude, longitude, geofence_radius_m, contact_name, contact_phone, required_guards, operating_hours, instructions) values
    (v_org, c2, 'Katunayake EPZ — Gate A', 'EPZ Phase 2', 'Katunayake', 7.1647, 79.8720, 200, 'Sithum Perera', '+94 71 555 0102', 4, '24 hours', 'Strict vehicle checks. Escort visitors to admin block.') returning id into s3;
  insert into public.sites (organization_id, client_id, name, address, city, latitude, longitude, geofence_radius_m, contact_name, contact_phone, required_guards, operating_hours, instructions) values
    (v_org, c3, 'Heritage Hotel — Main Entrance', '88 Marine Drive', 'Colombo 06', 6.8745, 79.8569, 100, 'Dilani Fonseka', '+94 76 555 0103', 2, '24 hours', 'Guest-facing post. Formal uniform required at all times.') returning id into s4;

  -- posts
  insert into public.posts (organization_id, site_id, name, required_guards, shift_pattern) values (v_org, s1, 'Main Gate', 1, 'day_night') returning id into p1;
  insert into public.posts (organization_id, site_id, name, required_guards, shift_pattern) values (v_org, s1, 'Loading Bay', 1, 'day_only') returning id into p2;
  insert into public.posts (organization_id, site_id, name, required_guards, shift_pattern) values (v_org, s3, 'Gate A Checkpoint', 2, 'day_night') returning id into p3;
  insert into public.posts (organization_id, site_id, name, required_guards, shift_pattern) values (v_org, s4, 'Lobby Entrance', 1, 'day_night') returning id into p4;

  -- contracts
  insert into public.contracts (organization_id, client_id, reference, title, service_type, start_date, end_date, value, billing_frequency, required_guards, status) values
    (v_org, c1, 'CT-2026-001', 'Ceylon Retail guarding services', 'guarding', today - 120, today + 245, 1850000.00, 'monthly', 5, 'active');
  insert into public.contracts (organization_id, client_id, reference, title, service_type, start_date, end_date, value, billing_frequency, required_guards, status) values
    (v_org, c2, 'CT-2026-002', 'Katunayake EPZ perimeter security', 'guarding', today - 60, today + 30, 2400000.00, 'monthly', 4, 'active');
  insert into public.contracts (organization_id, client_id, reference, title, service_type, start_date, end_date, value, billing_frequency, required_guards, status) values
    (v_org, c3, 'CT-2025-014', 'Heritage Hotels front-of-house security', 'guarding', today - 300, today + 12, 980000.00, 'monthly', 2, 'active');

  -- document types (configurable — nothing hard-coded in UI)
  insert into public.document_types (organization_id, name, required, has_expiry) values (v_org, 'Security Guard License', true, true) returning id into dt_license;
  insert into public.document_types (organization_id, name, required, has_expiry) values (v_org, 'National Identity Card', true, false) returning id into dt_nic;
  insert into public.document_types (organization_id, name, required, has_expiry) values (v_org, 'First Aid Certificate', false, true) returning id into dt_training;

  -- guards
  for i in 1..array_length(guard_names,1) loop
    insert into public.guards (organization_id, employee_id, full_name, nic_number, phone, status, hire_date, skills) values
      (v_org, 'GD-' || lpad(i::text, 3, '0'), guard_names[i], '19' || (70 + i)::text || lpad((100000 + i * 137)::text, 6, '0') || 'V',
       '+94 7' || (i % 10)::text || ' 555 02' || lpad(i::text, 2, '0'),
       case when i = 11 then 'on_leave' when i = 12 then 'inactive' else 'active' end,
       today - (30 * i),
       case when i % 3 = 0 then array['CCTV','First Aid'] when i % 3 = 1 then array['Access Control'] else array['Patrol','Fire Watch'] end)
    returning id into gid;
    g := array_append(g, gid);
    -- documents: licence for all, some expiring/expired for the attention list
    insert into public.guard_documents (organization_id, guard_id, document_type_id, document_number, issued_date, expiry_date) values
      (v_org, gid, dt_license, 'LIC-' || lpad(i::text,4,'0'), today - 300,
       case when i = 2 then today - 5 when i <= 4 then today + (10 * i) else today + 200 end);
    insert into public.guard_documents (organization_id, guard_id, document_type_id, document_number, issued_date) values
      (v_org, gid, dt_nic, 'NIC-' || lpad(i::text,4,'0'), today - 1000);
    if i <= 6 then
      insert into public.guard_documents (organization_id, guard_id, document_type_id, document_number, issued_date, expiry_date) values
        (v_org, gid, dt_training, 'FA-' || lpad(i::text,4,'0'), today - 200, today + (case when i = 3 then 8 else 160 end));
    end if;
  end loop;

  -- shifts today & tomorrow with assignments and some attendance
  for i in 1..10 loop
    insert into public.shifts (organization_id, site_id, post_id, shift_date, start_time, end_time, shift_type, required_guards, status) values
      (v_org, case when i <= 3 then s1 when i <= 6 then s3 when i <= 8 then s4 else s2 end,
       case when i <= 3 then (case when i = 1 then p1 when i = 2 then p2 else p1 end)
            when i <= 6 then p3 when i <= 8 then p4 else null end,
       today,
       case when i % 2 = 1 then '06:00' else '18:00' end,
       case when i % 2 = 1 then '18:00' else '06:00' end,
       case when i % 2 = 1 then 'day' else 'night' end, 1, 'scheduled')
    returning id into sh;
    insert into public.shift_assignments (organization_id, shift_id, guard_id, assigned_by) values (v_org, sh, g[i], v_uid);
    -- day shifts: attendance records
    if i % 2 = 1 then
      insert into public.attendance_records (organization_id, guard_id, shift_id, site_id, clock_in_at, clock_in_lat, clock_in_lng, clock_in_within_geofence, clock_out_at, clock_out_within_geofence, flags, status, approval_status) values
        (v_org, g[i], sh, case when i <= 3 then s1 when i <= 6 then s3 when i <= 8 then s4 else s2 end,
         today + time '06:00' + (case when i = 3 then interval '25 minutes' else interval '2 minutes' end),
         6.9055, 79.8518, true,
         case when i <= 2 then today + time '18:05' else null end,
         case when i <= 2 then true else null end,
         case when i = 3 then array['late'] else '{}' end,
         case when i <= 2 then 'completed' when i = 3 then 'present' else 'present' end,
         case when i <= 2 then 'approved' else 'pending' end);
    end if;
  end loop;

  -- tomorrow shifts (unassigned one for open-shift demo)
  for i in 1..5 loop
    insert into public.shifts (organization_id, site_id, post_id, shift_date, start_time, end_time, shift_type, required_guards, status) values
      (v_org, case when i <= 2 then s1 when i <= 4 then s3 else s4 end,
       case when i <= 2 then p1 when i <= 4 then p3 else p4 end,
       today + 1, '06:00', '18:00', 'day', 1, 'scheduled')
    returning id into sh;
    if i < 5 then
      insert into public.shift_assignments (organization_id, shift_id, guard_id, assigned_by) values (v_org, sh, g[i + 5], v_uid);
    end if;
  end loop;

  insert into public.audit_logs (organization_id, actor_id, actor_name, action, entity_type, entity_label, details) values
    (v_org, v_uid, 'System', 'organization.created', 'organization', v_name, jsonb_build_object('demo', true));

  return v_org;
end $$;
