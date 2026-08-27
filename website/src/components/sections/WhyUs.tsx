"use client";

import { motion } from "framer-motion";
import { Target, Wrench, TrendingUp, Cpu, HelpCircle, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Target,
    titleEn: "Business First",
    titleAr: "الأعمال أولاً",
    desc: "نفهم هدفك التجاري ونموذج عملك وتحدياتك بدقة قبل أن نقترح أي حل تقني.",
    color: "from-blue-600 to-[#3B4FE8]",
  },
  {
    icon: Wrench,
    titleEn: "Practical Solutions",
    titleAr: "حلول عملية",
    desc: "حلول مصممة للاستخدام والتشغيل الحقيقي على أرض الواقع، وليست مجرد استعراض تقني أو أفكار معقدة.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    titleEn: "Built for Growth",
    titleAr: "مبنية للنمو",
    desc: "نبني الحلول بحيث تخدمك بكفاءة اليوم وتتحمل أضعاف الضغط والعمليات لتواكب نموك غداً.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Cpu,
    titleEn: "AI & Automation",
    titleAr: "أتمتة وذكاء اصطناعي",
    desc: "نستخدم الذكاء الاصطناعي والأتمتة عندما تضيف قيمة حقيقية وملموسة لعملك وأرباحك.",
    color: "from-amber-500 to-amber-600",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header with Philosophy */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <HelpCircle size={14} />
            <span>فلسفتنا ومنهجنا</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-6"
          >
            التقنية عندنا وسيلة…{" "}
            <span className="ecomate-gradient-text">
              وليست الهدف
            </span>
          </motion.h2>

          {/* Core Philosophy Statement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-blue-900/5 text-center max-w-2xl mx-auto"
          >
            <p className="text-slate-500 text-xs sm:text-sm font-bold mb-2">
              لا نبدأ بالسؤال: "كيف نستخدم الذكاء الاصطناعي؟"
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-950 mb-2">
              نبدأ بالسؤال: <span className="text-[#3B4FE8]">"ما المشكلة التي نريد حلها؟"</span>
            </p>
            <span className="text-xs text-slate-500 font-semibold block">
              ثم نختار ونبني التقنية الأنسب لتحقيق النتيجة المطلوبة.
            </span>
          </motion.div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <motion.div
              key={item.titleEn}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-md shadow-blue-900/5 hover:shadow-xl group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-5 shadow-md shadow-[#3B4FE8]/15`}>
                  <item.icon size={22} />
                </div>

                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-xl font-black text-slate-950 group-hover:text-[#3B4FE8] transition-colors">
                    {item.titleAr}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 font-mono" dir="ltr">
                    {item.titleEn}
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium mt-3">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#3B4FE8]">
                <CheckCircle2 size={13} />
                <span>معيار أساسي في عملنا</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
