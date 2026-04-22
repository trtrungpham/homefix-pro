import Link from "next/link";
import { Wrench, Building2, Sparkles, Clock, Shield, BadgeCheck, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickBookingForm } from "@/components/forms/quick-booking-form";
import { createClient } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id,slug,name,base_price,price_unit,category_id,service_categories!inner(slug)")
    .eq("is_active", true)
    .order("sort_order");

  const repairServices = (services ?? []).filter(
    (s: any) => s.service_categories?.slug === "sua-chua-gia-dinh"
  );

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-orange-50 border-b">
        <div className="container py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 text-brand-700 px-3 py-1 text-sm font-semibold">
              <BadgeCheck className="h-4 w-4" /> Bảo hành dịch vụ 30 ngày
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Gọi thợ tận nơi <br />
              <span className="text-brand-600">Nhanh - Uy tín - Bảo hành</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Đội ngũ thợ chuyên nghiệp có mặt trong vòng 30 phút tại TP.HCM và Hà Nội. Báo giá minh bạch trước khi thi công.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dat-lich">
                <Button size="lg">Đặt thợ ngay</Button>
              </Link>
              <a href="tel:19001234">
                <Button size="lg" variant="outline">
                  <PhoneCall className="h-4 w-4" /> 1900-1234
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-600" /> Có mặt sau 30 phút</div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-brand-600" /> Bảo hành 30 ngày</div>
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand-600" /> Báo giá minh bạch</div>
            </div>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">⚡ Gọi thợ nhanh</h3>
              <QuickBookingForm services={services ?? []} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Chọn dịch vụ bạn cần</h2>
          <p className="mt-2 text-gray-600">3 nhóm dịch vụ chính, đáp ứng mọi nhu cầu của bạn</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <CategoryCard
            href="/sua-chua"
            icon={<Wrench className="h-8 w-8" />}
            title="Sửa chữa gia đình"
            description="Điện, nước, máy lạnh, máy giặt, tủ lạnh, mạng wifi, camera..."
            color="bg-brand-100 text-brand-700"
          />
          <CategoryCard
            href="/thau-cong-trinh"
            icon={<Building2 className="h-8 w-8" />}
            title="Thầu công trình"
            description="Nhà phố, biệt thự, văn phòng, nhà xưởng - dành cho doanh nghiệp."
            color="bg-blue-100 text-blue-700"
          />
          <CategoryCard
            href="/tien-ich"
            icon={<Sparkles className="h-8 w-8" />}
            title="Dịch vụ tiện ích"
            description="Giúp việc theo giờ/ngày, chuyển đồ, chuyển nhà trọn gói."
            color="bg-purple-100 text-purple-700"
          />
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Dịch vụ phổ biến</h2>
              <p className="mt-2 text-gray-600">Bảng giá tham khảo - báo giá chính thức trước khi thi công</p>
            </div>
            <Link href="/sua-chua" className="text-brand-700 font-semibold hidden md:block">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {repairServices.slice(0, 8).map((s: any) => (
              <Link key={s.id} href={`/sua-chua/${s.slug}`}>
                <Card className="h-full hover:shadow-md hover:border-brand-300 transition">
                  <CardContent className="p-5">
                    <div className="font-semibold">{s.name}</div>
                    <div className="mt-2 text-brand-700 font-bold">
                      Từ {formatVnd(s.base_price)}/{s.price_unit}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Quy trình 4 bước</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: 1, title: "Đặt lịch", desc: "Gọi hotline hoặc đặt online" },
            { n: 2, title: "Xác nhận", desc: "Tổng đài liên hệ trong 5 phút" },
            { n: 3, title: "Thợ đến tận nơi", desc: "Có mặt sau 30 phút, báo giá rõ ràng" },
            { n: 4, title: "Thanh toán & bảo hành", desc: "Chỉ thanh toán khi hài lòng, bảo hành 30 ngày" },
          ].map((s) => (
            <Card key={s.n}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">
                  {s.n}
                </div>
                <div className="mt-3 font-semibold">{s.title}</div>
                <div className="mt-1 text-sm text-gray-600">{s.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
        <CardContent className="p-6">
          <div className={`h-14 w-14 rounded-xl ${color} flex items-center justify-center mb-4`}>{icon}</div>
          <div className="text-xl font-semibold">{title}</div>
          <p className="mt-2 text-gray-600 text-sm">{description}</p>
          <div className="mt-4 text-brand-700 font-semibold text-sm">Xem chi tiết →</div>
        </CardContent>
      </Card>
    </Link>
  );
}
