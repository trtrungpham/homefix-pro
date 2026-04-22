"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({
  contact,
  hero,
}: {
  contact: { hotline?: string; email?: string; address?: string; working_hours?: string };
  hero: { title?: string; subtitle?: string };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [c, setC] = useState(contact);
  const [h, setH] = useState(hero);

  function save() {
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("settings").upsert([
        { key: "contact", value: c, updated_at: new Date().toISOString() },
        { key: "hero", value: h, updated_at: new Date().toISOString() },
      ]);
      if (error) { toast.error(error.message); return; }
      toast.success("Đã lưu cài đặt");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-semibold text-lg mb-3">Thông tin liên hệ</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Hotline</Label>
            <Input value={c.hotline ?? ""} onChange={(e) => setC({ ...c, hotline: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={c.email ?? ""} onChange={(e) => setC({ ...c, email: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Địa chỉ</Label>
            <Input value={c.address ?? ""} onChange={(e) => setC({ ...c, address: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Giờ làm việc</Label>
            <Input value={c.working_hours ?? ""} onChange={(e) => setC({ ...c, working_hours: e.target.value })} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-3">Banner trang chủ</h2>
        <div className="space-y-3">
          <div>
            <Label>Tiêu đề</Label>
            <Input value={h.title ?? ""} onChange={(e) => setH({ ...h, title: e.target.value })} />
          </div>
          <div>
            <Label>Mô tả phụ</Label>
            <Textarea rows={3} value={h.subtitle ?? ""} onChange={(e) => setH({ ...h, subtitle: e.target.value })} />
          </div>
        </div>
      </section>

      <Button onClick={save} disabled={pending}>{pending ? "Đang lưu..." : "Lưu cài đặt"}</Button>
    </div>
  );
}
