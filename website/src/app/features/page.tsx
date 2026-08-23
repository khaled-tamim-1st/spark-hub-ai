import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Integrations from "@/components/sections/Integrations";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "المميزات والحلول الذكية",
  description:
    "اكتشف كيف يساعدك سند في أتمتة خدمة العملاء لمتاجر سلة — ردود فورية، تتبع شحنات، قاعدة معرفة بدون هلوسة، وصندوق وارد موحد.",
};

export default function FeaturesPage() {
  return (
    <div className="bg-[#07070C] text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Features />
        <HowItWorks />
        <Integrations />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
