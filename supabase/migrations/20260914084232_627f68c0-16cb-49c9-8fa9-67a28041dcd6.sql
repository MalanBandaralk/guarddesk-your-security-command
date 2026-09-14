create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated, service_role;

alter function public.is_org_member(uuid) set schema app_private;
alter function public.has_org_role(uuid, public.org_role[]) set schema app_private;
alter function public.is_org_manager(uuid) set schema app_private;
grant execute on function app_private.is_org_member(uuid) to authenticated, service_role;
grant execute on function app_private.has_org_role(uuid, public.org_role[]) to authenticated, service_role;
grant execute on function app_private.is_org_manager(uuid) to authenticated, service_role;

create or replace function public.create_demo_organization(_company_name text default null)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  v_org uuid; v_uid uuid := auth.uid(); v_name text := coalesce(nullif(trim(_company_name),''), 'Demo Security (Pvt) Ltd');
  c1 uuid; c2 uuid; c3 uuid; s1 uuid; s2 uuid; s3 uuid; s4 uuid; p1 uuid; p2 uuid; p3 uuid; p4 uuid;
  g uuid[] := array[]::uuid[]; gid uuid; i int; dt_license uuid; dt_nic uuid; dt_training uuid; sh uuid;
  guard_names text[] := array['Nuwan Perera','Kasun Fernando','Saman Jayasuriya','Dinesh Silva','Ruwan Gunawardena','Chaminda Rathnayake','Asanka Wijeratne','Pradeep Kumara','Tharindu Bandara','Lasith Malinga','Roshan De Silva','Ajith Mendis'];
  today date := current_date;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  if (select count(*) from public.organization_members where user_id = v_uid) >= 3 then raise exception 'Workspace limit reached'; end if;
  insert into public.organizations (name, created_by) values (v_name, v_uid) returning id into v_org;
  insert into public.organization_members (organization_id,user_id,role,display_name) values (v_org,v_uid,'admin',coalesce((select full_name from public.profiles where id=v_uid),'Admin'));
  insert into public.clients (organization_id,name,industry,contact_name,contact_email,contact_phone,billing_email,billing_address,status) values
    (v_org,'Ceylon Retail Group','Retail','Nimal Wickramasinghe','nimal@ceylonretail.lk','+94 77 555 0101','accounts@ceylonretail.lk','42 Galle Road, Colombo 03','active') returning id into c1;
  insert into public.clients (organization_id,name,industry,contact_name,contact_email,contact_phone,billing_email,billing_address,status) values
    (v_org,'Lanka Industrial Parks','Industrial','Sithum Perera','sithum@lankaindustrial.lk','+94 71 555 0102','finance@lankaindustrial.lk','Export Processing Zone, Katunayake','active') returning id into c2;
  insert into public.clients (organization_id,name,industry,contact_name,contact_email,contact_phone,billing_email,billing_address,status) values
    (v_org,'Heritage Hotels Colombo','Hospitality','Dilani Fonseka','dilani@heritagehotels.lk','+94 76 555 0103','ap@heritagehotels.lk','88 Marine Drive, Colombo 06','active') returning id into c3;
  insert into public.sites (organization_id,client_id,name,address,city,latitude,longitude,geofence_radius_m,required_guards,operating_hours) values (v_org,c1,'Ceylon Retail — Head Office','42 Galle Road','Colombo 03',6.9055,79.8518,150,3,'24 hours') returning id into s1;
  insert into public.sites (organization_id,client_id,name,address,city,latitude,longitude,geofence_radius_m,required_guards,operating_hours) values (v_org,c1,'Ceylon Retail — Kandy Store','15 Dalada Veediya','Kandy',7.2936,80.6413,120,2,'08:00–22:00') returning id into s2;
  insert into public.sites (organization_id,client_id,name,address,city,latitude,longitude,geofence_radius_m,required_guards,operating_hours) values (v_org,c2,'Katunayake EPZ — Gate A','EPZ Phase 2','Katunayake',7.1647,79.8720,200,4,'24 hours') returning id into s3;
  insert into public.sites (organization_id,client_id,name,address,city,latitude,longitude,geofence_radius_m,required_guards,operating_hours) values (v_org,c3,'Heritage Hotel — Main Entrance','88 Marine Drive','Colombo 06',6.8745,79.8569,100,2,'24 hours') returning id into s4;
  insert into public.posts (organization_id,site_id,name) values (v_org,s1,'Main Gate') returning id into p1;
  insert into public.posts (organization_id,site_id,name) values (v_org,s1,'Loading Bay') returning id into p2;
  insert into public.posts (organization_id,site_id,name,required_guards) values (v_org,s3,'Gate A Checkpoint',2) returning id into p3;
  insert into public.posts (organization_id,site_id,name) values (v_org,s4,'Lobby Entrance') returning id into p4;
  insert into public.contracts (organization_id,client_id,reference,title,start_date,end_date,value,required_guards,status) values
    (v_org,c1,'CT-2026-001','Ceylon Retail guarding services',today-120,today+245,1850000,5,'active'),
    (v_org,c2,'CT-2026-002','Katunayake EPZ perimeter security',today-60,today+30,2400000,4,'active'),
    (v_org,c3,'CT-2025-014','Heritage Hotels front-of-house security',today-300,today+12,980000,2,'active');
  insert into public.document_types (organization_id,name,required,has_expiry) values (v_org,'Security Guard License',true,true) returning id into dt_license;
  insert into public.document_types (organization_id,name,required,has_expiry) values (v_org,'National Identity Card',true,false) returning id into dt_nic;
  insert into public.document_types (organization_id,name,required,has_expiry) values (v_org,'First Aid Certificate',false,true) returning id into dt_training;
  for i in 1..array_length(guard_names,1) loop
    insert into public.guards (organization_id,employee_id,full_name,phone,status,hire_date,skills) values (v_org,'GD-'||lpad(i::text,3,'0'),guard_names[i],'+94 7'||(i%10)::text||' 555 02'||lpad(i::text,2,'0'),case when i=11 then 'on_leave' when i=12 then 'inactive' else 'active' end,today-(30*i),case when i%3=0 then array['CCTV','First Aid'] when i%3=1 then array['Access Control'] else array['Patrol','Fire Watch'] end) returning id into gid;
    g:=array_append(g,gid);
    insert into public.guard_documents (organization_id,guard_id,document_type_id,document_number,issued_date,expiry_date) values (v_org,gid,dt_license,'LIC-'||lpad(i::text,4,'0'),today-300,case when i=2 then today-5 when i<=4 then today+(10*i) else today+200 end);
    insert into public.guard_documents (organization_id,guard_id,document_type_id,document_number,issued_date) values (v_org,gid,dt_nic,'NIC-'||lpad(i::text,4,'0'),today-1000);
  end loop;
  for i in 1..10 loop
    insert into public.shifts (organization_id,site_id,post_id,shift_date,start_time,end_time,shift_type) values (v_org,case when i<=3 then s1 when i<=6 then s3 when i<=8 then s4 else s2 end,case when i<=3 then (case when i=1 then p1 when i=2 then p2 else p1 end) when i<=6 then p3 when i<=8 then p4 else null end,today,case when i%2=1 then '06:00' else '18:00' end,case when i%2=1 then '18:00' else '06:00' end,case when i%2=1 then 'day' else 'night' end) returning id into sh;
    insert into public.shift_assignments (organization_id,shift_id,guard_id,assigned_by) values(v_org,sh,g[i],v_uid);
    if i%2=1 then insert into public.attendance_records (organization_id,guard_id,shift_id,site_id,clock_in_at,clock_in_within_geofence,status,approval_status,flags) values (v_org,g[i],sh,case when i<=3 then s1 when i<=6 then s3 when i<=8 then s4 else s2 end,today+time '06:00'+case when i=3 then interval '25 minutes' else interval '2 minutes' end,true,'present',case when i<=2 then 'approved' else 'pending' end,case when i=3 then array['late'] else '{}' end); end if;
  end loop;
  return v_org;
end $$;
revoke execute on function public.create_demo_organization(text) from public, anon;
grant execute on function public.create_demo_organization(text) to authenticated;

revoke execute on function public.prevent_guard_attendance_approval() from public, anon, authenticated;
