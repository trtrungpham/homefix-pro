# HomeFix Pro

Website dịch vụ sửa chữa, thầu công trình, tiện ích gia đình. Full-stack Next.js + Supabase, deploy trên Vercel.

## Tính năng

**Public**
- Trang chủ với 3 nhóm dịch vụ + form gọi thợ nhanh
- Danh mục sửa chữa (điện, nước, máy lạnh, mạng, camera...)
- Trang chi tiết dịch vụ với báo giá, FAQ
- Form thầu công trình cho doanh nghiệp
- Dịch vụ giúp việc & chuyển đồ
- Đặt lịch có upload ảnh

**Admin** (`/admin/login`)
- Dashboard thống kê đơn + doanh thu
- Quản lý đơn sửa chữa (gán thợ, cập nhật trạng thái)
- Quản lý đơn thầu công trình
- CRUD dịch vụ & bảng giá
- CRUD đội thợ
- Cài đặt hotline, email, banner

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + Storage) · React Hook Form + Zod · Sonner

---

## Cài đặt local

### 1. Yêu cầu
- Node 18+
- Tài khoản Supabase (free tier)

### 2. Tạo project Supabase

1. Vào https://supabase.com → **New project**
2. Chọn region gần VN (Singapore hoặc Tokyo)
3. Ghi lại **Project URL** và **anon key** (Settings → API)
4. Lưu **service_role key** (dùng cho script admin)

### 3. Clone + cài deps

```bash
cd homefix-pro
npm install
cp .env.example .env.local
```

Điền `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Chạy migration + seed

Vào **Supabase Dashboard → SQL Editor** và chạy lần lượt:

1. `supabase/migrations/20260101000000_init.sql` - tạo bảng, RLS
2. `supabase/migrations/20260101000001_storage.sql` - tạo bucket uploads
3. `supabase/seed.sql` - seed dịch vụ mẫu + bảng giá

### 5. Tạo tài khoản admin đầu tiên

1. **Dashboard → Authentication → Users → Add user**
   - Email: `admin@homefixpro.vn`
   - Password: `Admin@123456`
   - ✅ Auto confirm user
2. Mở **SQL Editor** chạy:

```sql
update public.profiles
set role = 'admin', full_name = 'Quản trị viên'
where id = (select id from auth.users where email = 'admin@homefixpro.vn');
```

> File `supabase/create_admin.sql` cũng có sẵn lệnh này.

### 6. Chạy dev server

```bash
npm run dev
```

Mở http://localhost:3000 - trang chủ
Admin: http://localhost:3000/admin/login

---

## Deploy lên Vercel

### 1. Push code lên GitHub

```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/your/homefix-pro.git
git push -u origin main
```

### 2. Import vào Vercel

1. vercel.com → **Add New → Project** → chọn repo
2. Framework: Next.js (auto-detect)
3. **Environment Variables** - thêm 4 biến như `.env.local`
4. Deploy

### 3. Cấu hình Supabase cho domain production

**Authentication → URL Configuration**
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: thêm `https://your-app.vercel.app/**`

---

## Cấu trúc thư mục

```
homefix-pro/
├── src/
│   ├── app/
│   │   ├── (public)/          # Trang public (có header/footer)
│   │   │   ├── page.tsx       # Trang chủ
│   │   │   ├── sua-chua/
│   │   │   ├── thau-cong-trinh/
│   │   │   ├── tien-ich/
│   │   │   ├── dat-lich/
│   │   │   └── lien-he/
│   │   ├── admin/
│   │   │   ├── login/         # Public login page
│   │   │   └── (authed)/      # Protected admin pages
│   │   │       ├── dashboard/
│   │   │       ├── orders/
│   │   │       ├── projects/
│   │   │       ├── services/
│   │   │       ├── workers/
│   │   │       └── settings/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                # Button, Input, Card...
│   │   ├── layout/            # Header, Footer
│   │   └── forms/             # Các form (booking, login, admin...)
│   ├── lib/
│   │   ├── supabase/          # Client, server, middleware
│   │   └── utils.ts
│   ├── types/
│   └── middleware.ts          # Bảo vệ /admin
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## Thêm / sửa dịch vụ và giá

**Cách 1: qua trang admin (khuyến nghị)**

1. Đăng nhập `/admin/login`
2. Menu **Dịch vụ & giá**
3. Nhấn **Thêm dịch vụ** hoặc **Sửa** trên dòng tương ứng
4. Điền: tên, slug, danh mục, giá khởi điểm, đơn vị (`lần`, `giờ`, `m²`...), mô tả
5. Lưu - dịch vụ sẽ xuất hiện ngay trên trang web (revalidate sau 60s)

**Cách 2: qua SQL**

```sql
insert into services (category_id, slug, name, base_price, price_unit, description)
values (
  (select id from service_categories where slug = 'sua-chua-gia-dinh'),
  'son-nha-tron-goi', 'Sơn nhà trọn gói', 80000, 'm²', 'Sơn nội thất và ngoại thất'
);
```

---

## Bảng giá mặc định (có thể chỉnh trong admin)

### Sửa chữa gia đình
| Dịch vụ | Giá khởi điểm |
|---|---|
| Sửa điện dân dụng | 150.000₫ |
| Sửa máy lạnh | 200.000₫ |
| Sửa máy giặt | 180.000₫ |
| Sửa tủ lạnh | 200.000₫ |
| Sửa đường nước | 150.000₫ |
| Lắp thiết bị vệ sinh | 250.000₫ |
| Sửa mạng / wifi | 120.000₫ |
| Lắp camera | 300.000₫/điểm |
| Sơn sửa nhà | Liên hệ |

### Tiện ích
| Dịch vụ | Giá |
|---|---|
| Giúp việc theo giờ | 60.000₫/giờ |
| Giúp việc theo ngày | 450.000₫/ngày |
| Giúp việc ở lại | 6.000.000₫/tháng |
| Chuyển đồ xe 500kg | 400.000₫/chuyến |
| Chuyển đồ xe 1 tấn | 600.000₫/chuyến |
| Chuyển đồ xe 1.5 tấn | 800.000₫/chuyến |

---

## Bảo mật

- Row Level Security bật cho mọi bảng
- Form public chỉ có quyền `INSERT` vào `orders` và `project_inquiries`
- Admin xác thực bằng Supabase Auth + check `profiles.role = 'admin'` ở middleware + layout + trong mỗi mutation
- `SUPABASE_SERVICE_ROLE_KEY` KHÔNG được commit, chỉ dùng ở server

## Mở rộng trong tương lai

- Gửi email xác nhận đơn qua Resend
- SMS OTP cho khách qua Twilio / eSMS
- Tích hợp thanh toán (Momo, VNPay)
- Biểu đồ doanh thu theo ngày (recharts đã cài sẵn)
- App cho thợ nhận đơn (React Native)

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # production server
npm run lint       # ESLint
npm run typecheck  # TypeScript check
```

## License

MIT
