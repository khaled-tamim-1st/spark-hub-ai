"use client";

import { motion } from "framer-motion";
import { Link2, Brain, Coffee } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "ربط متجرك بسلة",
    desc: "وصّل متجرك على سلة وقنوات التواصل (واتساب، انستغرام، فيسبوك) في دقيقتين فقط بدون أي خبرة تقنية.",
    highlight: "دقيقتان فقط",
  },
  {
    number: "02",
    icon: Brain,
    title: "درّب مساعدك",
    desc: "أضف سياسات متجرك، كتالوج منتجاتك، والأسئلة الشائعة في قاعدة المعرفة — سند سيتعلم ويجيب منها بدقة.",
    highlight: "بدون برمجة",
  },
  {
    number: "03",
    icon: Coffee,
    title: "استرح وراقب النتائج",
    desc: "سند يرد على عملاءك تلقائياً، يتتبع الشحنات، ويحول المحادثات للفريق عند الحاجة — على مدار الساعة.",
    highlight: "24/7 بلا توقف",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0A0A0F] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6B00FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#9B59FF] font-semibold text-sm uppercase tracking-wider mb-3"
          >
            كيف يعمل سند
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            ابدأ في 3 خطوات بسيطة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            لا تعقيد، لا خبرة تقنية مطلوبة — فقط اتبع الخطوات وسند يتكفل بالباقي
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-[#12121A] border border-[#6B00FF]/20 rounded-2xl p-8 hover:border-[#6B00FF]/40 transition-all"
              >
                {/* Step number */}
                <div className="text-7xl font-black text-[#6B00FF]/10 absolute top-4 left-6 select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="relative w-14 h-14 bg-[#6B00FF]/15 rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={26} className="text-[#9B59FF]" />
                </div>

                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{step.desc}</p>

                <span className="inline-block bg-[#6B00FF]/20 text-[#9B59FF] text-xs font-semibold px-3 py-1 rounded-full">
                  {step.highlight}
                </span>

                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-px bg-gradient-to-r from-[#6B00FF]/40 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="https://app.sanadai.com/register"
            className="inline-flex items-center gap-2 bg-[#6B00FF] hover:bg-[#5800D9] text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:shadow-xl hover:shadow-[#6B00FF]/30 hover:scale-105"
          >
            ابدأ الآن مجاناً
          </a>
        </motion.div>
      </div>
    </section>
  );
}
