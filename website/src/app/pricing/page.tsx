import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Pricing from "@/components/sections/Pricing";
import RoiCalculator from "@/components/sections/RoiCalculator";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "الأسعار وباقات الاشتراك",
  description:
    "اختر الباقة المناسبة لمتجرك على سلة. سند يقدم باقات مرنة تبدأ من 119 ريال شهرياً مع تجربة مجانية 14 يوم بدون بطاقة ائتمانية.",
};

export default function PricingPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Pricing />
        <RoiCalculator />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
