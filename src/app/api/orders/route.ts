import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customer_name || !body.customer_phone) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên và số điện thoại" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: String(body.customer_name).slice(0, 200),
        customer_phone: String(body.customer_phone).slice(0, 20),
        customer_email: body.customer_email ? String(body.customer_email).slice(0, 200) : null,
        address: String(body.address || "Chưa cung cấp").slice(0, 500),
        province: body.province ? String(body.province).slice(0, 100) : null,
        district: body.district ? String(body.district).slice(0, 100) : null,
        service_id: body.service_id || null,
        description: body.description ? String(body.description).slice(0, 2000) : null,
        images: Array.isArray(body.images) ? body.images.slice(0, 5) : [],
        scheduled_at: body.scheduled_at || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("orders insert error:", error);
      return NextResponse.json({ error: "Có lỗi khi tạo đơn" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
