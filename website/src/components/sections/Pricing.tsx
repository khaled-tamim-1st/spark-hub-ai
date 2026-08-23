"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "الباقة الأساسية",
    emoji: "🌱",
    monthlyPrice: 149,
    yearlyPrice: 119,
    desc: "مثالية لأصحاب المتاجر الصغيرة الذين يريدون البدء بالذكاء الاصطناعي",
    features: [
      "قناة تواصل واحدة (واتساب)",
      "حتى 500 محادثة شهرياً",
      "قاعدة معرفة (5 مستندات)",
      "ربط متجر سلة واحد",
      "تقارير أساسية",
      "دعم عبر البريد الإلكتروني",
    ],
    cta: "ابدأ مجاناً 14 يوم",
    highlighted: false,
  },
  {
    name: "الباقة الاحترافية",
    emoji: "⚡",
    monthlyPrice: 349,
    yearlyPrice: 279,
    desc: "للمتاجر المتنامية التي تريد أتمتة خدمة العملاء بالكامل",
    features: [
      "3 قنوات تواصل",
      "حتى 3,000 محادثة شهرياً",
      "قاعدة معرفة غير محدودة",
      "ربط سلة (طلبات + شحن تلقائي)",
      "واتساب + انستغرام + فيسبوك",
      "تقارير متقدمة وإحصائيات",
      "دعم بأولوية عالية",
    ],
    cta: "ابدأ مجاناً 14 يوم",
    highlighted: true,
    badge: "الأكثر طلباً",
  },
  {
    name: "الباقة المؤسسية",
    emoji: "🏢",
    monthlyPrice: null,
    yearlyPrice: null,
    desc: "للمتاجر الكبيرة والعلامات التجارية التي تحتاج حلاً مخصصاً",
    features: [
      "قنوات غير محدودة",
      "محادثات غير محدودة",
      "تدريب مخصص للذكاء الاصطناعي",
      "مدير حساب مخصص",
      "دعم فني 24/7 بالعربية",
      "SLA مضمون 99.9%",
      "تكامل API مخصص",
    ],
    cta: "تواصل معنا",
    highlighted: false,
    isEnterprise: true,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#6B00FF] font-semibold text-sm uppercase tracking-wider mb-3"
          >
            الأسعار
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            باقات سند — لكل متجر الباقة المناسبة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto mb-8"
          >
            جرّب أي باقة مجاناً لمدة 14 يوم — بدون بطاقة ائتمانية
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 gap-1"
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !yearly
                  ? "bg-[#6B00FF] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                yearly
                  ? "bg-[#6B00FF] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              سنوي
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                وفّر 20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-[#6B00FF] text-white shadow-2xl shadow-[#6B00FF]/30 scale-105"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#6B00FF] font-bold text-xs px-4 py-1.5 rounded-full shadow-md border border-[#6B00FF]/20 flex items-center gap-1">
                  <Zap size={12} />
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="text-3xl mb-2">{plan.emoji}</div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    plan.highlighted ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {plan.desc}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                {plan.isEnterprise ? (
                  <p
                    className={`text-2xl font-bold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    تواصل معنا
                  </p>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-black ${
                        plan.highlighted ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span
                      className={`text-base font-medium ${
                        plan.highlighted ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      ر.س/شهر
                    </span>
                  </div>
                )}
                {yearly && !plan.isEnterprise && (
                  <p
                    className={`text-xs mt-1 ${
                      plan.highlighted ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    يُدفع سنوياً
                  </p>
                )}
              </div>

              {/* CTA */}
              <a
                href={
                  plan.isEnterprise
                    ? "mailto:hello@sanadai.com"
                    : "https://app.sanadai.com/register"
                }
                className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all mb-8 ${
                  plan.highlighted
                    ? "bg-white text-[#6B00FF] hover:bg-gray-100"
                    : "bg-[#6B00FF] text-white hover:bg-[#5800D9] hover:shadow-lg hover:shadow-[#6B00FF]/20"
                }`}
              >
                {plan.cta}
              </a>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={16}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-white" : "text-[#6B00FF]"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted ? "text-white/80" : "text-gray-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
