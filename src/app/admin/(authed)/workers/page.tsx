import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { WorkersManager } from "@/components/forms/workers-manager";

export const dynamic = "force-dynamic";

export default async function AdminWorkersPage() {
  const supabase = createClient();
  const { data: workers } = await supabase.from("workers").select("*").order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Đội thợ</h1>
        <p className="text-gray-500 text-sm">Quản lý đội ngũ thợ</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <WorkersManager workers={workers ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
