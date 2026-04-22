import Link from "next/link";
import { Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/sua-chua", label: "Sửa chữa" },
  { href: "/thau-cong-trinh", label: "Thầu công trình" },
  { href: "/tien-ich", label: "Tiện ích" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Wrench className="h-5 w-5" />
          </span>
          <span>HomeFix Pro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brand-600 transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:19001234" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Phone className="h-4 w-4" /> 1900-1234
          </a>
          <Link href="/dat-lich">
            <Button size="sm">Đặt thợ ngay</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
