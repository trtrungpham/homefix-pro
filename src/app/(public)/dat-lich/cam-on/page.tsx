import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="container py-20 text-center max-w-xl">
      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
      <h1 className="mt-4 text-3xl font-bold">Cảm ơn bạn đã đặt lịch!</h1>
      <p className="mt-3 text-gray-600">
        Tổng đài HomeFix Pro sẽ liên hệ trong vòng 5 phút để xác nhận lịch hẹn và báo giá chi tiết.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/"><Button variant="outline">Về trang chủ</Button></Link>
        <a href="tel:19001234"><Button>Gọi 1900-1234</Button></a>
      </div>
    </div>
  );
}
