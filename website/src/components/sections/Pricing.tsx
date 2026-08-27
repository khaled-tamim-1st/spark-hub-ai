"use client";

import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { getAppUrl } from "@/lib/config";

const plans = [
  {
    name: "الباقة الأساسية",
    badge: "للبدء السريع",
    emoji: "🌱",
    monthlyPrice: 149,
    yearlyPrice: 119,
    desc: "للمتاجر اللي تبغى تبدأ بالأتمتة وتخفف ضغط خدمة العملاء.",
    features: [
      "قناة تواصل واحدة (واتساب ويب)",
      "حتى 750 محادثة شهرياً",
      "ربط متجر سلة وزد (تتبع الطلبات)",
      "رد تلقائي 24/7 بلهجة طبيعية",
      "قاعدة معرفة حتى 10 مستندات",
      "دعم فني سريع",
    ],
    cta: "ابدأ تجربتك المجانية",
    highlighted: false,
  },
  {
    name: "الباقة الاحترافية",
    badge: "الأكثر طلباً ⭐",
    emoji: "⚡",
    monthlyPrice: 349,
    yearlyPrice: 279,
    desc: "للمتاجر اللي تبغى أتمتة أوسع + متابعة العملاء + أدوات النمو.",
    features: [
      "3 قنوات تواصل (واتساب + سلة/زد + انستغرام)",
      "حتى 3,500 محادثة شهرياً",
      "متابعة واسترجاع السلات المتروكة تلقائياً",
      "تنظيم بيانات العملاء وسجل المشتريات (CRM)",
      "ربط متقدم مع شركات الشحن (SMSA, Aramex)",
      "قاعدة معرفة غير محدودة وبدون هلوسة",
      "لوحة تحليلات وتقارير نمو لحظية",
    ],
    cta: "ابدأ تجربتك المجانية",
    highlighted: true,
  },
  {
    name: "الباقة المتقدمة",
    badge: "للعمليات الكبرى",
    emoji: "🏢",
    monthlyPrice: null,
    yearlyPrice: null,
    desc: "للمتاجر اللي تحتاج قدرات أكبر وإدارة أوسع للعمليات.",
    features: [
      "قنوات تواصل غير محدودة",
      "محادثات وحركات غير محدودة",
      "تخصيص كامل لنبرة الذكاء الاصطناعي",
      "إدارة بيانات متقدمة وتكامل API مخصص",
      "مدير حساب ومتابعة دورية للنمو",
      "أولوية قصوى ودعم فني على مدار الساعة",
    ],
    cta: "تواصل مع المبيعات",
    highlighted: false,
    isEnterprise: true,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="py-28 bg-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#3B4FE8]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={14} />
            <span>باقات مرنة ومصممة لنموك</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
            ابدأ بدون مخاطرة
          </h2>

          <p className="text-slate-700 text-base sm:text-xl font-bold mb-6">
            جرّب ECOMATE لمدة 30 يوم مجانًا، وشوف بنفسك الفرق في خدمة العملاء والمبيعات.
          </p>

          {/* 3 Value Pillars Bullet Points */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 mb-10">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <CheckCircle2 size={16} className="text-[#3B4FE8]" />
              <span>لا تحتاج توظف فريق أكبر عشان ترد على كل عميل.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <CheckCircle2 size={16} className="text-[#3B4FE8]" />
              <span>ولا تحتاج تتابع السلات يدويًا.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <CheckCircle2 size={16} className="text-[#3B4FE8]" />
              <span>ولا تحتاج تجمع بيانات عملائك بنفسك.</span>
            </div>
          </div>

          {/* Billing Switcher */}
          <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-full p-1.5 gap-1 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                !yearly
                  ? "bg-[#3B4FE8] text-white shadow-md shadow-[#3B4FE8]/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              دفع شهري
            </button>

            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                yearly
                  ? "bg-[#3B4FE8] text-white shadow-md shadow-[#3B4FE8]/20"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>دفع سنوي</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
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
                  ? "bg-gradient-to-b from-blue-50/40 via-white to-slate-50 border-2 border-[#3B4FE8] shadow-xl shadow-blue-900/10 lg:-translate-y-3"
                  : "bg-white border border-slate-200 hover:border-blue-200 shadow-lg shadow-blue-900/5"
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B4FE8] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md shadow-[#3B4FE8]/25 border border-white/40 flex items-center gap-1.5">
                  <Zap size={13} />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{plan.emoji}</span>
                  {!plan.highlighted && (
                    <span className="text-[11px] font-bold text-[#3B4FE8] bg-blue-50 border border-[#3B4FE8]/20 px-2.5 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  {plan.name}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 min-h-[40px] font-medium">
                  {plan.desc}
                </p>

                {/* Price Display */}
                <div className="mb-8 pb-6 border-b border-slate-100">
                  {plan.isEnterprise ? (
                    <div>
                      <span className="text-3xl font-black text-slate-950 block">
                        تواصل معنا
                      </span>
                      <span className="text-xs text-slate-500 mt-1 block font-medium">
                        عرض مخصص حسب حجم عمليات متجرك
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl font-black text-slate-950 font-sans">
                          {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-sm font-bold text-slate-500">
                          ر.س / شهرياً
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1.5 block font-semibold">
                        {yearly ? "تُدفع سنوياً مع توفير 20%" : "تُدفع شهرياً، ألغِ في أي وقت"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <span className="text-xs font-black text-slate-950 block mb-2">
                    المميزات المتضمنة:
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-bold">
                      <Check
                        size={15}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-[#3B4FE8]" : "text-emerald-600"
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
                    ? "mailto:hello@ecomate.ai"
                    : getAppUrl("/register")
                }
                className={`w-full py-4 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? "bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white shadow-lg shadow-[#3B4FE8]/25 hover:scale-[1.02]"
                    : "bg-slate-100 hover:bg-blue-50 text-[#3B4FE8] border border-slate-200 hover:border-blue-200"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowLeft size={15} />
              </a>

            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-14 text-center flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 font-bold">
          <Shield size={16} className="text-emerald-600" />
          <span>*لا التزام خلال فترة التجربة — إلغاء في أي وقت بنقرة واحدة.*</span>
        </div>

      </div>
    </section>
  );
}
