-- Seed dữ liệu mẫu cho HomeFix Pro
-- Chạy sau migration init

insert into public.service_categories (slug, name, icon, sort_order) values
  ('sua-chua-gia-dinh', 'Sửa chữa gia đình', 'wrench', 1),
  ('thau-cong-trinh', 'Thầu công trình xây dựng', 'building', 2),
  ('tien-ich', 'Dịch vụ tiện ích', 'sparkles', 3)
on conflict (slug) do nothing;

-- Sửa chữa gia đình
with cat as (select id from public.service_categories where slug = 'sua-chua-gia-dinh')
insert into public.services (category_id, slug, name, description, base_price, price_unit, sort_order)
select cat.id, x.slug, x.name, x.description, x.price, x.unit, x.so
from cat, (values
  ('sua-dien-dan-dung','Sửa điện dân dụng','Khắc phục sự cố ổ cắm, công tắc, dây điện, đèn chiếu sáng tại nhà.', 150000, 'lần', 1),
  ('sua-may-lanh','Sửa máy lạnh / điều hòa','Vệ sinh, nạp gas, sửa lỗi không lạnh, không lên nguồn.', 200000, 'lần', 2),
  ('sua-may-giat','Sửa máy giặt','Sửa lỗi không vắt, không cấp nước, kêu to, rò rỉ nước.', 180000, 'lần', 3),
  ('sua-tu-lanh','Sửa tủ lạnh','Khắc phục lỗi không lạnh, đóng tuyết, chảy nước, không hoạt động.', 200000, 'lần', 4),
  ('sua-duong-ong-nuoc','Sửa đường ống nước','Sửa rò rỉ, tắc nghẽn, lắp đặt đường ống mới.', 150000, 'lần', 5),
  ('lap-thiet-bi-ve-sinh','Lắp đặt thiết bị vệ sinh','Lắp bồn cầu, lavabo, vòi sen, bình nóng lạnh.', 250000, 'lần', 6),
  ('sua-mang-internet','Sửa mạng internet / wifi','Khắc phục mất mạng, wifi yếu, lắp đặt router, đi dây mạng.', 120000, 'lần', 7),
  ('lap-camera','Lắp đặt camera giám sát','Tư vấn vị trí, lắp đặt camera trong và ngoài nhà.', 300000, 'điểm', 8),
  ('son-sua-nha','Sơn sửa nhà cửa','Sơn lại tường, trần, chống thấm. Báo giá theo m².', 0, 'm²', 9)
) as x(slug,name,description,price,unit,so)
on conflict (slug) do nothing;

-- Tiện ích
with cat as (select id from public.service_categories where slug = 'tien-ich')
insert into public.services (category_id, slug, name, description, base_price, price_unit, sort_order)
select cat.id, x.slug, x.name, x.description, x.price, x.unit, x.so
from cat, (values
  ('giup-viec-theo-gio','Giúp việc theo giờ','Dọn dẹp, lau chùi, giặt ủi theo giờ.', 60000, 'giờ', 1),
  ('giup-viec-theo-ngay','Giúp việc theo ngày','Giúp việc 8 tiếng/ngày, công việc tổng quát.', 450000, 'ngày', 2),
  ('giup-viec-o-lai','Giúp việc ở lại','Giúp việc ở lại nhà, thoả thuận theo tháng.', 6000000, 'tháng', 3),
  ('chuyen-do-500kg','Chuyển đồ - xe 500kg','Xe tải nhỏ, phù hợp chuyển trọ, văn phòng nhỏ.', 400000, 'chuyến', 4),
  ('chuyen-do-1tan','Chuyển đồ - xe 1 tấn','Xe 1 tấn, phù hợp chuyển nhà nhỏ.', 600000, 'chuyến', 5),
  ('chuyen-do-15tan','Chuyển đồ - xe 1.5 tấn','Xe 1.5 tấn, phù hợp chuyển nhà lớn.', 800000, 'chuyến', 6)
) as x(slug,name,description,price,unit,so)
on conflict (slug) do nothing;

-- Settings mặc định
insert into public.settings (key, value) values
  ('contact', '{"hotline":"1900-1234","email":"contact@homefixpro.vn","address":"123 Nguyễn Văn Linh, Q.7, TP.HCM","working_hours":"7:00 - 21:00 hằng ngày"}'),
  ('hero', '{"title":"Gọi thợ tận nơi - Nhanh - Uy tín - Bảo hành","subtitle":"Đội ngũ thợ chuyên nghiệp, có mặt trong vòng 30 phút tại TP.HCM và Hà Nội."}')
on conflict (key) do update set value = excluded.value, updated_at = now();
