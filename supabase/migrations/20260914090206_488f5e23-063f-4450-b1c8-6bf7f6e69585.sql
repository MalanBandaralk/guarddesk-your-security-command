create or replace function app_private.is_platform_admin(_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.platform_admins where user_id = _user_id)
$$;
revoke execute on function app_private.is_platform_admin(uuid) from anon, public;
grant execute on function app_private.is_platform_admin(uuid) to authenticated;

drop policy "Users can see their own platform admin status" on public.platform_admins;
drop policy "Platform admins can manage platform admins" on public.platform_admins;
drop policy "Platform admins can view all organizations" on public.organizations;
drop policy "Platform admins can view all subscriptions" on public.subscriptions;
drop policy "Platform admins can view all members" on public.organization_members;

create policy "Users can see their own platform admin status"
  on public.platform_admins for select to authenticated
  using (user_id = auth.uid() or app_private.is_platform_admin(auth.uid()));

create policy "Platform admins can manage platform admins"
  on public.platform_admins for all to authenticated
  using (app_private.is_platform_admin(auth.uid()))
  with check (app_private.is_platform_admin(auth.uid()));

create policy "Platform admins can view all organizations"
  on public.organizations for select to authenticated
  using (app_private.is_platform_admin(auth.uid()));

create policy "Platform admins can view all subscriptions"
  on public.subscriptions for select to authenticated
  using (app_private.is_platform_admin(auth.uid()));

create policy "Platform admins can view all members"
  on public.organization_members for select to authenticated
  using (app_private.is_platform_admin(auth.uid()));

drop function public.is_platform_admin(uuid);