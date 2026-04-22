import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2, Wallet } from "lucide-react";
import { formatVnd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ count: todayCount }, { count: inProgressCount }, { count: completedCount }, revenueRes] =
    await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["new", "accepted", "in_progress"]),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase
        .from("orders")
        .select("total_price")
        .eq("status", "completed")
        .gte("created_at", monthStart.toISOString()),
    ]);

  const monthlyRevenue = (revenueRes.data ?? []).reduce((sum, o: any) => sum + (o.total_price || 0), 0);

  const stats = [
    { label: "Đơn hôm nay", value: todayCount ?? 0, icon: ClipboardList, color: "bg-blue-100 text-blue-700" },
    { label: "Đang xử lý", value: inProgressCount ?? 0, icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    { label: "Đã hoàn thành", value: completedCount ?? 0, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
    { label: "Doanh thu tháng", value: formatVnd(monthlyRevenue), icon: Wallet, color: "bg-brand-100 text-brand-700" },
  ];

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id,customer_name,customer_phone,status,created_at,services(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-gray-500 text-sm">Thống kê hoạt động của hệ thống</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-lg mb-4">Đơn mới nhất</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Khách hàng</th>
                  <th className="py-2 pr-4">SĐT</th>
                  <th className="py-2 pr-4">Dịch vụ</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2 pr-4">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrders ?? []).map((o: any) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{o.customer_name}</td>
                    <td className="py-2 pr-4">{o.customer_phone}</td>
                    <td className="py-2 pr-4">{o.services?.name ?? "—"}</td>
                    <td className="py-2 pr-4">{o.status}</td>
                    <td className="py-2 pr-4">{new Date(o.created_at).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
                {(!recentOrders || recentOrders.length === 0) && (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400">Chưa có đơn nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
