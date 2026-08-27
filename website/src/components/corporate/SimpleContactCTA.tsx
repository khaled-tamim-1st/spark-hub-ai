"use client";

import { MessageSquare, ArrowLeft, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function SimpleContactCTA() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Box Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1A1B3C] via-[#242A5C] to-[#3B4FE8] p-8 sm:p-14 text-center shadow-2xl shadow-blue-900/15 overflow-hidden">
          
          {/* Ambient Lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#5B6EFF]/25 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1 rounded-full text-xs font-bold mb-5 backdrop-blur-md shadow-xs">
              <Sparkles size={13} className="text-yellow-300" />
              <span>جاهز تطور طريقة تشغيل عملك؟</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
              خلنا نفهم التحدي… <span className="text-yellow-300">ونبني له الحل</span>
            </h2>

            {/* Subtext */}
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8 font-medium">
              سواء كنت تدير متجرًا إلكترونيًا أو شركة تنمو بسرعة، نساعدك تعرف أين يمكن للتقنية والأتمتة أن تصنع فرقًا حقيقيًا في عملك وأرباحك.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <a
                href="mailto:hello@ecomate.ai?subject=طلب استشارة أعمال من موقع ECOMATE"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#1A1B3C] hover:bg-blue-50 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105 shadow-lg"
              >
                <MessageSquare size={16} className="text-[#3B4FE8]" />
                <span>تحدث مع فريق ECOMATE</span>
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-7 py-3.5 rounded-xl font-bold text-sm transition-all backdrop-blur-md"
              >
                <span>استكشف حلولنا</span>
                <ArrowLeft size={16} />
              </a>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 mt-8 text-xs text-blue-100 font-bold pt-6 border-t border-white/15">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-yellow-300" />
                استشارة واضحة ومباشرة
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-yellow-300" />
                حلول رقمية قابلة للتطبيق
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
