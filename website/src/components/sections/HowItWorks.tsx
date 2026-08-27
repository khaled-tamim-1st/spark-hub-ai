"use client";

import { motion } from "framer-motion";
import { Link2, Brain, Rocket, CheckCircle2, ArrowLeft, QrCode, FileText, Bot } from "lucide-react";
import { getAppUrl } from "@/lib/config";

const steps = [
  {
    step: "01",
    icon: Link2,
    badgeIcon: QrCode,
    title: "ربط متجرك بسلة وواتساب",
    desc: "بنقرة واحدة من متجر تطبيقات سلة أو مسح رمز QR لواتساب ويب، يتصل Ecomate بمتجرك ويبدأ مزامنة الطلبات والمنتجات فورياً.",
    visual: {
      type: "connection",
      tag: "ربط سحابي مشفر",
      items: ["تطبيق سلة الرسمي ✓", "واتساب ويب فوري ✓", "شركات الشحن (SMSA/Aramex) ✓"],
    },
  },
  {
    step: "02",
    icon: Brain,
    badgeIcon: FileText,
    title: "تدريب قاعدة المعرفة الخاصة بك",
    desc: "أضف سياسات متجرك، شروط الاستبدال، جدول المقاسات، والأسئلة المكررة. Ecomate يستوعبها بدقة متناهية ويجيب منها حصراً.",
    visual: {
      type: "knowledge",
      tag: "فهرسة ذكية",
      items: ["كتالوج المنتجات الحية", "سياسة الاسترجاع والضمان", "تخصيص نبرة وأسلوب البراند"],
    },
  },
  {
    step: "03",
    icon: Rocket,
    badgeIcon: Bot,
    title: "الانطلاق بالأتمتة الكاملة 24/7",
    desc: "Ecomate يتولى الرد على العملاء وتتبع الشحنات وزيادة المبيعات على مدار الساعة، مع إمكانية التدخل البشري في أي وقت بضغطة زر.",
    visual: {
      type: "autopilot",
      tag: "أتمتة ذاتية",
      items: ["رد فوري في 1.2 ثانية", "تتبع تلقائي للشحنات", "تحويل ذكي للموظف عند الحاجة"],
    },
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-white relative overflow-hidden">
      {/* Background soft blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span>سهولة الإعداد والانطلاق</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
            كيف يعمل Ecomate في 3 خطوات بسيطة؟
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            لا تحتاج لأي مبرمج أو خبرة تقنية. Ecomate مجهز للعمل مع متجرك في أقل من 10 دقائق.
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
              className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-300 relative flex flex-col justify-between group transition-all duration-300 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1"
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

                <h3 className="text-xl font-black text-slate-950 mb-3 leading-snug">
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
            <span>ابدأ ربط متجرك الآن مجاناً</span>
            <ArrowLeft size={18} />
          </a>
          <p className="text-xs text-slate-500 font-medium mt-3">
            تجربة كاملة لمدة 14 يوم بدون أي التزام مالي
          </p>
        </div>

      </div>
    </section>
  );
}
