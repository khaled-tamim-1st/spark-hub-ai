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
  TrendingUp,
  ShieldCheck,
  Target,
  BarChart3,
  MessageCircle,
} from "lucide-react";

interface HeroSectionProps {
  onOpenConsultation: () => void;
}

const integrations = [
  { name: "سلة • Salla", category: "منصة تجارة" },
  { name: "زد • Zid", category: "منصة تجارة" },
  { name: "Shopify", category: "منصة تجارة" },
  { name: "سناب شات للأعمال", category: "إعلانات موجهة" },
  { name: "تيك توك Ads", category: "إعلانات موجهة" },
  { name: "إعلانات Google", category: "محركات البحث" },
  { name: "منصة X", category: "إعلانات وتواصل" },
  { name: "الفوترة الإلكترونية ZATCA", category: "امتثال معتمد" },
  { name: "مدى & Apple Pay", category: "بوابات دفع" },
];

export default function HeroSection({ onOpenConsultation }: HeroSectionProps) {
  const whatsappUrl =
    "https://wa.me/966500000000?text=" +
    encodeURIComponent("مرحباً فريق ECOMATE، أود الاستفسار عن شراكة نمو الأعمال وتطوير علامتنا التجارية.");

  return (
    <section id="about" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 hero-ecomate-bg overflow-hidden border-b border-slate-100 font-sans">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#0454FF]/8 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#5B8EFF]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-white border border-[#0454FF]/20 text-[#0454FF] px-4.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-xs"
        >
          <Sparkles size={14} className="text-[#0454FF]" />
          <span>ECOMATE • شراكة نمو الأعمال والعلامات التجارية</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-[56px] font-black text-slate-950 leading-[1.22] mb-5 tracking-tight"
        >
          نُدير نمو منشأتك عبر خدماتنا المتكاملة{" "}
          <span className="text-[#0454FF]">
            المدعومة بنظامنا الحصري ECO CX
          </span>
        </motion.h1>

        {/* Sub-headline Essence */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 mb-6"
        >
          تكامل الهوية والتسويق والأتمتة لتخفيض تكلفة الاستحواذ (CAC) ومضاعفة العائد الإعلاني (ROAS)
        </motion.div>

        {/* Explanatory Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-3xl mx-auto font-medium"
        >
          نساعد الشركات والعلامات التجارية المحلية على بناء حضور بصري متسق، وتفعيل قنوات استهداف عالية الأداء (سناب شات، تيك توك، جوجل)، وتطوير بنية تقنية مؤتمتة تدير علاقات العملاء عبر الفروع ونقاط البيع بتوافق تام مع المنظومة الرقمية والأنظمة السعودية المعتمدة.
        </motion.p>

        {/* Commercial Metric Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl shadow-xs">
            <Target size={16} className="text-emerald-600" />
            <span>خفض تكلفة الاستحواذ (CAC)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0454FF] text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl shadow-xs">
            <TrendingUp size={16} className="text-[#0454FF]" />
            <span>تعظيم العائد الإعلاني (ROAS)</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl shadow-xs">
            <BarChart3 size={16} className="text-purple-600" />
            <span>رفع معدل الاحتفاظ وتكرار الشراء (LTV)</span>
          </div>
        </motion.div>

        {/* Action CTAs with Direct WhatsApp & Consultation Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3.5 justify-center items-center mb-14"
        >
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0454FF] hover:bg-[#0047E0] text-white px-8 py-4 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-[#0454FF]/25 hover:scale-105 transition-all"
          >
            <span>طلب دراسة نمو لمنشأتك</span>
            <ArrowLeft size={18} />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-7 py-4 rounded-xl text-sm sm:text-base font-bold shadow-md shadow-[#25D366]/20 transition-all hover:scale-105"
          >
            <MessageCircle size={18} />
            <span>محادثة فورية عبر الواتساب</span>
          </a>

          <a
            href="#solutions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 rounded-xl text-sm sm:text-base font-bold shadow-xs hover:border-[#0454FF]/40 transition-all"
          >
            <Layers size={18} className="text-[#0454FF]" />
            <span>استكشف المنظومة</span>
          </a>
        </motion.div>

        {/* Saudi Digital Ecosystem & Integrations Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white/90 border border-slate-200 rounded-3xl p-5 sm:p-6 mb-12 shadow-xs"
        >
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>تكامل معتمد مع المنظومة الرقمية والأنظمة السعودية</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="bg-slate-50 border border-slate-200/80 hover:border-[#0454FF]/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
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
            <span className="text-slate-950 font-black text-sm block mb-1">01. الهوية والاتساق</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              بناء هوية مؤسسية موحدة تعزز تميز علامتك التجارية وتزيد من قيمتها السوقية.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0454FF] flex items-center justify-center mb-3">
              <Megaphone size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">02. الاستحواذ والتسويق</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              حملات موجهة لتحقيق أعلى عائد إعلاني (ROAS) واستقطاب عملاء ذوي قيمة عالية.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Code2 size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">03. البنية التقنية</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              تطوير منصات حجز وطلب متوافقة مع منصات سلة وزد وبوابات الدفع والفوترة.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-[#0454FF]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Zap size={20} />
            </div>
            <span className="text-slate-950 font-black text-sm block mb-1">04. أتمتة العلاقات (ECO CX)</span>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              أتمتة التواصل وتتبع رحلة العميل لرفع معدل تكرار الشراء وخفض تكلفة التشغيل.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
