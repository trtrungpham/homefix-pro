"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input, Select, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function OrderEditForm({
  order,
  workers,
}: {
  order: any;
  workers: { id: string; full_name: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    status: order.status ?? "new",
    assigned_worker_id: order.assigned_worker_id ?? "",
    total_price: order.total_price?.toString() ?? "",
    internal_note: order.internal_note ?? "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({
          status: form.status,
          assigned_worker_id: form.assigned_worker_id || null,
          total_price: form.total_price ? Number(form.total_price) : null,
          internal_note: form.internal_note || null,
        })
        .eq("id", order.id);
      if (error) {
        toast.error("Cập nhật thất bại: " + error.message);
        return;
      }
      toast.success("Đã cập nhật");
      router.refresh();
    });
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <Label>Trạng thái</Label>
        <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
          <option value="new">Mới</option>
          <option value="accepted">Đã nhận</option>
          <option value="in_progress">Đang làm</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Huỷ</option>
        </Select>
      </div>
      <div>
        <Label>Gán thợ</Label>
        <Select value={form.assigned_worker_id} onChange={(e) => set("assigned_worker_id", e.target.value)}>
          <option value="">-- Chưa gán --</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>{w.full_name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Tổng tiền (VNĐ)</Label>
        <Input type="number" value={form.total_price} onChange={(e) => set("total_price", e.target.value)} />
      </div>
      <div>
        <Label>Ghi chú nội bộ</Label>
        <Textarea rows={3} value={form.internal_note} onChange={(e) => set("internal_note", e.target.value)} />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Đang lưu..." : "Lưu thay đổi"}</Button>
    </form>
  );
}
