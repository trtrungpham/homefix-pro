import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/utils";
import { Sparkles, Truck } from "lucide-react";

export const revalidate = 60;

export default async function UtilitiesPage() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id,slug,name,description,base_price,price_unit,service_categories!inner(slug)")
    .eq("is_active", true)
    .eq("service_categories.slug", "tien-ich")
    .order("sort_order");

  const helpers = (services ?? []).filter((s: any) => s.slug.startsWith("giup-viec"));
  const movers = (services ?? []).filter((s: any) => s.slug.startsWith("chuyen-do"));

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-600" /> Dịch vụ tiện ích
        </h1>
        <p className="mt-2 text-gray-600">Giúp việc gia đình & chuyển đồ - chuyển nhà nhanh chóng.</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> Giúp việc nhà
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpers.map((s: any) => (
            <Card key={s.id}>
              <CardContent className="p-6">
                <div className="font-semibold">{s.name}</div>
                <p className="mt-2 text-sm text-gray-600 min-h-[40px]">{s.description}</p>
                <div className="mt-3 text-purple-700 font-bold text-lg">
                  {formatVnd(s.base_price)}/{s.price_unit}
                </div>
                <Link href={`/dat-lich?service=${s.slug}`}>
                  <Button className="w-full mt-4">Đặt ngay</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Truck className="h-6 w-6" /> Chuyển đồ - chuyển nhà
        </h2>
        <p className="text-sm text-gray-600 mb-4">Phụ thu phí di chuyển ngoài nội thành: 5.000đ/km.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movers.map((s: any) => (
            <Card key={s.id}>
              <CardContent className="p-6">
                <div className="font-semibold">{s.name}</div>
                <p className="mt-2 text-sm text-gray-600 min-h-[40px]">{s.description}</p>
                <div className="mt-3 text-purple-700 font-bold text-lg">
                  {formatVnd(s.base_price)}/{s.price_unit}
                </div>
                <Link href={`/dat-lich?service=${s.slug}`}>
                  <Button className="w-full mt-4">Đặt xe</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
