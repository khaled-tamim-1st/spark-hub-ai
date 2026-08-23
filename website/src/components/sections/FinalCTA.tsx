"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { getAppUrl } from "@/lib/config";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#07070C] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Glow Box Container */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#2E1065] via-[#1E1438] to-[#0E0E1A] border-2 border-[#9B59FF]/40 p-8 sm:p-16 text-center shadow-2xl shadow-[#6B00FF]/30 overflow-hidden">
          
          {/* Ambient Lighting Background */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#9B59FF]/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-[#C499FF]" />
              <span>انضم إلى +500 متجر ناجح على سلة</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-[1.2] mb-6">
              جاهز لتحويل خدمة عملاء متجرك إلى{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#C499FF] to-[#9B59FF]">
                ماكينة مبيعات 24/7؟
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              ابدأ تجربتك المجانية الكاملة اليوم. وفر عشرات ساعات العمل الروتينية، واستمتع برضا عملائك الفوري.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={getAppUrl("/register")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#6B00FF] hover:bg-gray-100 px-9 py-4 rounded-xl font-black text-base transition-all hover:shadow-2xl hover:scale-105 active:scale-95 shadow-xl"
              >
                <span>ابدأ الآن مجاناً (14 يوم)</span>
                <ArrowLeft size={18} />
              </a>

              <a
                href={getAppUrl("/login")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-base transition-all backdrop-blur-md"
              >
                <span>تسجيل الدخول للنظام</span>
              </a>
            </div>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 mt-10 text-xs text-gray-300 font-medium pt-8 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                بدون أي بطاقة ائتمانية
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={15} className="text-emerald-400" />
                تفعيل تلقائي خلال 5 دقائق
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                إلغاء الاشتراك في أي وقت
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
