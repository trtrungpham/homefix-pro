"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Worker = {
  id: string;
  full_name: string;
  phone: string;
  specialties: string[];
  areas: string[];
  rating: number;
  is_active: boolean;
};

export function WorkersManager({ workers }: { workers: Worker[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<Worker | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>({});

  function startEdit(w: Worker) {
    setEditing(w);
    setCreating(false);
    setForm({
      ...w,
      specialties: w.specialties.join(", "),
      areas: w.areas.join(", "),
    });
  }

  function startCreate() {
    setEditing(null);
    setCreating(true);
    setForm({
      full_name: "",
      phone: "",
      specialties: "",
      areas: "",
      rating: 5,
      is_active: true,
    });
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm({});
  }

  function save() {
    if (!form.full_name || !form.phone) {
      toast.error("Nhập tên và SĐT");
      return;
    }
    start(async () => {
      const supabase = createClient();
      const payload = {
        full_name: form.full_name,
        phone: form.phone,
        specialties: String(form.specialties ?? "").split(",").map((s: string) => s.trim()).filter(Boolean),
        areas: String(form.areas ?? "").split(",").map((s: string) => s.trim()).filter(Boolean),
        rating: Number(form.rating ?? 5),
        is_active: form.is_active ?? true,
      };
      if (editing) {
        const { error } = await supabase.from("workers").update(payload).eq("id", editing.id);
        if (error) { toast.error(error.message); return; }
      } else {
        const { error } = await supabase.from("workers").insert(payload);
        if (error) { toast.error(error.message); return; }
      }
      toast.success("Đã lưu");
      cancel();
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!confirm("Xoá thợ này?")) return;
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("workers").delete().eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Đã xoá");
      router.refresh();
    });
  }

  const isEditing = editing || creating;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={startCreate} disabled={!!isEditing}>
          <Plus className="h-4 w-4" /> Thêm thợ
        </Button>
      </div>

      {isEditing && (
        <div className="border rounded-lg p-5 bg-gray-50 grid md:grid-cols-2 gap-3">
          <div>
            <Label>Họ tên</Label>
            <Input value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <Label>SĐT</Label>
            <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Chuyên môn (cách nhau bằng dấu phẩy)</Label>
            <Input
              value={form.specialties ?? ""}
              onChange={(e) => setForm({ ...form, specialties: e.target.value })}
              placeholder="điện, nước, máy lạnh"
            />
          </div>
          <div>
            <Label>Khu vực (cách nhau bằng dấu phẩy)</Label>
            <Input
              value={form.areas ?? ""}
              onChange={(e) => setForm({ ...form, areas: e.target.value })}
              placeholder="Q.7, Q.4, Nhà Bè"
            />
          </div>
          <div>
            <Label>Đánh giá (1-5)</Label>
            <Input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={form.rating ?? 5}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm mt-7">
            <input
              type="checkbox"
              checked={form.is_active ?? true}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Đang hoạt động
          </label>
          <div className="md:col-span-2 flex gap-2">
            <Button onClick={save} disabled={pending}><Save className="h-4 w-4" /> Lưu</Button>
            <Button variant="outline" onClick={cancel}>Huỷ</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left border-b">
              <th className="p-3">Họ tên</th>
              <th className="p-3">SĐT</th>
              <th className="p-3">Chuyên môn</th>
              <th className="p-3">Khu vực</th>
              <th className="p-3">Đánh giá</th>
              <th className="p-3">TT</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.id} className="border-b">
                <td className="p-3 font-medium">{w.full_name}</td>
                <td className="p-3">{w.phone}</td>
                <td className="p-3">{w.specialties.join(", ")}</td>
                <td className="p-3">{w.areas.join(", ")}</td>
                <td className="p-3">{w.rating}⭐</td>
                <td className="p-3">{w.is_active ? "✓" : "✗"}</td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(w)}>Sửa</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(w.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {workers.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">Chưa có thợ nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
