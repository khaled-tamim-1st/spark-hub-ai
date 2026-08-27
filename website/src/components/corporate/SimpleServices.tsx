"use client";

import { motion } from "framer-motion";
import { Workflow, Users, BarChart3, Wrench, Sparkles, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Workflow,
    title: "أتمتة العمليات والمهام اليومية",
    desc: "تقليل المهام اليدوية المتكررة وربط أنظمتك ببعضها بسلاسة، ليتفرغ فريقك للأعمال الاستراتيجية وصناعة القيمة.",
    color: "from-blue-600 to-[#3B4FE8]",
    tag: "كفاءة وإنتاجية",
  },
  {
    icon: Users,
    title: "إدارة وتجربة العملاء (خدمة العملاء والـ CRM)",
    desc: "تنظيم محادثات واستفسارات العملاء عبر مختلف القنوات، وتحسين سرعة وجودة الرد في كل نقطة تواصل لرفع رضا العميل.",
    color: "from-emerald-500 to-emerald-600",
    tag: "سرعة وولاء",
  },
  {
    icon: BarChart3,
    title: "تحليل البيانات والتقارير الذكية",
    desc: "تحويل سجلات المحادثات والمبيعات إلى مؤشرات واضحة وتقارير دورية تساعدك على اتخاذ قرارات دقيقة مبنية على الأرقام.",
    color: "from-indigo-500 to-indigo-600",
    tag: "قرارات مدروسة",
  },
  {
    icon: Wrench,
    title: "تطوير حلول برمجية مخصصة",
    desc: "عندما لا تلبي الأدوات الجاهزة طبيعة عملك، ندرس احتياجك ونبني نظاماً رقمياً مخصصاً يلائم نموذج عملك بالكامل.",
    color: "from-slate-800 to-slate-900",
    tag: "تطوير خاص",
  },
];

export default function SimpleServices() {
  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles size={14} />
            <span>خدمات وحلول ECOMATE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
            حلول متكاملة لمشاكل الأعمال والتشغيل
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            نساعدك على تطوير العمليات التشغيلية وتوفير الوقت والتكاليف بالاعتماد على الأتمتة والحلول الرقمية العملية.
          </p>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                    <item.icon size={22} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 group-hover:text-[#3B4FE8] transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#3B4FE8]">
                <span>حلول مصممة للتطبيق العملي السريع</span>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Digital Product Highlight Card: ECOMATE AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1A1B3C] via-[#242A5C] to-[#3B4FE8] rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-blue-900/15 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5B6EFF]/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                <Bot size={14} className="text-yellow-300" />
                <span>المنتج الرقمي الأول لمتاجر التجارة الإلكترونية 🚀</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                المساعد الذكي للمتاجر الإلكترونية
              </h3>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
                مساعد رقمي متكامل لمتاجر سلة وزد: ردود فورية على واتساب بلهجة طبيعية، متابعة واسترجاع السلات المتروكة، تتبع الشحنات، وتنظيم خدمة العملاء على مدار 24 ساعة.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-bold text-blue-200 pt-2">
                <span>✓ ربط رسمي مع منصتي سلة وزد</span>
                <span>✓ محاكي واتساب تفاعلي للتجربة</span>
                <span>✓ تجربة مجانية لمدة 30 يوماً</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <Link
                href="/assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-[#1A1B3C] hover:bg-blue-50 px-8 py-4 rounded-xl font-black text-sm sm:text-base transition-all hover:scale-105 shadow-xl"
              >
                <span>استكشف صفحة المساعد</span>
                <ArrowLeft size={16} />
              </Link>
              <span className="text-[11px] text-blue-200 mt-2 font-medium">
                معاينة حية وتفاصيل الباقات والأسعار
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
