"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Layers,
  Palette,
  Megaphone,
  Code2,
  Zap,
  CheckCircle2,
  Store,
  Clock,
  MessageCircle,
  PhoneCall,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  onOpenConsultation: () => void;
}

const sectorPreviews = [
  {
    id: "restaurant",
    title: "مطاعم وكافيهات 🍽️",
    badge: "تجربة حية لمطعم",
    headline: "مطعم ومقهى نكهة سحاب",
    subtext: "فرع الرياض & فرع جدة",
    mockupType: "whatsapp",
    senderName: "نكهة سحاب • خدمة العملاء",
    customerMsg: "مساء الخير، عندكم طاولة لـ 4 أشخاص اليوم الساعة 8؟",
    botReply: "أهلاً بك في نكهة سحاب! ✨\nنعم، تم تأكيد حجز طاولتك اليوم لـ 4 أشخاص الساعة 8:00 مساءً بفرع الرياض.\n\n📍 رابط الموقع:\nhttps://maps.app.goo.gl/...\n\n🍽️ يمكنك تصفح المنيو من هنا:\nhttps://nakhatsahab.menu",
    stat1: "+45% زيادة في الطلبات",
    stat2: "0 ثانية وقت الرد",
    tags: ["منيو رقمي موحد", "رد واتساب لحظي", "حجز بدون وسيط"],
  },
  {
    id: "clinic",
    title: "عيادات ومراكز طبية 🩺",
    badge: "تجربة حية لعيادة",
    headline: "مجمع د. سارة الطبي",
    subtext: "عيادات الأسنان والجلدية",
    mockupType: "booking",
    senderName: "تأكيد موعد آلي",
    customerMsg: "عايز أحجز كشف أسنان بكرة العصر",
    botReply: "تم تأكيد موعدك بنجاح! 🩺\n\n👤 المريض: فهد القحطاني\n👨‍⚕️ العيادة: د. عبدالرحمن - أسنان\n⏰ الموعد: غداً 4:30 عصراً\n\n📌 سنرسل لك تذكيراً قبل الموعد بساعتين.",
    stat1: "-80% غياب للمواعيد",
    stat2: "تنظيم مواعيد 24/7",
    tags: ["تأكيد حجز فوري", "تذكير تلقائي", "ثقة وبناء سمعة"],
  },
  {
    id: "salon",
    title: "صالونات وسبا ✂️",
    badge: "تجربة حية لصالون",
    headline: "صالون لمسة حرير",
    subtext: "عناية نسائية متكاملة",
    mockupType: "salon",
    senderName: "صالون لمسة حرير",
    customerMsg: "هل متاح موعد استشوار ومكياج الجمعة؟",
    botReply: "أهلاً بكِ في لمسة حرير! 🌸\nمتاح يوم الجمعة الساعة 5:00 م مع الخبيرة نورة.\n\n🎁 كود خصم خاص لزيارتك القادمة: SILK15\nننتظر تشريفك!",
    stat1: "+60% تكرار زيارات",
    stat2: "إشغال أوقات الذروة",
    tags: ["حجز أونلاين", "تسويق محلي", "برنامج ولاء"],
  },
];

