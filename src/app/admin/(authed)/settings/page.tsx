import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsForm } from "@/components/forms/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("*");
  const map = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-gray-500 text-sm">Thông tin liên hệ và banner trang chủ</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <SettingsForm
            contact={map.contact ?? { hotline: "", email: "", address: "", working_hours: "" }}
            hero={map.hero ?? { title: "", subtitle: "" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
