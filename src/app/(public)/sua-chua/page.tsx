import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { formatVnd } from "@/lib/utils";
import { Wrench } from "lucide-react";

export const revalidate = 60;

export default async function RepairListPage() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id,slug,name,description,base_price,price_unit,service_categories!inner(slug)")
    .eq("is_active", true)
    .eq("service_categories.slug", "sua-chua-gia-dinh")
    .order("sort_order");

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Wrench className="h-8 w-8 text-brand-600" /> Sửa chữa gia đình
        </h1>
        <p className="mt-2 text-gray-600">
          Tất cả dịch vụ sửa chữa - thợ có mặt sau 30 phút, bảo hành 30 ngày.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(services ?? []).map((s: any) => (
          <Link key={s.id} href={`/sua-chua/${s.slug}`}>
            <Card className="h-full hover:shadow-md hover:border-brand-300 transition">
              <CardContent className="p-6">
                <div className="text-lg font-semibold">{s.name}</div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{s.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-brand-700 font-bold">
                    Từ {formatVnd(s.base_price)}/{s.price_unit}
                  </div>
                  <span className="text-sm text-brand-700 font-semibold">Đặt thợ →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
