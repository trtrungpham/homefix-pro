"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input, Textarea, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type ServiceOption = { id: string; name: string; slug: string };

export function BookingForm({
  services,
  initialServiceId = "",
}: {
  services: ServiceOption[];
  initialServiceId?: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    address: "",
    province: "",
    district: "",
    service_id: initialServiceId,
    description: "",
    scheduled_at: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadImages(supabase: ReturnType<typeof createClient>) {
    if (files.length === 0) return [] as string[];
    const urls: string[] = [];
    for (const file of files.slice(0, 5)) {
      const path = `orders/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("uploads").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        console.warn("upload failed", error.message);
        continue;
      }
      const { data } = supabase.storage.from("uploads").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.address) {
      toast.error("Vui lòng nhập họ tên, SĐT và địa chỉ");
      return;
    }
    start(async () => {
      const supabase = createClient();
      const images = await uploadImages(supabase);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email || null,
          address: form.address,
          province: form.province || null,
          district: form.district || null,
          service_id: form.service_id || null,
          description: form.description || null,
          images,
          scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown" }));
        toast.error("Có lỗi: " + error);
        return;
      }
      toast.success("Đặt lịch thành công! Tổng đài sẽ liên hệ trong 5 phút.");
      router.push("/dat-lich/cam-on");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Họ và tên *</Label>
          <Input value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
        </div>
        <div>
          <Label>Số điện thoại *</Label>
          <Input value={form.customer_phone} onChange={(e) => set("customer_phone", e.target.value)} inputMode="tel" />
        </div>
        <div className="md:col-span-2">
          <Label>Email (tùy chọn)</Label>
          <Input type="email" value={form.customer_email} onChange={(e) => set("customer_email", e.target.value)} />
        </div>
        <div>
          <Label>Tỉnh / Thành phố</Label>
          <Input value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="TP.HCM" />
        </div>
        <div>
          <Label>Quận / Huyện</Label>
          <Input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Quận 7" />
        </div>
        <div className="md:col-span-2">
          <Label>Địa chỉ chi tiết *</Label>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Số nhà, đường" />
        </div>
        <div>
          <Label>Dịch vụ cần</Label>
          <Select value={form.service_id} onChange={(e) => set("service_id", e.target.value)}>
            <option value="">-- Chọn dịch vụ --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Thời gian mong muốn</Label>
          <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => set("scheduled_at", e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Mô tả vấn đề</Label>
        <Textarea
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Mô tả tình trạng cần sửa..."
        />
      </div>
      <div>
        <Label>Ảnh đính kèm (tối đa 5)</Label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:text-brand-700 file:font-semibold hover:file:bg-brand-200"
        />
        {files.length > 0 && <p className="text-xs text-gray-500 mt-1">Đã chọn {files.length} ảnh</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Đang gửi..." : "Gửi yêu cầu đặt lịch"}
      </Button>
    </form>
  );
}
