"use client";

import { motion } from "framer-motion";
import { HelpCircle, CheckCircle2, ArrowLeft, TrendingUp, AlertCircle, ShieldAlert } from "lucide-react";

const businessQuestions = [
  { question: "كيف نخفف العمل اليدوي؟", category: "الكفاءة التشغيلية" },
  { question: "كيف نرد على العملاء بشكل أسرع؟", category: "تجربة العميل" },
  { question: "كيف نستفيد من بيانات العملاء؟", category: "النمو وإعادة التسويق" },
  { question: "كيف نتابع فرص البيع التي تضيع؟", category: "تعظيم المبيعات" },
  { question: "وكيف نكبر بدون أن تتضاعف التكاليف والتعقيدات؟", category: "قابلية التوسع" },
];

export default function ProblemSolution() {
  return (
    <section className="py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <HelpCircle size={14} className="text-[#3B4FE8]" />
            <span>تحديات التوسع والنمو</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            حلول رقمية مصممة{" "}
            <span className="ecomate-gradient-text">
              لمشاكل الأعمال الحقيقية
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            كل شركة تكبر معها العمليات، والبيانات، والعملاء، والمهام اليومية. ومع الوقت، تبدأ الأسئلة المحورية للتشغيل والنمو:
          </motion.p>
        </div>

        {/* The 5 Critical Growth Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 mb-14">
          {businessQuestions.map((item, idx) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 font-mono">تحدي #{idx + 1}</span>
                <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 font-bold px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-900 font-black text-base sm:text-lg leading-snug group-hover:text-[#3B4FE8] transition-colors">
                {item.question}
              </p>
            </motion.div>
          ))}

          {/* 6th Card: The Resolution Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#1A1B3C] to-[#3B4FE8] rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg shadow-blue-900/15"
          >
            <div>
              <span className="text-xs text-yellow-300 font-bold block mb-1">النتيجة الحتمية</span>
              <p className="text-white text-base font-bold leading-relaxed">
                النمو بدون أتمتة يتحول إلى عبء وتكاليف متراكمة.
              </p>
            </div>
            <span className="text-xs text-blue-200 font-semibold pt-2 border-t border-white/15">
              الحل هو التحول الذكي المنظم.
            </span>
          </motion.div>
        </div>

        {/* The ECOMATE Answer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-blue-900/5 text-center max-w-4xl mx-auto"
        >
          <span className="text-xs font-black text-[#3B4FE8] bg-blue-50 border border-[#3B4FE8]/20 px-4 py-1.5 rounded-full inline-block mb-4">
            هنا يأتي دور ECOMATE
          </span>
          
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-relaxed mb-4">
            نحوّل هذه التحديات إلى حلول رقمية تساعدك تعمل بكفاءة أكبر، وتقدم تجربة أفضل لعملائك، وتبني عمليات قابلة للنمو.
          </h3>

          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-900">
              <CheckCircle2 size={16} className="text-[#3B4FE8]" /> كفاءة تشغيل أعلى
            </span>
            <span className="flex items-center gap-1.5 text-slate-900">
              <CheckCircle2 size={16} className="text-[#3B4FE8]" /> تجربة عملاء استثنائية
            </span>
            <span className="flex items-center gap-1.5 text-slate-900">
              <CheckCircle2 size={16} className="text-[#3B4FE8]" /> نمو مستدام ومدروس
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
