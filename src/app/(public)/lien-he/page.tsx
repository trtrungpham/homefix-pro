import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold">Liên hệ với HomeFix Pro</h1>
      <p className="mt-2 text-gray-600">Chúng tôi luôn sẵn sàng phục vụ bạn 24/7.</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {[
          { icon: Phone, title: "Hotline", value: "1900-1234", href: "tel:19001234" },
          { icon: Mail, title: "Email", value: "contact@homefixpro.vn", href: "mailto:contact@homefixpro.vn" },
          { icon: MapPin, title: "Văn phòng", value: "123 Nguyễn Văn Linh, Q.7, TP.HCM" },
          { icon: Clock, title: "Giờ làm việc", value: "7:00 - 21:00 hằng ngày" },
        ].map((c) => (
          <Card key={c.title}>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{c.title}</div>
                {c.href ? (
                  <a href={c.href} className="font-semibold text-brand-700">{c.value}</a>
                ) : (
                  <div className="font-semibold">{c.value}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
