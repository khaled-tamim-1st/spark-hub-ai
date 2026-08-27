"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, MessageSquare, Bot, Layers } from "lucide-react";
import Link from "next/link";

export default function SimpleHero() {
  return (
    <section className="relative pt-32 pb-20 hero-ecomate-bg overflow-hidden border-b border-slate-100">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#3B4FE8]/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[#5B6EFF]/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-white border border-[#3B4FE8]/20 text-[#3B4FE8] px-4.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-xs"
        >
          <Sparkles size={13} />
          <span>ECOMATE • حلول الأعمال والمنتجات الرقمية</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.25] mb-6 tracking-tight"
        >
          نبني حلولاً رقمية تجعل أعمالك{" "}
          <span className="ecomate-gradient-text">
            تعمل بكفاءة وذكاء
          </span>
        </motion.h1>

        {/* About / Definition Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-xl leading-relaxed mb-8 max-w-3xl mx-auto font-medium"
        >
          في <strong className="text-slate-950 font-bold">ECOMATE</strong> نساعد الشركات والمتاجر على تبسيط عملياتها التشغيلية، أتمتة المهام اليومية المتكررة، وتحسين تجربة خدمة العملاء من خلال حلول تقنية عملية ومدروسة.
        </motion.p>

        {/* Punchline Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-block bg-blue-50 text-[#3B4FE8] text-sm sm:text-base font-bold px-6 py-2 rounded-2xl mb-10 border border-[#3B4FE8]/15"
        >
          نحوّل التحديات التشغيلية إلى أدوات رقمية تدفع نمو تجارتك.
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-14"
        >
          <a
            href="#services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#3B4FE8]/25 hover:scale-105 transition-all"
          >
            <span>استكشف خدماتنا وحلولنا</span>
            <ArrowLeft size={16} />
          </a>

          <a
            href="mailto:hello@ecomate.ai?subject=طلب استشارة أعمال"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-3.5 rounded-xl text-sm font-bold shadow-xs transition-all"
          >
            <MessageSquare size={16} className="text-[#3B4FE8]" />
            <span>تحدث مع فريق ECOMATE</span>
          </a>
        </motion.div>

        {/* Quick Highlight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200/80 text-right"
        >
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-[#3B4FE8] font-black text-sm block mb-1.5">01. فهم نموذج العمل أولاً</span>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              ندرس التحدي التشغيلي وهدفك التجاري بدقة قبل اقتراح أي أداة تقنية.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-[#3B4FE8] font-black text-sm block mb-1.5">02. حلول عملية ومباشرة</span>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              أدوات وتطبيقات رقمية تعالج المشكلة الفعلية وتوفر الوقت والجهد وتكاليف التشغيل.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <span className="text-[#3B4FE8] font-black text-sm block mb-1.5">03. أتمتة وذكاء اصطناعي</span>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              توظيف ذكي للتقنية لخدمة عملائك على مدار الساعة وبناء عمليات قابلة للتوسع.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
