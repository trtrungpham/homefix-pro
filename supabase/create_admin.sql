-- Promote an existing auth user to admin
-- 1) First create the user via Supabase Dashboard -> Authentication -> Add user
--    Email: admin@homefixpro.vn
--    Password: Admin@123456
-- 2) Then run this script (replace email if needed):

update public.profiles
set role = 'admin', full_name = coalesce(full_name, 'Quản trị viên')
where id = (select id from auth.users where email = 'admin@homefixpro.vn');
