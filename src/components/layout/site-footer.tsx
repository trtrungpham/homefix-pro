import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-50 mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-bold text-lg mb-3">HomeFix Pro</div>
          <p className="text-gray-600">
            Dịch vụ sửa chữa, thầu công trình, tiện ích gia đình - nhanh chóng, uy tín, bảo hành.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Dịch vụ</div>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="/sua-chua">Sửa chữa gia đình</Link></li>
            <li><Link href="/thau-cong-trinh">Thầu công trình</Link></li>
            <li><Link href="/tien-ich">Giúp việc & chuyển đồ</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Hỗ trợ</div>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="/dat-lich">Đặt lịch</Link></li>
            <li><Link href="/lien-he">Liên hệ</Link></li>
            <li><Link href="/admin/login">Đăng nhập quản trị</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Liên hệ</div>
          <ul className="space-y-2 text-gray-600">
            <li>Hotline: <a className="text-brand-700 font-semibold" href="tel:19001234">1900-1234</a></li>
            <li>Email: contact@homefixpro.vn</li>
            <li>123 Nguyễn Văn Linh, Q.7, TP.HCM</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} HomeFix Pro. All rights reserved.
      </div>
    </footer>
  );
}
