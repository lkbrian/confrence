-- Photo bucket access for the live hub. Run on its own in Supabase → SQL editor (safe to re-run),
-- and again whenever the bucket is renamed: policies are tied to the bucket name.
--
-- The bucket itself (VITE_BUCKET_NAME, here 'pastors-conf') is created in the dashboard and must be
-- PUBLIC so visitors can see photos. Uploads and deletes go through the signed-in admin's session.
--
-- If this fails with "must be owner of table objects", create the same three policies in
-- Storage → Policies → pastors-conf instead: SELECT for anon + authenticated, INSERT and DELETE
-- for authenticated.

drop policy if exists "happening photos public read" on storage.objects;
create policy "happening photos public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'pastors-conf');

drop policy if exists "happening photos admin insert" on storage.objects;
create policy "happening photos admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'pastors-conf');

drop policy if exists "happening photos admin delete" on storage.objects;
create policy "happening photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'pastors-conf');
