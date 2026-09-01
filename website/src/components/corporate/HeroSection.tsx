"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Layers,
  Palette,
  Megaphone,
  Code2,
  Zap,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";

interface HeroSectionProps {
  onOpenConsultation: () => void;
}

export default function HeroSection({ onOpenConsultation }: HeroSectionProps) {
  return (
    <section id="about" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 hero-ecomate-bg overflow-hidden border-b border-slate-100 font-sans">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#0454FF]/8 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#5B8EFF]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-white border border-[#0454FF]/20 text-[#0454FF] px-4.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-xs"
        >
          <Sparkles size={14} className="text-[#0454FF]" />
          <span>ECOMATE • حلول الأعمال والنمو للبراندات المحلية</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-[56px] font-black text-slate-950 leading-[1.25] mb-5 tracking-tight"
        >
          نبني لبراندك منظومة متكاملة من{" "}
          <span className="text-[#0454FF]">
            الهوية، التسويق، والحلول الرقمية
          </span>
        </motion.h1>

        {/* Sub-headline Essence */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 mb-6"
        >
          شريك استراتيجي لتأسيس الحضور وتطوير تجربة العملاء عبر كافة نقاط التواصل
        </motion.div>

        {/* Explanatory Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-3xl mx-auto font-medium"
        >
          في <strong className="text-slate-950 font-bold">ECOMATE</strong> نساعد أصحاب البراندات والأعمال المحلية على بناء هوية بصرية متميزة وموحدة، وإدارة قنوات تسويق تستهدف الجمهور الفعلي، وتطوير أدوات رقمية وأتمتة عملية تسهّل خدمة العملاء وتدعم استدامة النمو.
        </motion.p>

        {/* Value Proposition Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-flex items-center gap-2 bg-blue-50/80 border border-[#0454FF]/15 text-[#0454FF] text-xs sm:text-sm font-bold px-5 py-2 rounded-2xl mb-8 shadow-xs"
        >
          <CheckCircle2 size={16} className="text-[#0454FF]" />
          <span>من الهوية البصرية إلى التسويق والحلول التقنية والأتمتة</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-14"
        >
          <a
            href="#solutions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0454FF] hover:bg-[#0047E0] text-white px-8 py-4 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-[#0454FF]/25 hover:scale-105 transition-all"
          >
            <span>استكشف منظومة الخدمات</span>
            <ArrowLeft size={18} />
          </a>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-8 py-4 rounded-xl text-sm sm:text-base font-bold shadow-xs hover:border-[#0454FF]/40 transition-all"
          >
            <span>طلب جلسة استشارية أولية</span>
          </button>
        </motion.div>

        {/* 4 Pillars Summary Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 border-t border-slate-200/80 text-right"
        >
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Palette size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">01. البراندنج</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              تأسيس هوية بصرية متسقة تعزز حضور البراند وموثوقيته عبر كافة الفروع.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0454FF] flex items-center justify-center mb-3">
              <Megaphone size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">02. التسويق</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              خطط تسويقية مبنية على استهداف الجمهور المحلي وتحفيز تكرار الزيارات.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Code2 size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">03. الحلول التقنية</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              أدوات تفاعلية ومنصات حجز وطلب مباشرة تسهّل تجربة العميل اليومية.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">04. الأتمتة</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              تنظيم قنوات التواصل والردود الآلية لتسريع الخدمة وتوفير وقت الفريق.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
