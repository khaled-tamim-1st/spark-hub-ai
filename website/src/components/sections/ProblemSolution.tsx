"use client";

import { motion } from "framer-motion";
import { MessageSquareText, ShoppingCart, Database, Zap, HelpCircle, ArrowLeft } from "lucide-react";
import { getAppUrl } from "@/lib/config";

const pillars = [
  {
    icon: MessageSquareText,
    title: "رد تلقائي",
    desc: "خل عملاءك يحصلون على إجابات سريعة حتى خارج أوقات العمل.",
    badge: "24/7 بدون انقطاع",
    color: "from-[#3B4FE8] to-[#5B6EFF]",
    bgLight: "bg-blue-50/70",
  },
  {
    icon: ShoppingCart,
    title: "استرجاع السلات",
    desc: "تابع العملاء اللي تركوا سلاتهم وحفّزهم يكملون الشراء.",
    badge: "زيادة مبيعات فورية",
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50/70",
  },
  {
    icon: Database,
    title: "بيانات العملاء",
    desc: "اجمع ونظّم بيانات عملائك وسجل مشترياتهم في مكان واحد.",
    badge: "جاهز لإعادة التسويق",
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50/70",
  },
  {
    icon: Zap,
    title: "تشغيل أسهل",
    desc: "خفف الضغط على فريق خدمة العملاء وخلّهم يركزون على الحالات اللي تحتاج تدخل بشري.",
    badge: "توفير وقت وتكاليف",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50/70",
  },
];

export default function ProblemSolution() {
  return (
    <section className="py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header & Pain Points */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <HelpCircle size={14} className="text-[#3B4FE8]" />
            <span>واقع التجارة الإلكترونية اليوم</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-8"
          >
            مو كل عميل يسأل… <span className="ecomate-gradient-text">عميل يشتري</span>
          </motion.h2>

          {/* Pain Point Questions in Styled Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 text-right"
          >
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-sm">
              <span className="text-xs text-rose-500 font-bold block mb-1">الفرصة الضائعة #1</span>
              <p className="text-slate-700 text-sm font-semibold leading-snug">
                كم طلب ممكن يضيع لأن العميل ما لقى رد في الوقت المناسب؟
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-sm">
              <span className="text-xs text-rose-500 font-bold block mb-1">الفرصة الضائعة #2</span>
              <p className="text-slate-700 text-sm font-semibold leading-snug">
                وكم سلة تُترك بدون متابعة تخلي العميل ينسى ويكسل؟
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-sm">
              <span className="text-xs text-rose-500 font-bold block mb-1">الفرصة الضائعة #3</span>
              <p className="text-slate-700 text-sm font-semibold leading-snug">
                وكم عميل تتوزع بياناته بين المحادثات بدل ما تكون في قاعدة واحدة؟
              </p>
            </div>
          </motion.div>

          {/* Core Solution Statement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-[#3B4FE8] text-white px-6 py-2.5 rounded-2xl text-base sm:text-lg font-black shadow-md shadow-[#3B4FE8]/25"
          >
            ECOMATE يجمع لك كل هذا في نظام واحد.
          </motion.div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6.5 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-md shadow-blue-900/5 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md shadow-[#3B4FE8]/15`}>
                    <item.icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-950 mb-2.5 group-hover:text-[#3B4FE8] transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#3B4FE8]">
                <span>تفعيل فوري</span>
                <span>✓</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 text-center">
          <a
            href={getAppUrl("/register")}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-[#3B4FE8] px-7 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-105"
          >
            <span>جرّب ECOMATE مجاناً لمدة 30 يوم</span>
            <ArrowLeft size={16} className="text-[#3B4FE8]" />
          </a>
        </div>

      </div>
    </section>
  );
}
