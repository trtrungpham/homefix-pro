import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, Badge } from "@/components/ui/card";
import { formatDateTime, formatVnd } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; variant: any }> = {
  new: { label: "Mới", variant: "info" },
  contacted: { label: "Đã liên hệ", variant: "warning" },
  quoted: { label: "Đã báo giá", variant: "warning" },
  won: { label: "Trúng thầu", variant: "success" },
  lost: { label: "Không trúng", variant: "danger" },
};

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("project_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Đơn thầu công trình</h1>
        <p className="text-gray-500 text-sm">Quản lý các đơn thầu từ doanh nghiệp</p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left border-b">
                <th className="p-3">Công ty</th>
                <th className="p-3">Người liên hệ</th>
                <th className="p-3">Loại CT</th>
                <th className="p-3">Diện tích</th>
                <th className="p-3">Ngân sách</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((it: any) => (
                <tr key={it.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{it.company_name}</td>
                  <td className="p-3">{it.contact_name}<div className="text-xs text-gray-500">{it.contact_phone}</div></td>
                  <td className="p-3">{it.project_type}</td>
                  <td className="p-3">{it.area_sqm ? `${it.area_sqm} m²` : "—"}</td>
                  <td className="p-3">{formatVnd(it.budget)}</td>
                  <td className="p-3"><Badge variant={statusLabels[it.status]?.variant}>{statusLabels[it.status]?.label}</Badge></td>
                  <td className="p-3 text-gray-500">{formatDateTime(it.created_at)}</td>
                  <td className="p-3">
                    <Link href={`/admin/projects/${it.id}`} className="text-brand-700 font-semibold">
                      Chi tiết →
                    </Link>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Chưa có đơn nào</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
