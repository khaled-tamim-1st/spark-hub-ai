import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SimpleHero from "@/components/corporate/SimpleHero";
import SimpleServices from "@/components/corporate/SimpleServices";
import SimpleBlog from "@/components/corporate/SimpleBlog";
import SimpleContactCTA from "@/components/corporate/SimpleContactCTA";

export const metadata = {
  title: "ECOMATE | إيكوميت — حلول الأعمال والمنتجات الرقمية",
  description: "نبني حلولاً رقمية تجعل أعمالك تعمل بكفاءة وذكاء. نساعد الشركات والمتاجر على تبسيط عملياتها وأتمتة المهام وتطوير تجربة العملاء بالحلول الرقمية العملية.",
};

export default function Home() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#3B4FE8]/15 selection:text-[#3B4FE8]">
      <Navbar />
      <main className="flex-1">
        {/* 1. قسم التعريف والترحيب */}
        <section id="about">
          <SimpleHero />
        </section>
        
        {/* 2. قسم الخدمات والحلول + إبراز المساعد الذكي */}
        <section id="services">
          <SimpleServices />
        </section>
        
        {/* 3. قسم المدونة والمعرفة التشغيلية */}
        <section id="blog">
          <SimpleBlog />
        </section>
        
        {/* 4. قسم التواصل وطلب الاستشارة */}
        <SimpleContactCTA />
      </main>
      <Footer />
    </div>
  );
}
