"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ServiceOption = { id: string; name: string };

export function QuickBookingForm({ services }: { services: ServiceOption[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    address: "",
    service_id: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    start(async () => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          address: form.address || "Chưa cung cấp",
          service_id: form.service_id || null,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown" }));
        toast.error("Có lỗi: " + error);
        return;
      }
      toast.success("Đã gửi yêu cầu! Tổng đài sẽ gọi lại trong 5 phút.");
      setForm({ customer_name: "", customer_phone: "", address: "", service_id: "" });
      router.refresh();
    });
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <Label>Họ và tên *</Label>
        <Input
          value={form.customer_name}
          onChange={(e) => set("customer_name", e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <Label>Số điện thoại *</Label>
        <Input
          value={form.customer_phone}
          onChange={(e) => set("customer_phone", e.target.value)}
          placeholder="09xx xxx xxx"
          inputMode="tel"
        />
      </div>
      <div>
        <Label>Dịch vụ cần</Label>
        <Select value={form.service_id} onChange={(e) => set("service_id", e.target.value)}>
          <option value="">-- Chọn dịch vụ --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Địa chỉ</Label>
        <Input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="Số nhà, đường, quận/huyện"
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Đang gửi..." : "Gọi thợ ngay"}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        Tổng đài sẽ liên hệ lại trong 5 phút để xác nhận.
      </p>
    </form>
  );
}
