import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Integrations from "@/components/sections/Integrations";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "المميزات",
  description:
    "اكتشف كيف يساعدك سند في أتمتة خدمة العملاء — ردود تلقائية، تتبع الشحن، قاعدة معرفة، وصندوق وارد موحد.",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-[#0A0A0F] text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block text-[#9B59FF] font-semibold text-sm uppercase tracking-wider mb-4">
              المميزات
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
              كل ما يحتاجه متجرك في مساعد واحد
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              سند يتكفل بخدمة العملاء، تتبع الطلبات، والردود الذكية — أنت تتفرغ لتنمية متجرك.
            </p>
          </div>
        </section>
        <Features />
        <HowItWorks />
        <Integrations />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
