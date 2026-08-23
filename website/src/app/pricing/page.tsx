import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "الأسعار",
  description:
    "اختر الباقة المناسبة لمتجرك. سند يقدم 3 باقات مرنة تبدأ من 149 ريال شهرياً مع تجربة مجانية 14 يوم.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-[#0A0A0F] text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block text-[#9B59FF] font-semibold text-sm uppercase tracking-wider mb-4">
              الأسعار
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
              باقات شفافة بدون مفاجآت
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              جرّب سند مجاناً 14 يوم في أي باقة — بدون بطاقة ائتمانية، وألغِ في أي وقت.
            </p>
          </div>
        </section>
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
