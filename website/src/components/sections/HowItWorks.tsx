"use client";

import { motion } from "framer-motion";
import { Link2, Bot, BarChart3, CheckCircle2, ArrowLeft, Store, Sparkles, TrendingUp } from "lucide-react";
import { getAppUrl } from "@/lib/config";

const steps = [
  {
    step: "01",
    icon: Link2,
    badgeIcon: Store,
    title: "اربط متجرك",
    desc: "اربط ECOMATE بمتجرك وخل النظام يتعرف على منتجاتك وبيانات متجرك بشكل تلقائي وسلس.",
    visual: {
      type: "connection",
      tag: "ربط متجر سلة وزد",
      items: ["مزامنة المنتجات الحية ✓", "ربط بوالص الشحن ✓", "تكامل واتساب ويب ✓"],
    },
  },
  {
    step: "02",
    icon: Bot,
    badgeIcon: Sparkles,
    title: "خل ECOMATE يتولى الرد والمتابعة",
    desc: "المساعد الذكي يرد على العملاء، ويتعامل مع الاستفسارات، ويتابع الفرص اللي تحتاج متابعة 24/7.",
    visual: {
      type: "automation",
      tag: "أتمتة فورية 24/7",
      items: ["رد فوري بلهجة طبيعية", "متابعة السلات المتروكة", "تحويل الحالات المعقدة للبشر"],
    },
  },
  {
    step: "03",
    icon: BarChart3,
    badgeIcon: TrendingUp,
    title: "تابع النتائج",
    desc: "شوف أداء المساعد، العملاء اللي تم التعامل معهم، والسلات اللي تم استرجاعها بدقة ووضوح.",
    visual: {
      type: "insights",
      tag: "لوحة أداء وتحليلات",
      items: ["تقارير السلات المسترجعة", "بيانات العملاء منظمة", "معدل الرضا والتحويل"],
    },
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-white relative overflow-hidden">
      {/* Background soft blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#3B4FE8]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span>سهولة الإعداد والانطلاق</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
            فعّل ECOMATE في 3 خطوات
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            إعداد بسيط، وبدون الحاجة لخبرة تقنية أو مبرمجين.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#3B4FE8]/40 relative flex flex-col justify-between group transition-all duration-300 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1"
            >
              <div>
                {/* Step number watermark */}
                <div className="text-6xl font-black text-slate-100 absolute top-6 left-6 select-none font-mono">
                  {item.step}
                </div>

                {/* Step icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#3B4FE8] flex items-center justify-center text-white mb-6 shadow-md shadow-[#3B4FE8]/25">
                  <item.icon size={26} />
                </div>

                <div className="text-xs font-extrabold text-[#3B4FE8] mb-2 font-mono">
                  الخطوة {item.step}
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-3 leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  {item.desc}
                </p>
              </div>

              {/* Visual Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between pb-2 border-b border-slate-200">
                  <span>{item.visual.tag}</span>
                  <item.badgeIcon size={13} className="text-[#3B4FE8]" />
                </div>
                <div className="space-y-1.5 pt-1">
                  {item.visual.items.map((sub) => (
                    <div key={sub} className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                      <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Fast Track CTA */}
        <div className="mt-16 text-center">
          <a
            href={getAppUrl("/register")}
            className="inline-flex items-center gap-2.5 bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-8 py-4 rounded-xl text-base font-bold shadow-md shadow-[#3B4FE8]/25 transition-all hover:scale-105"
          >
            <span>ابدأ الآن مجانًا</span>
            <ArrowLeft size={18} />
          </a>
          <p className="text-xs text-slate-500 font-medium mt-3">
            إعداد بسيط، وبدون الحاجة لخبرة تقنية
          </p>
        </div>

      </div>
    </section>
  );
}
