revoke insert on public.audit_logs from authenticated;
drop policy if exists "audit_insert" on public.audit_logs;

create policy "guard_documents_storage_read" on storage.objects for select to authenticated using (
  bucket_id = 'guard-documents' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.is_org_member(((storage.foldername(name))[1])::uuid)
);
create policy "guard_documents_storage_create" on storage.objects for insert to authenticated with check (
  bucket_id = 'guard-documents' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.is_org_manager(((storage.foldername(name))[1])::uuid)
);
create policy "guard_documents_storage_update" on storage.objects for update to authenticated using (
  bucket_id = 'guard-documents' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.is_org_manager(((storage.foldername(name))[1])::uuid)
) with check (
  bucket_id = 'guard-documents' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.is_org_manager(((storage.foldername(name))[1])::uuid)
);
create policy "guard_documents_storage_delete" on storage.objects for delete to authenticated using (
  bucket_id = 'guard-documents' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.is_org_manager(((storage.foldername(name))[1])::uuid)
);