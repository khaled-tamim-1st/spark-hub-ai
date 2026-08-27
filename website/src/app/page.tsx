import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProblemSolution from "@/components/sections/ProblemSolution";
import CorporateServices from "@/components/sections/CorporateServices";
import DigitalProducts from "@/components/sections/DigitalProducts";
import TargetAudience from "@/components/sections/TargetAudience";
import WhyUs from "@/components/sections/WhyUs";
import HowWeWork from "@/components/sections/HowWeWork";
import Integrations from "@/components/sections/Integrations";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import CorporateCTA from "@/components/sections/CorporateCTA";

export const metadata = {
  title: "ECOMATE — Business Solutions & Digital Products",
  description: "نبني حلولًا تخلي أعمالك تشتغل بشكل أذكى. نساعد الشركات والمتاجر على تبسيط عملياتها وأتمتة المهام وتطوير تجربة العملاء بالذكاء الاصطناعي.",
};

export default function Home() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#3B4FE8]/15 selection:text-[#3B4FE8]">
      <Navbar />
      <main className="flex-1">
        {/* 1. Corporate Hero */}
        <Hero />
        
        {/* 2. Problem & Growth Challenges */}
        <ProblemSolution />
        
        {/* 3. Business Solutions Pillars */}
        <CorporateServices />
        
        {/* 4. Digital Products Portfolio (Featuring ECOMATE AI Assistant) */}
        <DigitalProducts />
        
        {/* 5. Target Audience Segments */}
        <TargetAudience />
        
        {/* 6. Why ECOMATE Philosophy */}
        <WhyUs />
        
        {/* 7. How We Work (4 Steps) */}
        <HowWeWork />
        
        {/* 8. Integrations & Partner Ecosystem */}
        <Integrations />
        
        {/* 9. Knowledge & Blog Insights */}
        <KnowledgeSection />
        
        {/* 10. Corporate Call to Action */}
        <CorporateCTA />
      </main>
      <Footer />
    </div>
  );
}
