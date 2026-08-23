"use client";

import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getAppUrl } from "@/lib/config";

const plans = [
  {
    name: "الباقة الأساسية",
    badge: "للمتاجر الناشئة",
    emoji: "🌱",
    monthlyPrice: 149,
    yearlyPrice: 119,
    desc: "مثالية للمتاجر التي تريد أتمتة الرد على الواتساب وتتبع طلبات سلة الأساسية.",
    features: [
      "قناة تواصل واحدة (واتساب ويب)",
      "حتى 750 محادثة شهرياً",
      "ربط متجر سلة واحد (تتبع الطلبات)",
      "قاعدة معرفة حتى 10 مستندات",
      "تقارير وإحصائيات شهرية",
      "دعم فني سريع عبر الواتساب",
    ],
    cta: "ابدأ تجربتك المجانية (14 يوم)",
    highlighted: false,
  },
  {
    name: "الباقة الاحترافية",
    badge: "الأكثر طلباً لمتاجر سلة ⭐",
    emoji: "⚡",
    monthlyPrice: 349,
    yearlyPrice: 279,
    desc: "الحل الشامل والمفضل لأصحاب المتاجر المتنامية لتغطية كل قنوات التواصل وزيادة المبيعات.",
    features: [
      "3 قنوات تواصل (واتساب + سلة + انستغرام)",
      "حتى 3,500 محادثة شهرياً",
      "ربط متقدم مع سلة وشركات الشحن (SMSA, Aramex)",
      "قاعدة معرفة غير محدودة (بدون هلوسة)",
      "استرداد السلات المتروكة تلقائياً",
      "لوحة تحليلات وتقارير أداء لحظية",
      "أولوية دعم فني على مدار الساعة",
    ],
    cta: "ابدأ تجربتك المجانية (14 يوم)",
    highlighted: true,
  },
  {
    name: "الباقة المؤسسية",
    badge: "للعلامات التجارية الكبرى",
    emoji: "🏢",
    monthlyPrice: null,
    yearlyPrice: null,
    desc: "بنية تحتية مخصصة ومحادثات غير محدودة مع تدريب مخصص لذكاء اصطناعي يعكس هوية براندك.",
    features: [
      "قنوات تواصل غير محدودة",
      "محادثات شهرية غير محدودة",
      "تدريب مخصص للذكاء الاصطناعي على نبرة البراند",
      "مدير حساب مخصص ومتابعة دورية",
      "ربط API مخصص ودعم فني 24/7",
      "اتفاقية مستوى الخدمة (SLA 99.9%)",
    ],
    cta: "تحدث مع المبيعات",
    highlighted: false,
    isEnterprise: true,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-28 bg-[#07070C] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#6B00FF]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#6B00FF]/15 border border-[#6B00FF]/30 text-[#C499FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            <span>باقات شفافة وبدون أي رسوم خفية</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
            استثمر في ذكاء متجرك ووفر تكاليف التوظيف
          </h2>

          <p className="text-gray-400 text-base sm:text-lg mb-8">
            ابدأ بتجربة مجانية كاملة لمدة 14 يوماً على أي باقة — بدون إدخال أي بطاقة بنكية.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center bg-[#141422] border border-[#6B00FF]/25 rounded-full p-1.5 gap-1 shadow-lg">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                !yearly
                  ? "bg-[#6B00FF] text-white shadow-md shadow-[#6B00FF]/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              دفع شهري
            </button>

            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                yearly
                  ? "bg-[#6B00FF] text-white shadow-md shadow-[#6B00FF]/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>دفع سنوي</span>
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                وفّر شهرين (20%-)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-[#1E1438] via-[#141426] to-[#0E0E1A] border-2 border-[#9B59FF] shadow-2xl shadow-[#6B00FF]/30 lg:-translate-y-3"
                  : "glass-card border border-white/10 hover:border-white/20"
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6B00FF] to-[#9B59FF] text-white text-xs font-black px-4 py-1 rounded-full shadow-lg shadow-[#6B00FF]/40 border border-white/20 flex items-center gap-1.5">
                  <Zap size={13} />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{plan.emoji}</span>
                  {!plan.highlighted && (
                    <span className="text-[11px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                <p className="text-gray-400 text-xs leading-relaxed mb-6 min-h-[36px]">
                  {plan.desc}
                </p>

                {/* Price Display */}
                <div className="mb-8 pb-6 border-b border-white/10">
                  {plan.isEnterprise ? (
                    <div>
                      <span className="text-3xl font-black text-white block">
                        تواصل معنا
                      </span>
                      <span className="text-xs text-gray-400 mt-1 block">
                        عرض سعر مخصص حسب احتياج متجرك
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl font-black text-white">
                          {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-sm font-semibold text-gray-400">
                          ر.س / شهرياً
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 mt-1.5 block font-medium">
                        {yearly ? "تُدفع سنوياً مع توفير 20%" : "تُدفع شهرياً، ألغِ في أي وقت"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <span className="text-xs font-bold text-gray-300 block mb-2">
                    المميزات المتضمنة:
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed font-medium">
                      <Check
                        size={15}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-[#C499FF]" : "text-emerald-400"
                        }`}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={
                  plan.isEnterprise
                    ? "mailto:hello@sanadai.com"
                    : getAppUrl("/register")
                }
                className={`w-full py-4 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#6B00FF] to-[#9B59FF] hover:from-[#5800D9] hover:to-[#8B33FF] text-white shadow-xl shadow-[#6B00FF]/40 hover:scale-[1.02]"
                    : "bg-[#141422] hover:bg-[#1A1A2E] text-white border border-white/10 hover:border-[#6B00FF]/40"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowLeft size={15} />
              </a>

            </motion.div>
          ))}
        </div>

        {/* Money back guarantee footer */}
        <div className="mt-14 text-center flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield size={16} className="text-emerald-400" />
          <span>ضمان استرجاع كامل المبلغ خلال 14 يوماً إذا لم تكن راضياً 100% عن سند.</span>
        </div>

      </div>
    </section>
  );
}
