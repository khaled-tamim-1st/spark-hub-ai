"use client";

import { ArrowLeft, Sparkles, ShieldCheck, Zap, Calendar } from "lucide-react";
import { getAppUrl } from "@/lib/config";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Glow Box Container */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#1A1B3C] via-[#242A5C] to-[#3B4FE8] p-8 sm:p-16 text-center shadow-2xl shadow-blue-900/20 overflow-hidden">
          
          {/* Ambient Lighting Background */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#5B6EFF]/30 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-md shadow-sm">
              <Sparkles size={14} className="text-yellow-300" />
              <span>خل ECOMATE يبدأ يشتغل معك</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-[1.25] mb-6">
              حوّل خدمة العملاء والمتابعة من شغل يدوي إلى{" "}
              <span className="text-yellow-300">
                نمو تلقائي.
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
              جرّب ECOMATE لمدة 30 يوم مجانًا، وخل النتائج تتكلم.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={getAppUrl("/register")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#1A1B3C] hover:bg-blue-50 px-9 py-4 rounded-xl font-black text-base transition-all hover:shadow-2xl hover:scale-105 active:scale-95 shadow-xl"
              >
                <span>ابدأ تجربتك المجانية</span>
                <ArrowLeft size={18} />
              </a>

              <a
                href="mailto:demo@ecomate.ai?subject=طلب عرض توضيحي لمتجري"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-8 py-4 rounded-xl font-bold text-base transition-all backdrop-blur-md"
              >
                <Calendar size={18} />
                <span>احجز عرضًا توضيحيًا</span>
              </a>
            </div>

            {/* Feature Checkmarks */}
            <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 mt-10 text-xs text-blue-100 font-bold pt-8 border-t border-white/15">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-yellow-300" />
                بدون التزام
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={15} className="text-yellow-300" />
                إعداد وربط مجاني
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-yellow-300" />
                دعم لمتاجر سلة وزد
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
