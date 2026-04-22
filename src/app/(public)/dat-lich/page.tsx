import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { BookingForm } from "@/components/forms/booking-form";

export const revalidate = 60;

export default async function BookingPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id,slug,name,base_price,price_unit")
    .eq("is_active", true)
    .order("sort_order");

  const initialServiceId = searchParams.service
    ? services?.find((s) => s.slug === searchParams.service)?.id ?? ""
    : "";

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold">Đặt thợ tận nơi</h1>
      <p className="mt-2 text-gray-600">Điền thông tin, tổng đài sẽ gọi xác nhận trong 5 phút.</p>

      <Card className="mt-6">
        <CardContent className="p-6">
          <BookingForm services={services ?? []} initialServiceId={initialServiceId} />
        </CardContent>
      </Card>
    </div>
  );
}
