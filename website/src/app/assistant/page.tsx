import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AssistantHero from "@/components/sections/AssistantHero";
import SocialProof from "@/components/sections/SocialProof";
import AssistantProblem from "@/components/sections/AssistantProblem";
import Features from "@/components/sections/Features";
import RoiCalculator from "@/components/sections/RoiCalculator";
import HowItWorks from "@/components/sections/HowItWorks";
import Integrations from "@/components/sections/Integrations";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata = {
  title: "ECOMATE AI Assistant — مساعد متجرك الذكي على سلة وزد",
  description: "المساعد الذكي المتكامل لمتاجر سلة وزد: خدمة عملاء 24/7، استرجاع السلات المتروكة، وتتبع الشحنات تلقائياً.",
};

export default function AssistantPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col selection:bg-[#3B4FE8]/15 selection:text-[#3B4FE8]">
      <Navbar />
      <main className="flex-1">
        {/* 1. Dedicated Store Hero with Smartphone WhatsApp Simulator */}
        <AssistantHero />
        
        {/* 2. Platform Partner & Store Proof */}
        <SocialProof />
        
        {/* 3. Problem: "مو كل عميل يسأل… عميل يشتري" */}
        <AssistantProblem />
        
        {/* 4. Features: "من الرد على العميل إلى إتمام الطلب… ECOMATE معك" */}
        <Features />
        
        {/* 5. ROI Calculator: "كم يكلفك عدم أتمتة متجرك؟" */}
        <RoiCalculator />
        
        {/* 6. 3 Steps Setup: "فعّل ECOMATE في 3 خطوات" */}
        <HowItWorks />
        
        {/* 7. Integrations: Salla, Zid, SMSA, Aramex, Tamara, Tabby */}
        <Integrations />
        
        {/* 8. Pricing: "ابدأ بدون مخاطرة" */}
        <Pricing />
        
        {/* 9. FAQs */}
        <FAQ />
        
        {/* 10. Final CTA: "خل ECOMATE يبدأ يشتغل معك" */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
