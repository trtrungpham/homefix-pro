import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { OrderEditForm } from "@/components/forms/order-edit-form";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, services(name), workers(full_name)")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const { data: workers } = await supabase
    .from("workers")
    .select("id,full_name")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:underline">← Tất cả đơn</Link>
        <h1 className="text-2xl font-bold mt-1">Đơn #{order.id.slice(0, 8)}</h1>
        <p className="text-gray-500 text-sm">Tạo lúc {formatDateTime(order.created_at)}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-2">
            <h2 className="font-semibold mb-2">Thông tin khách</h2>
            <Row label="Họ tên" value={order.customer_name} />
            <Row label="Số điện thoại" value={order.customer_phone} />
            <Row label="Email" value={order.customer_email || "—"} />
            <Row label="Địa chỉ" value={order.address} />
            <Row label="Tỉnh/Quận" value={[order.province, order.district].filter(Boolean).join(" - ") || "—"} />
            <Row label="Dịch vụ" value={(order as any).services?.name ?? "—"} />
            <Row label="Mô tả" value={order.description || "—"} />
            <Row label="Hẹn lúc" value={formatDateTime(order.scheduled_at)} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Cập nhật đơn</h2>
            <OrderEditForm order={order} workers={workers ?? []} />
          </CardContent>
        </Card>
      </div>

      {order.images && order.images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-3">Ảnh đính kèm</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {order.images.map((url: string, i: number) => (
                <a key={i} href={url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-32 object-cover rounded-md border" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="w-28 text-gray-500">{label}</div>
      <div className="flex-1 font-medium">{value}</div>
    </div>
  );
}
