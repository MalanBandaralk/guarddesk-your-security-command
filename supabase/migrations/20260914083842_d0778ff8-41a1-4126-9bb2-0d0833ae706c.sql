alter table public.organizations add column if not exists created_by uuid references auth.users(id) on delete set null;
create index if not exists organization_members_user_idx on public.organization_members(user_id);

alter policy "orgs_insert_authed" on public.organizations with check (created_by = auth.uid());
alter policy "members_insert_admin" on public.organization_members with check (
  public.has_org_role(organization_id, array['admin']::public.org_role[])
  or (user_id = auth.uid() and role = 'admin' and exists (
    select 1 from public.organizations o where o.id = organization_id and o.created_by = auth.uid()
  ) and not exists (select 1 from public.organization_members om where om.organization_id = organization_id))
);
alter policy "notifications_insert" on public.notifications with check (public.is_org_manager(organization_id));
alter policy "corrections_insert" on public.attendance_corrections with check (
  public.is_org_manager(organization_id) and corrected_by = auth.uid() and exists (
    select 1 from public.attendance_records a where a.id = attendance_id and a.organization_id = attendance_corrections.organization_id
  )
);

create or replace function public.prevent_guard_attendance_approval()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_org_manager(new.organization_id) and (
    new.approval_status is distinct from old.approval_status or new.approved_by is distinct from old.approved_by or new.approved_at is distinct from old.approved_at
  ) then raise exception 'Only managers may modify attendance approval'; end if;
  return new;
end $$;
revoke execute on function public.prevent_guard_attendance_approval() from public, anon, authenticated;
create trigger prevent_guard_attendance_approval before update on public.attendance_records for each row execute function public.prevent_guard_attendance_approval();

