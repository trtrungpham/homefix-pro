"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input, Textarea, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const projectTypes = [
  "Nhà phố",
  "Biệt thự",
  "Văn phòng",
  "Nhà xưởng",
  "Cải tạo - sửa chữa lớn",
  "Khác",
];

export function ProjectInquiryForm() {
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    company_name: "",
    tax_code: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    project_type: projectTypes[0],
    area_sqm: "",
    budget: "",
    timeline: "",
    description: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name || !form.contact_name || !form.contact_phone) {
      toast.error("Vui lòng nhập đầy đủ tên công ty, người liên hệ và SĐT");
      return;
    }
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("project_inquiries").insert({
        company_name: form.company_name,
        tax_code: form.tax_code || null,
        contact_name: form.contact_name,
        contact_phone: form.contact_phone,
        contact_email: form.contact_email || null,
        project_type: form.project_type,
        area_sqm: form.area_sqm ? Number(form.area_sqm) : null,
        budget: form.budget ? Number(form.budget) : null,
        timeline: form.timeline || null,
        description: form.description || null,
      });
      if (error) {
        toast.error("Có lỗi xảy ra: " + error.message);
        return;
      }
      toast.success("Đã gửi yêu cầu! Bộ phận kinh doanh sẽ liên hệ trong 24 giờ.");
      setForm({
        company_name: "",
        tax_code: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        project_type: projectTypes[0],
        area_sqm: "",
        budget: "",
        timeline: "",
        description: "",
      });
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Tên công ty *</Label>
          <Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
        </div>
        <div>
          <Label>Mã số thuế</Label>
          <Input value={form.tax_code} onChange={(e) => set("tax_code", e.target.value)} />
        </div>
        <div>
          <Label>Người liên hệ *</Label>
          <Input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
        </div>
        <div>
          <Label>Số điện thoại *</Label>
          <Input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} inputMode="tel" />
        </div>
        <div className="md:col-span-2">
          <Label>Email</Label>
          <Input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} />
        </div>
        <div>
          <Label>Loại công trình *</Label>
          <Select value={form.project_type} onChange={(e) => set("project_type", e.target.value)}>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Diện tích (m²)</Label>
          <Input type="number" value={form.area_sqm} onChange={(e) => set("area_sqm", e.target.value)} />
        </div>
        <div>
          <Label>Ngân sách dự kiến (VNĐ)</Label>
          <Input type="number" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="vd: 2000000000" />
        </div>
        <div>
          <Label>Thời gian thi công</Label>
          <Input value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="vd: 6 tháng" />
        </div>
      </div>
      <div>
        <Label>Mô tả công trình</Label>
        <Textarea
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Quy mô, yêu cầu, ghi chú..."
        />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
      </Button>
    </form>
  );
}
