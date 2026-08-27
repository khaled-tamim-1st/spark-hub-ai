"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Code2, TrendingUp, ArrowLeft } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "نفهم احتياجك",
    desc: "نبدأ بفهم عميق لنموذج عملك، تفاصيل عملياته اليومية، والتحدي التشغيلي الذي تريد حله.",
    tag: "تحليل ودراسة",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "نحدد الفرصة",
    desc: "نحدد بدقة أين يمكن للتقنية أو الأتمتة أن توفر وقتًا، تقلل تكلفة، أو تحسن تجربة العميل بشكل ملموس.",
    tag: "تحديد القيمة",
  },
  {
    step: "03",
    icon: Code2,
    title: "نبني الحل",
    desc: "نحوّل الاحتياج إلى حل رقمي واضح، سريع التطبيق، وقابل للاستخدام السلس من فريقك وعملائك.",
    tag: "تطبيق وتنفيذ",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "نطور معك",
    desc: "نقيس النتائج بالأرقام، ونطوّر الحل باستمرار ليواكب نمو أعمالك وتوسع احتياجاتك المستقبلية.",
    tag: "نمو مستمر",
  },
];

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <span>منهجية العمل</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            من المشكلة إلى الحل — <span className="ecomate-gradient-text">كيف نشتغل معك؟</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            خطوات واضحة ومدروسة تضمن وصولك للنتيجة المطلوبة بدون إهدار للوقت أو الموارد.
          </motion.p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-md shadow-blue-900/5 hover:shadow-xl relative group"
            >
              <div>
                {/* Step watermark */}
                <div className="text-5xl font-black text-slate-200/80 absolute top-5 left-5 font-mono select-none">
                  {item.step}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#3B4FE8] text-white flex items-center justify-center mb-5 shadow-md shadow-[#3B4FE8]/25">
                  <item.icon size={22} />
                </div>

                <span className="text-[11px] font-bold text-[#3B4FE8] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full inline-block mb-3">
                  {item.tag}
                </span>

                <h3 className="text-xl font-black text-slate-950 mb-3 group-hover:text-[#3B4FE8] transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-200/80 text-[11px] font-bold text-slate-400 font-mono">
                المرحلة {item.step}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
