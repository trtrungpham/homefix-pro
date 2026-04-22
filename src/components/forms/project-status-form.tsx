"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ProjectStatusForm({ item }: { item: any }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(item.status ?? "new");
  const [note, setNote] = useState(item.internal_note ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("project_inquiries")
        .update({ status, internal_note: note || null })
        .eq("id", item.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Đã cập nhật");
      router.refresh();
    });
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <Label>Trạng thái</Label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="new">Mới</option>
          <option value="contacted">Đã liên hệ</option>
          <option value="quoted">Đã báo giá</option>
          <option value="won">Trúng thầu</option>
          <option value="lost">Không trúng</option>
        </Select>
      </div>
      <div>
        <Label>Ghi chú nội bộ</Label>
        <Textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Đang lưu..." : "Lưu thay đổi"}</Button>
    </form>
  );
}
