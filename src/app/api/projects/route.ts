import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.company_name || !body.contact_name || !body.contact_phone) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên công ty, người liên hệ và SĐT" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("project_inquiries")
      .insert({
        company_name: String(body.company_name).slice(0, 300),
        tax_code: body.tax_code ? String(body.tax_code).slice(0, 50) : null,
        contact_name: String(body.contact_name).slice(0, 200),
        contact_phone: String(body.contact_phone).slice(0, 20),
        contact_email: body.contact_email ? String(body.contact_email).slice(0, 200) : null,
        project_type: String(body.project_type || "Khác").slice(0, 100),
        area_sqm: body.area_sqm ? Number(body.area_sqm) : null,
        budget: body.budget ? Number(body.budget) : null,
        timeline: body.timeline ? String(body.timeline).slice(0, 200) : null,
        description: body.description ? String(body.description).slice(0, 5000) : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("project insert error:", error);
      return NextResponse.json({ error: "Có lỗi khi gửi yêu cầu" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
