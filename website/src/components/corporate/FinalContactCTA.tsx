"use client";

import { motion } from "framer-motion";
import { Sparkles, PhoneCall, ArrowLeft, MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";

interface FinalContactCTAProps {
  onOpenConsultation: () => void;
}

export default function FinalContactCTA({ onOpenConsultation }: FinalContactCTAProps) {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Box Card with Warm Light Electric Blue Theme */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white border border-[#0454FF]/25 p-8 sm:p-14 text-center shadow-xl overflow-hidden">
          
          {/* Ambient Lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0454FF]/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#0454FF]/20 text-[#0454FF] px-4.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-xs">
              <Sparkles size={14} className="text-[#0454FF]" />
              <span>بدء التعاون ومناقشة الاحتياج</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
              هل ترغب في مناقشة احتياجات براندك؟
            </h2>

            {/* Subtext */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-medium">
              يسعدنا التعرف على تفاصيل نشاطك وأهدافك الحالية، ومناقشة كيف يمكن لمنظومة خدماتنا دعم حضورك وتطوير تجربة عملائك.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0454FF] hover:bg-[#0047E0] text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-[#0454FF]/25 hover:scale-105 transition-all"
              >
                <span>طلب جلسة استشارية أولية</span>
                <ArrowLeft size={18} />
              </button>

              <a
                href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%81%D8%B1%D9%8A%D9%82%20ECOMATE%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AD%D9%84%D9%88%D9%84%20%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84%20%D9%84%D8%A8%D8%B1%D8%A7%D9%86%D8%AF%D9%8A"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 rounded-xl font-bold text-sm shadow-xs hover:border-[#0454FF]/40 transition-all"
              >
                <MessageSquare size={16} className="text-[#0454FF]" />
                <span>محادثة استفسار مباشرة</span>
              </a>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 mt-10 text-xs text-slate-500 font-bold pt-6 border-t border-slate-200/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#0454FF]" />
                دراسة متخصصة لواقع نشاطك
              </span>
              <span className="flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#0454FF]" />
                إجابة واضحة على كافة استفساراتك
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#0454FF]" />
                خطة عمل تنفيذية مقترحة
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