export default function HeroSection({ onOpenConsultation }: HeroSectionProps) {
  const [activeSector, setActiveSector] = useState(sectorPreviews[0]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 hero-ecomate-bg overflow-hidden border-b border-slate-100">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#0454FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#5B8EFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          
          {/* Left Column: Copy and CTAs */}
          <div className="lg:col-span-7 text-right">
            
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white border border-[#0454FF]/20 text-[#0454FF] px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-xs"
            >
              <Sparkles size={14} className="text-[#0454FF]" />
              <span>ECOMATE • شريكك في بناء براندك</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-950 leading-[1.2] mb-6 tracking-tight"
            >
              نبني لبراندك هوية وأدوات تخليه{" "}
              <span className="text-[#0454FF]">
                يوصل لعملاء أكتر
              </span>
              <span className="block text-slate-900 text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2 text-slate-700">
                ونشتغل بيها كل يوم
              </span>
            </motion.h1>

            {/* Explanatory Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 font-medium max-w-2xl"
            >
              سواء عندك مطعم، عيادة، أو صالون، إحنا نساعدك تبني هوية بصرية قوية، توصلها للعملاء الصح، ونبني لك الأدوات اللي تخلي تجربتهم معاك أسهل وأسرع — من غير ما تحتاج فريق تقني كبير.
            </motion.p>

            {/* Value Proposition Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="inline-flex items-center gap-2 bg-blue-50/80 border border-[#0454FF]/15 text-[#0454FF] text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl mb-8"
            >
              <CheckCircle2 size={16} className="text-[#0454FF]" />
              <span>من الهوية للتسويق للأتمتة، كل حاجة تحت سقف واحد</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center mb-8"
            >
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-2.5 bg-[#0454FF] hover:bg-[#0047E0] text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#0454FF]/25 hover:scale-105 transition-all"
              >
                <span>احجز استشارة مجانية</span>
                <ArrowLeft size={18} />
              </button>

              <a
                href="#growth-journey"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-7 py-4 rounded-xl text-base font-bold shadow-xs hover:border-[#0454FF]/40 transition-all"
              >
                <Layers size={18} className="text-[#0454FF]" />
                <span>شوف حلولنا</span>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-bold"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0454FF]" />
                استشارة مخصصة لبراندك
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0454FF]" />
                حلول مصممة للسوق السعودي
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0454FF]" />
                بدون تعقيدات برمجية
              </span>
            </motion.div>

          </div>

          {/* Right Column: Interactive Sector Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl relative">
              
              {/* Sector Switcher Tabs */}
              <div className="flex items-center justify-between gap-1 p-1 bg-slate-100/80 rounded-2xl mb-5">
                {sectorPreviews.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSector(s)}
                    className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all text-center truncate ${
                      activeSector.id === s.id
                        ? "bg-white text-[#0454FF] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              {/* Mockup Header Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                    {activeSector.id === "restaurant" ? "🍽️" : activeSector.id === "clinic" ? "🩺" : "✂️"}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {activeSector.headline}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {activeSector.subtext}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  نشط ومربوط ✓
                </span>
              </div>

              {/* Interactive Chat/Workflow Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 mb-4 text-right">
                {/* Customer Incoming Message */}
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-[#DCF8C6] border border-emerald-200 text-slate-800 rounded-2xl rounded-tr-none px-3.5 py-2 text-xs font-medium max-w-[85%] shadow-xs">
                    <p>{activeSector.customerMsg}</p>
                    <span className="text-[9px] text-slate-400 block text-left mt-0.5 font-mono">08:00 PM ✓✓</span>
                  </div>
                </div>

                {/* Automated Smart Response */}
                <div className="flex items-start gap-2 justify-start">
                  <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs font-medium max-w-[90%] shadow-xs whitespace-pre-line leading-relaxed">
                    <div className="flex items-center gap-1 text-[10px] text-[#0454FF] font-bold mb-1 pb-1 border-b border-slate-100">
                      <Sparkles size={11} />
                      <span>{activeSector.senderName}</span>
                    </div>
                    <p>{activeSector.botReply}</p>
                    <span className="text-[9px] text-slate-400 block text-left mt-1 font-mono">08:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Tags and Live Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">مؤشر التأثير</span>
                  <span className="text-xs font-black text-[#0454FF]">{activeSector.stat1}</span>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">سرعة الاستجابة</span>
                  <span className="text-xs font-black text-emerald-700">{activeSector.stat2}</span>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {activeSector.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>

            </div>
          </motion.div>

        </div>

        {/* 4 Pillars Mini Teaser Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-8 border-t border-slate-200/80 text-right"
        >
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Palette size={18} />
            </div>
            <div>
              <span className="text-slate-900 font-black text-xs block">1. البراندنج</span>
              <span className="text-slate-500 text-[11px] font-medium">هوية بصرية موحدة</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0454FF] flex items-center justify-center shrink-0">
              <Megaphone size={18} />
            </div>
            <div>
              <span className="text-slate-900 font-black text-xs block">2. التسويق</span>
              <span className="text-slate-500 text-[11px] font-medium">وصول للعميل الصح</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Code2 size={18} />
            </div>
            <div>
              <span className="text-slate-900 font-black text-xs block">3. الحلول التقنية</span>
              <span className="text-slate-500 text-[11px] font-medium">أدوات حجز وطلب</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <span className="text-slate-900 font-black text-xs block">4. الأتمتة</span>
              <span className="text-slate-500 text-[11px] font-medium">ردود ومتابعات ذكية</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
