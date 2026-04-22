import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const revalidate = 60;

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!service) notFound();

  const faqs = [
    { q: "Thợ có mặt trong bao lâu?", a: "Trong vòng 30 phút tại nội thành TP.HCM và Hà Nội." },
    { q: "Báo giá có minh bạch không?", a: "Thợ khảo sát và báo giá rõ ràng trước khi thi công, không phát sinh." },
    { q: "Bảo hành như thế nào?", a: "Bảo hành 30 ngày cho mọi dịch vụ. Liên hệ hotline để được hỗ trợ." },
    { q: "Thanh toán bằng hình thức nào?", a: "Tiền mặt, chuyển khoản, ví điện tử (Momo, ZaloPay)." },
  ];

  return (
    <div className="container py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Trang chủ</Link> /{" "}
        <Link href="/sua-chua" className="hover:underline">Sửa chữa</Link> / {service.name}
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold">{service.name}</h1>
          <p className="mt-3 text-lg text-gray-600">{service.description}</p>

          <div className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500">Giá khởi điểm</div>
                <div className="mt-1 text-3xl font-bold text-brand-600">
                  {formatVnd(service.base_price)}
                  <span className="text-base font-normal text-gray-500">/{service.price_unit}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  * Báo giá chính thức sau khi thợ khảo sát thực tế. Cam kết minh bạch, không phát sinh.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Cam kết của HomeFix Pro</h2>
            <ul className="space-y-3">
              {[
                "Thợ chuyên nghiệp, có chứng chỉ tay nghề",
                "Báo giá minh bạch trước khi thi công",
                "Bảo hành dịch vụ tối thiểu 30 ngày",
                "Hỗ trợ 24/7 qua hotline 1900-1234",
              ].map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-lg border p-4">
                  <summary className="font-semibold cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="font-semibold text-lg">Đặt thợ ngay</div>
              <p className="mt-1 text-sm text-gray-600">Tổng đài liên hệ trong 5 phút.</p>
              <Link href={`/dat-lich?service=${service.slug}`}>
                <Button size="lg" className="w-full mt-4">Đặt lịch ngay</Button>
              </Link>
              <a href="tel:19001234">
                <Button size="lg" variant="outline" className="w-full mt-2">
                  Gọi 1900-1234
                </Button>
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
