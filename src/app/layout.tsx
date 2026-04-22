import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "HomeFix Pro - Gọi thợ tận nơi, sửa chữa & thầu công trình",
  description:
    "Dịch vụ sửa chữa điện, nước, máy lạnh, mạng, thầu công trình xây dựng, giúp việc, chuyển đồ tại TP.HCM và Hà Nội.",
  keywords: ["sửa điện", "sửa nước", "sửa máy lạnh", "thầu công trình", "giúp việc", "chuyển đồ"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
