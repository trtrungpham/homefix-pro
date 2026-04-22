import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; variant: any }> = {
  new: { label: "Mới", variant: "info" },
  accepted: { label: "Đã nhận", variant: "warning" },
  in_progress: { label: "Đang làm", variant: "warning" },
  completed: { label: "Hoàn thành", variant: "success" },
  cancelled: { label: "Huỷ", variant: "danger" },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select("id,customer_name,customer_phone,address,status,created_at,scheduled_at,total_price,services(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (searchParams.status) query = query.eq("status", searchParams.status);
  const { data: orders } = await query;

  const tabs = [
    { key: "", label: "Tất cả" },
    { key: "new", label: "Mới" },
    { key: "accepted", label: "Đã nhận" },
    { key: "in_progress", label: "Đang làm" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Huỷ" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Đơn sửa chữa</h1>
        <p className="text-gray-500 text-sm">Quản lý yêu cầu sửa chữa và tiện ích</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              (searchParams.status ?? "") === t.key
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 border-b">
                <th className="p-3">Khách hàng</th>
                <th className="p-3">SĐT</th>
                <th className="p-3">Dịch vụ</th>
                <th className="p-3">Địa chỉ</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((o: any) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{o.customer_name}</td>
                  <td className="p-3">{o.customer_phone}</td>
                  <td className="p-3">{o.services?.name ?? "—"}</td>
                  <td className="p-3 max-w-[220px] truncate">{o.address}</td>
                  <td className="p-3">
                    <Badge variant={statusLabels[o.status]?.variant}>{statusLabels[o.status]?.label}</Badge>
                  </td>
                  <td className="p-3 text-gray-500">{formatDateTime(o.created_at)}</td>
                  <td className="p-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-brand-700 font-semibold">
                      Chi tiết →
                    </Link>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">Không có đơn nào</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
