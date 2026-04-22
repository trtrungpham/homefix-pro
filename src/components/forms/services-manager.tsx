"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { Input, Select, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatVnd } from "@/lib/utils";

type Service = {
  id: string;
  category_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  price_unit: string;
  is_active: boolean;
  sort_order: number;
};

type Category = { id: string; slug: string; name: string };

export function ServicesManager({
  services,
  categories,
}: {
  services: Service[];
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partial<Service>>({});

  function startEdit(s: Service) {
    setEditing(s);
    setCreating(false);
    setForm(s);
  }

  function startCreate() {
    setEditing(null);
    setCreating(true);
    setForm({
      category_id: categories[0]?.id ?? null,
      slug: "",
      name: "",
      description: "",
      base_price: 0,
      price_unit: "lần",
      is_active: true,
      sort_order: services.length + 1,
    });
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm({});
  }

  function save() {
    if (!form.name || !form.slug) {
      toast.error("Nhập tên và slug");
      return;
    }
    start(async () => {
      const supabase = createClient();
      if (editing) {
        const { error } = await supabase
          .from("services")
          .update({
            category_id: form.category_id ?? null,
            slug: form.slug,
            name: form.name,
            description: form.description ?? null,
            base_price: Number(form.base_price ?? 0),
            price_unit: form.price_unit ?? "lần",
            is_active: form.is_active ?? true,
            sort_order: Number(form.sort_order ?? 0),
          })
          .eq("id", editing.id);
        if (error) { toast.error(error.message); return; }
      } else {
        const { error } = await supabase.from("services").insert({
          category_id: form.category_id ?? null,
          slug: form.slug,
          name: form.name,
          description: form.description ?? null,
          base_price: Number(form.base_price ?? 0),
          price_unit: form.price_unit ?? "lần",
          is_active: form.is_active ?? true,
          sort_order: Number(form.sort_order ?? 0),
        });
        if (error) { toast.error(error.message); return; }
      }
      toast.success("Đã lưu");
      cancel();
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!confirm("Xoá dịch vụ này?")) return;
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("services").delete().eq("id", id);
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
          <Plus className="h-4 w-4" /> Thêm dịch vụ
        </Button>
      </div>

      {isEditing && (
        <div className="border rounded-lg p-5 bg-gray-50">
          <h3 className="font-semibold mb-3">{editing ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Tên dịch vụ</Label>
              <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <Label>Danh mục</Label>
              <Select
                value={form.category_id ?? ""}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">-- Không có --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div>
              <Label>Giá khởi điểm</Label>
              <Input
                type="number"
                value={form.base_price ?? 0}
                onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Đơn vị giá</Label>
              <Input
                value={form.price_unit ?? "lần"}
                onChange={(e) => setForm({ ...form, price_unit: e.target.value })}
              />
            </div>
            <div>
              <Label>Thứ tự</Label>
              <Input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Mô tả</Label>
              <Textarea
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Hiển thị trên trang web
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} disabled={pending}><Save className="h-4 w-4" /> Lưu</Button>
            <Button variant="outline" onClick={cancel}>Huỷ</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left border-b">
              <th className="p-3">Tên</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Hiển thị</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const cat = categories.find((c) => c.id === s.category_id);
              return (
                <tr key={s.id} className="border-b">
                  <td className="p-3 font-medium">{s.name}<div className="text-xs text-gray-500">/{s.slug}</div></td>
                  <td className="p-3">{cat?.name ?? "—"}</td>
                  <td className="p-3">{formatVnd(s.base_price)}/{s.price_unit}</td>
                  <td className="p-3">{s.is_active ? "✓" : "✗"}</td>
                  <td className="p-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(s)}>Sửa</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
