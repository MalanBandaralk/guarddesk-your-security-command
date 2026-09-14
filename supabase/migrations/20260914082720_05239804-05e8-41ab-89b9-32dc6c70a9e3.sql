
-- Lock down SECURITY DEFINER functions: no access for anonymous users.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_double_booking() from public, anon, authenticated;
revoke execute on function public.is_org_member(uuid) from public, anon;
revoke execute on function public.has_org_role(uuid, public.org_role[]) from public, anon;
revoke execute on function public.is_org_manager(uuid) from public, anon;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
revoke execute on function public.create_demo_organization(text) from public, anon;
-- keep authenticated execute for the RLS helpers and the demo generator (required)
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, public.org_role[]) to authenticated;
grant execute on function public.is_org_manager(uuid) to authenticated;
grant execute on function public.create_demo_organization(text) to authenticated;
