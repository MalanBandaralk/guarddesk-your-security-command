create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
grant select on public.platform_admins to authenticated;
grant all on public.platform_admins to service_role;
alter table public.platform_admins enable row level security;

create or replace function public.is_platform_admin(_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.platform_admins where user_id = _user_id)
$$;
revoke execute on function public.is_platform_admin(uuid) from anon;
grant execute on function public.is_platform_admin(uuid) to authenticated;

create policy "Users can see their own platform admin status"
  on public.platform_admins for select to authenticated
  using (user_id = auth.uid() or public.is_platform_admin(auth.uid()));

create policy "Platform admins can manage platform admins"
  on public.platform_admins for all to authenticated
  using (public.is_platform_admin(auth.uid()))
  with check (public.is_platform_admin(auth.uid()));

-- Platform admins can view organizations and subscriptions cross-tenant
create policy "Platform admins can view all organizations"
  on public.organizations for select to authenticated
  using (public.is_platform_admin(auth.uid()));

create policy "Platform admins can view all subscriptions"
  on public.subscriptions for select to authenticated
  using (public.is_platform_admin(auth.uid()));

create policy "Platform admins can view all members"
  on public.organization_members for select to authenticated
  using (public.is_platform_admin(auth.uid()));

-- Bootstrap the first platform admin
insert into public.platform_admins (user_id)
select id from auth.users where email = 'malanbandaralk@gmail.com'
on conflict (user_id) do nothing;