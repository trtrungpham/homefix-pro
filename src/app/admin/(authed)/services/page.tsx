import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ServicesManager } from "@/components/forms/services-manager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = createClient();
  const [{ data: services }, { data: categories }] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("service_categories").select("*").order("sort_order"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dịch vụ & giá</h1>
        <p className="text-gray-500 text-sm">Quản lý danh sách dịch vụ và bảng giá</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ServicesManager services={services ?? []} categories={categories ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
