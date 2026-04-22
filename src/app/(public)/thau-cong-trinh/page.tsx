import { Building2, Briefcase, ShieldCheck, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectInquiryForm } from "@/components/forms/project-inquiry-form";

export const metadata = {
  title: "Thầu công trình xây dựng - HomeFix Pro",
  description: "Nhận thầu nhà phố, biệt thự, văn phòng, nhà xưởng. Báo giá chi tiết theo bản vẽ.",
};

export default function ProjectPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 to-white border-b">
        <div className="container py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Building2 className="h-9 w-9 text-blue-600" /> Thầu công trình xây dựng
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl">
            Dành cho doanh nghiệp và chủ đầu tư. Đội ngũ kỹ sư - kiến trúc sư hơn 15 năm kinh nghiệm,
            đảm bảo tiến độ và chất lượng.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Briefcase, title: "Nhà phố - biệt thự", desc: "Trọn gói thiết kế và thi công" },
            { icon: Building2, title: "Văn phòng", desc: "Cải tạo, hoàn thiện nội thất" },
            { icon: Trophy, title: "Nhà xưởng - kho bãi", desc: "Quy mô vừa và lớn" },
            { icon: ShieldCheck, title: "Cải tạo - sửa chữa lớn", desc: "Chống thấm, kết cấu" },
          ].map((it) => (
            <Card key={it.title}>
              <CardContent className="p-5">
                <it.icon className="h-7 w-7 text-blue-600" />
                <div className="mt-3 font-semibold">{it.title}</div>
                <p className="text-sm text-gray-600 mt-1">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Liên hệ thầu công trình</h2>
            <p className="text-gray-600 mb-6">
              Điền form bên dưới, đội ngũ kinh doanh sẽ liên hệ trong vòng 24 giờ để khảo sát và báo giá.
            </p>
            <Card>
              <CardContent className="p-6">
                <ProjectInquiryForm />
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card>
              <CardContent className="p-6">
                <div className="font-semibold text-lg">Thông tin liên hệ</div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>📞 Hotline doanh nghiệp: <strong>1900-1234</strong></li>
                  <li>📧 Email: <strong>contact@homefixpro.vn</strong></li>
                  <li>🏢 123 Nguyễn Văn Linh, Q.7, TP.HCM</li>
                  <li>⏰ T2-T7: 8:00 - 18:00</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
