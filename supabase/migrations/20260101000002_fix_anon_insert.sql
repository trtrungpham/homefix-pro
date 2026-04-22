-- Fix: anon role cần GRANT INSERT + policy phải explicit "to anon"
-- (Supabase mặc định cấp SELECT cho anon, nhưng KHÔNG cấp INSERT)

grant insert on public.orders to anon;
grant insert on public.project_inquiries to anon;

-- Recreate policies với role rõ ràng
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert" on public.orders
  for insert to anon, authenticated
  with check (true);

drop policy if exists "projects public insert" on public.project_inquiries;
create policy "projects public insert" on public.project_inquiries
  for insert to anon, authenticated
  with check (true);
