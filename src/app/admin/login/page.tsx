import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";
import { Wrench } from "lucide-react";

export const metadata = { title: "Đăng nhập quản trị - HomeFix Pro" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Wrench className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-2xl font-bold">HomeFix Pro Admin</h1>
          <p className="text-sm text-gray-500">Đăng nhập để quản lý hệ thống</p>
        </div>
        <Card>
          <CardContent className="p-6">
            {searchParams.error === "not-admin" && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                Tài khoản này không có quyền quản trị.
              </div>
            )}
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
