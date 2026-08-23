"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Package,
  BookOpen,
  MessageSquare,
  BarChart3,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "ردود تلقائية بالذكاء الاصطناعي",
    desc: "يرد على استفسارات العملاء فوراً عبر واتساب وسلة وفيسبوك بأسلوب متجرك تماماً — بدون تدخل يدوي.",
    color: "from-[#6B00FF] to-[#9B59FF]",
    bg: "bg-[#6B00FF]/10",
  },
  {
    icon: Package,
    title: "تتبع الطلبات والشحن",
    desc: "يتصل بسلة وشركات الشحن (SMSA, Aramex, OTO) ويخبر العميل بحالة شحنته فوراً ودقيقاً.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BookOpen,
    title: "قاعدة معرفة متجرك",
    desc: "أضف سياسات متجرك والمنتجات والأسئلة الشائعة، وسيجيب سند منها بدقة 100% — بدون هبد.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MessageSquare,
    title: "صندوق وارد موحد",
    desc: "إدارة كل محادثات واتساب وسلة وانستغرام وماسنجر من لوحة تحكم واحدة سهلة الاستخدام.",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "تقارير وإحصائيات",
    desc: "تعرف على أداء الردود التلقائية وعدد المحادثات المحلولة ومعدل رضا العملاء بتقارير مفصلة.",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Globe,
    title: "متعدد القنوات",
    desc: "واتساب ويب، سلة، فيسبوك ماسنجر، انستغرام، ودجت الموقع — كل شيء في مكان واحد.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#6B00FF] font-semibold text-sm uppercase tracking-wider mb-3"
          >
            المميزات
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            كل ما تحتاجه في مساعد واحد ذكي
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            سند يتولى خدمة عملاءك على مدار الساعة حتى تتفرغ لتنمية متجرك
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#6B00FF]/20 transition-all cursor-default"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon
                    size={24}
                    className={`bg-gradient-to-br ${feature.color} bg-clip-text`}
                    style={{ color: feature.color.includes("6B00FF") ? "#6B00FF" : undefined }}
                  />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