create table public.patrol_routes (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 site_id uuid not null references public.sites(id) on delete cascade, name text not null, expected_duration_minutes integer not null default 30,
 frequency_minutes integer not null default 120, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.patrol_routes to authenticated; grant all on public.patrol_routes to service_role;
alter table public.patrol_routes enable row level security;
create policy "patrol_routes_read" on public.patrol_routes for select to authenticated using (public.is_org_member(organization_id));
create policy "patrol_routes_write" on public.patrol_routes for all to authenticated using (public.is_org_manager(organization_id)) with check (public.is_org_manager(organization_id));

create table public.patrol_checkpoints (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 route_id uuid not null references public.patrol_routes(id) on delete cascade, name text not null, sequence_number integer not null,
 verification_method text not null default 'qr', latitude double precision, longitude double precision, geofence_radius_m integer not null default 50,
 instructions text, created_at timestamptz not null default now(), unique(route_id, sequence_number)
);
grant select, insert, update, delete on public.patrol_checkpoints to authenticated; grant all on public.patrol_checkpoints to service_role;
alter table public.patrol_checkpoints enable row level security;
create policy "patrol_checkpoints_read" on public.patrol_checkpoints for select to authenticated using (public.is_org_member(organization_id));
create policy "patrol_checkpoints_write" on public.patrol_checkpoints for all to authenticated using (public.is_org_manager(organization_id)) with check (public.is_org_manager(organization_id));

create table public.patrol_runs (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 route_id uuid not null references public.patrol_routes(id), guard_id uuid not null references public.guards(id), shift_id uuid references public.shifts(id),
 started_at timestamptz, completed_at timestamptz, status text not null default 'scheduled', flags text[] not null default '{}',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.patrol_runs to authenticated; grant all on public.patrol_runs to service_role;
alter table public.patrol_runs enable row level security;
create policy "patrol_runs_read" on public.patrol_runs for select to authenticated using (public.is_org_member(organization_id));
create policy "patrol_runs_write" on public.patrol_runs for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create table public.patrol_scans (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 patrol_run_id uuid not null references public.patrol_runs(id) on delete cascade, checkpoint_id uuid not null references public.patrol_checkpoints(id),
 scanned_at timestamptz not null default now(), latitude double precision, longitude double precision, within_geofence boolean,
 status text not null default 'valid', photo_path text, note text, created_at timestamptz not null default now()
);
grant select, insert on public.patrol_scans to authenticated; grant all on public.patrol_scans to service_role;
alter table public.patrol_scans enable row level security;
create policy "patrol_scans_read" on public.patrol_scans for select to authenticated using (public.is_org_member(organization_id));
create policy "patrol_scans_create" on public.patrol_scans for insert to authenticated with check (public.is_org_member(organization_id));

create table public.incidents (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 site_id uuid not null references public.sites(id), post_id uuid references public.posts(id), guard_id uuid references public.guards(id), shift_id uuid references public.shifts(id),
 reference text not null, title text not null, description text not null, category text not null default 'general', severity text not null default 'medium',
 status text not null default 'open', occurred_at timestamptz not null, reported_by uuid references auth.users(id), latitude double precision, longitude double precision,
 photo_paths text[] not null default '{}', resolution text, resolved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, reference)
);
grant select, insert, update on public.incidents to authenticated; grant all on public.incidents to service_role;
alter table public.incidents enable row level security;
create policy "incidents_read" on public.incidents for select to authenticated using (public.is_org_member(organization_id));
create policy "incidents_create" on public.incidents for insert to authenticated with check (public.is_org_member(organization_id) and reported_by = auth.uid());
create policy "incidents_update" on public.incidents for update to authenticated using (public.is_org_manager(organization_id));

create table public.daily_reports (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 site_id uuid not null references public.sites(id), report_date date not null, shift_id uuid references public.shifts(id), prepared_by uuid references auth.users(id),
 summary text not null default '', attendance_summary jsonb not null default '{}', patrol_summary jsonb not null default '{}', incident_summary jsonb not null default '{}',
 status text not null default 'draft', submitted_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(site_id, report_date, shift_id)
);
grant select, insert, update on public.daily_reports to authenticated; grant all on public.daily_reports to service_role;
alter table public.daily_reports enable row level security;
create policy "daily_reports_read" on public.daily_reports for select to authenticated using (public.is_org_member(organization_id));
create policy "daily_reports_write" on public.daily_reports for all to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create table public.post_orders (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 site_id uuid not null references public.sites(id), post_id uuid references public.posts(id), title text not null, content text not null,
 version integer not null default 1, effective_from date not null default current_date, active boolean not null default true,
 created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.post_orders to authenticated; grant all on public.post_orders to service_role;
alter table public.post_orders enable row level security;
create policy "post_orders_read" on public.post_orders for select to authenticated using (public.is_org_member(organization_id));
create policy "post_orders_write" on public.post_orders for all to authenticated using (public.is_org_manager(organization_id)) with check (public.is_org_manager(organization_id));

create table public.leave_types (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 name text not null, paid boolean not null default false, annual_allowance_days numeric(6,2), active boolean not null default true, created_at timestamptz not null default now(), unique(organization_id,name)
);
grant select, insert, update, delete on public.leave_types to authenticated; grant all on public.leave_types to service_role;
alter table public.leave_types enable row level security;
create policy "leave_types_read" on public.leave_types for select to authenticated using (public.is_org_member(organization_id));
create policy "leave_types_write" on public.leave_types for all to authenticated using (public.is_org_manager(organization_id)) with check (public.is_org_manager(organization_id));

create table public.leave_requests (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 guard_id uuid not null references public.guards(id), leave_type_id uuid not null references public.leave_types(id), start_date date not null, end_date date not null,
 reason text, status text not null default 'pending', reviewed_by uuid references auth.users(id), reviewed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.leave_requests to authenticated; grant all on public.leave_requests to service_role;
alter table public.leave_requests enable row level security;
create policy "leave_requests_read" on public.leave_requests for select to authenticated using (public.is_org_member(organization_id));
create policy "leave_requests_create" on public.leave_requests for insert to authenticated with check (public.is_org_member(organization_id));
create policy "leave_requests_update" on public.leave_requests for update to authenticated using (public.is_org_manager(organization_id));

create table public.equipment (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 asset_code text not null, name text not null, category text not null, status text not null default 'available', serial_number text,
 purchase_date date, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id,asset_code)
);
grant select, insert, update, delete on public.equipment to authenticated; grant all on public.equipment to service_role;
alter table public.equipment enable row level security;
create policy "equipment_read" on public.equipment for select to authenticated using (public.is_org_member(organization_id));
create policy "equipment_write" on public.equipment for all to authenticated using (public.is_org_manager(organization_id)) with check (public.is_org_manager(organization_id));

create table public.pay_rules (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 name text not null, rule_type text not null, calculation_method text not null, rate numeric(14,4) not null default 0, conditions jsonb not null default '{}', active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.pay_rules to authenticated; grant all on public.pay_rules to service_role;
alter table public.pay_rules enable row level security;
create policy "pay_rules_read" on public.pay_rules for select to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));
create policy "pay_rules_write" on public.pay_rules for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.payroll_periods (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 name text not null, start_date date not null, end_date date not null, status text not null default 'draft', approved_by uuid references auth.users(id), approved_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.payroll_periods to authenticated; grant all on public.payroll_periods to service_role;
alter table public.payroll_periods enable row level security;
create policy "payroll_periods_access" on public.payroll_periods for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.payroll_records (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 payroll_period_id uuid not null references public.payroll_periods(id), guard_id uuid not null references public.guards(id), normal_hours numeric(10,2) not null default 0,
 overtime_hours numeric(10,2) not null default 0, gross_pay numeric(14,2) not null default 0, deductions numeric(14,2) not null default 0, net_pay numeric(14,2) not null default 0,
 calculation_details jsonb not null default '{}', status text not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(payroll_period_id,guard_id)
);
grant select, insert, update on public.payroll_records to authenticated; grant all on public.payroll_records to service_role;
alter table public.payroll_records enable row level security;
create policy "payroll_records_access" on public.payroll_records for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.invoices (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 client_id uuid not null references public.clients(id), contract_id uuid references public.contracts(id), invoice_number text not null, issue_date date not null, due_date date not null,
 service_period_start date, service_period_end date, subtotal numeric(14,2) not null default 0, tax_amount numeric(14,2) not null default 0, total numeric(14,2) not null default 0,
 status text not null default 'draft', notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id,invoice_number)
);
grant select, insert, update on public.invoices to authenticated; grant all on public.invoices to service_role;
alter table public.invoices enable row level security;
create policy "invoices_access" on public.invoices for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.invoice_items (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 invoice_id uuid not null references public.invoices(id) on delete cascade, description text not null, quantity numeric(12,2) not null default 1,
 unit_rate numeric(14,2) not null default 0, amount numeric(14,2) not null default 0, source_type text, source_id uuid, created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.invoice_items to authenticated; grant all on public.invoice_items to service_role;
alter table public.invoice_items enable row level security;
create policy "invoice_items_access" on public.invoice_items for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.payments (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 invoice_id uuid references public.invoices(id), amount numeric(14,2) not null, payment_date date not null, method text, reference text, notes text, created_at timestamptz not null default now()
);
grant select, insert, update on public.payments to authenticated; grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "payments_access" on public.payments for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.expenses (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 site_id uuid references public.sites(id), contract_id uuid references public.contracts(id), category text not null, description text not null, amount numeric(14,2) not null,
 expense_date date not null, receipt_path text, status text not null default 'recorded', created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.expenses to authenticated; grant all on public.expenses to service_role;
alter table public.expenses enable row level security;
create policy "expenses_access" on public.expenses for all to authenticated using (public.has_org_role(organization_id,array['admin','finance']::public.org_role[])) with check (public.has_org_role(organization_id,array['admin','finance']::public.org_role[]));

create table public.subscription_plans (
 id uuid primary key default gen_random_uuid(), name text not null, code text not null unique, currency_code text not null default 'LKR', monthly_price numeric(14,2) not null,
 limits jsonb not null default '{}', features jsonb not null default '{}', active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.subscription_plans to authenticated; grant all on public.subscription_plans to service_role;
alter table public.subscription_plans enable row level security;
create policy "plans_read" on public.subscription_plans for select to authenticated using (active = true);

create table public.subscriptions (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade unique,
 plan_id uuid not null references public.subscription_plans(id), status text not null default 'trialing', trial_ends_at timestamptz, current_period_start timestamptz, current_period_end timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.subscriptions to authenticated; grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;
create policy "subscriptions_read" on public.subscriptions for select to authenticated using (public.has_org_role(organization_id,array['admin']::public.org_role[]));

create index patrol_routes_org_idx on public.patrol_routes(organization_id); create index patrol_runs_org_idx on public.patrol_runs(organization_id,created_at desc);
create index incidents_org_idx on public.incidents(organization_id,occurred_at desc); create index invoices_org_idx on public.invoices(organization_id,due_date);
create index expenses_org_idx on public.expenses(organization_id,expense_date); create index payroll_records_org_idx on public.payroll_records(organization_id);

do $$ declare t text; begin foreach t in array array['patrol_routes','patrol_runs','incidents','daily_reports','post_orders','leave_requests','equipment','pay_rules','payroll_periods','payroll_records','invoices','expenses','subscription_plans','subscriptions'] loop execute format('create trigger set_updated_at before update on public.%I for each row execute function public.update_updated_at_column()',t); end loop; end $$;