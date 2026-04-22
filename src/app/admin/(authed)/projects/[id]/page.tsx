import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectStatusForm } from "@/components/forms/project-status-form";
import { formatDateTime, formatVnd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: it } = await supabase
    .from("project_inquiries")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!it) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/projects" className="text-sm text-gray-500 hover:underline">← Tất cả đơn thầu</Link>
        <h1 className="text-2xl font-bold mt-1">{it.company_name}</h1>
        <p className="text-gray-500 text-sm">Tạo lúc {formatDateTime(it.created_at)}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-2 text-sm">
            <h2 className="font-semibold mb-2">Thông tin doanh nghiệp</h2>
            <Row label="Tên công ty" value={it.company_name} />
            <Row label="Mã số thuế" value={it.tax_code || "—"} />
            <Row label="Người liên hệ" value={it.contact_name} />
            <Row label="SĐT" value={it.contact_phone} />
            <Row label="Email" value={it.contact_email || "—"} />
            <Row label="Loại công trình" value={it.project_type} />
            <Row label="Diện tích" value={it.area_sqm ? `${it.area_sqm} m²` : "—"} />
            <Row label="Ngân sách" value={formatVnd(it.budget)} />
            <Row label="Thời gian" value={it.timeline || "—"} />
            <div className="pt-2">
              <div className="text-gray-500 text-xs">Mô tả</div>
              <div className="font-medium whitespace-pre-wrap">{it.description || "—"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Cập nhật</h2>
            <ProjectStatusForm item={it} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-32 text-gray-500">{label}</div>
      <div className="flex-1 font-medium">{value}</div>
    </div>
  );
}
