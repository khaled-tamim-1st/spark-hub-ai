import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SimpleHero from "@/components/corporate/SimpleHero";
import SimpleServices from "@/components/corporate/SimpleServices";
import SimpleBlog from "@/components/corporate/SimpleBlog";
import SimpleContactCTA from "@/components/corporate/SimpleContactCTA";

export const metadata = {
  title: "ECOMATE — Business Solutions & Digital Products",
  description: "نبني حلولًا تخلي أعمالك تشتغل بشكل أذكى. نساعد الشركات والمتاجر على تبسيط عملياتها وأتمتة المهام وتطوير تجربة العملاء بالذكاء الاصطناعي.",
};

export default function Home() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#3B4FE8]/15 selection:text-[#3B4FE8]">
      <Navbar />
      <main className="flex-1">
        {/* 1. قسم التعريف والترحيب (About & Intro) */}
        <section id="about">
          <SimpleHero />
        </section>
        
        {/* 2. قسم الخدمات والحلول + إبراز المنتج الرقمي (Services & Digital Products) */}
        <section id="services">
          <SimpleServices />
        </section>
        
        {/* 3. قسم البلوجز والمقالات المعرفية (Blog & Insights) */}
        <section id="blog">
          <SimpleBlog />
        </section>
        
        {/* 4. قسم التواصل والدعوة للبدء (Contact & Consultation) */}
        <SimpleContactCTA />
      </main>
      <Footer />
    </div>
  );
}
