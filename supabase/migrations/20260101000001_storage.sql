-- Create public "uploads" bucket for customer images
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Allow anonymous uploads (public form) and public read
drop policy if exists "public can upload" on storage.objects;
create policy "public can upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'uploads');

drop policy if exists "public can read uploads" on storage.objects;
create policy "public can read uploads" on storage.objects
  for select using (bucket_id = 'uploads');

drop policy if exists "admin can delete uploads" on storage.objects;
create policy "admin can delete uploads" on storage.objects
  for delete using (bucket_id = 'uploads' and public.is_admin());
