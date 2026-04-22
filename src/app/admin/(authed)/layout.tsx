import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, ClipboardList, Wrench, Users, Building2, Settings } from "lucide-react";
import { LogoutButton } from "@/components/forms/logout-button";

const items = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Đơn sửa chữa", icon: ClipboardList },
  { href: "/admin/projects", label: "Đơn thầu", icon: Building2 },
  { href: "/admin/services", label: "Dịch vụ & giá", icon: Wrench },
  { href: "/admin/workers", label: "Đội thợ", icon: Users },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default async function AuthedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/admin/login?error=not-admin");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <Link href="/admin/dashboard" className="font-bold text-lg flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </span>
            HomeFix Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="px-3 py-2 text-xs text-gray-500">{profile?.full_name ?? user.email}</div>
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
