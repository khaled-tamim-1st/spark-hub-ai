"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Building2, Puzzle, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

const segments = [
  {
    icon: ShoppingBag,
    title: "المتاجر الإلكترونية",
    subtitle: "من خدمة العملاء والسلات المتروكة إلى بيانات العملاء والمتابعة.",
    desc: "نساعدك تدير متجرك بكفاءة أكبر، تتخلص من الردود اليدوية البطيئة، وتقدم تجربة بيع متكاملة وسلسة لعملائك على مدار الساعة.",
    tag: "سلة • زد • شوبيفاي",
    color: "from-blue-600 to-[#3B4FE8]",
    ctaText: "استكشف حلول المتاجر",
    href: "/assistant",
  },
  {
    icon: Building2,
    title: "الشركات الصغيرة والمتوسطة",
    subtitle: "عندما تزيد العمليات ويصبح العمل اليدوي عائقًا أمام النمو.",
    desc: "نساعدك تحوّل العمليات المتكررة والمهام اليومية إلى أنظمة ذكية وأكثر تنظيماً لتتفرغ للتوسع والمبيعات بدون تضخم تكاليف التشغيل.",
    tag: "أتمتة • إنتاجية • كفاءة",
    color: "from-indigo-600 to-indigo-700",
    ctaText: "تواصل مع فريق الحلول",
    href: "mailto:hello@ecomate.ai?subject=استشارة شركات صغيرة ومتوسطة",
  },
  {
    icon: Puzzle,
    title: "الشركات التي تبحث عن حلول مخصصة",
    subtitle: "إذا كان لديك تحدٍ تشغيلي واضح ولا تجد له حلًا جاهزًا في السوق.",
    desc: "ندرس احتياجك ونفهم تفاصيل عملك بدقة، ونساعدك في تحويله إلى حل رقمي عملي ومتكامل ومخصص بنسبة 100% لطبيعة نشاطك.",
    tag: "تطوير خاص • تكامل API",
    color: "from-slate-800 to-slate-900",
    ctaText: "اطلب استشارة خاصة",
    href: "mailto:hello@ecomate.ai?subject=طلب حل رقمي مخصص",
  },
];

export default function TargetAudience() {
  return (
    <section id="audience" className="py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Users size={14} />
            <span>لمن نقدم حلولنا؟</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            للشركات التي تريد أن{" "}
            <span className="ecomate-gradient-text">
              تنمو بدون تعقيد
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            صممنا منظومة ECOMATE لتلائم مراحل نموك المختلفة وتقدم لك الأثر الملموس بأسرع وقت.
          </motion.p>
        </div>

        {/* 3 Audience Segment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {segments.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-md shadow-blue-900/5 hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                    <item.icon size={26} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2 group-hover:text-[#3B4FE8] transition-colors">
                  {item.title}
                </h3>

                <p className="text-[#3B4FE8] text-xs sm:text-sm font-bold mb-4 leading-snug">
                  {item.subtitle}
                </p>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-6 border-t border-slate-200/80">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#3B4FE8] transition-colors"
                >
                  <span>{item.ctaText}</span>
                  <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
