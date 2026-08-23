"use client";

import { motion } from "framer-motion";

const integrations = [
  { name: "سلة", emoji: "🛒", desc: "متجرك وطلباتك" },
  { name: "واتساب", emoji: "💬", desc: "الرسائل الفورية" },
  { name: "SMSA", emoji: "🚚", desc: "تتبع الشحنات" },
  { name: "Aramex", emoji: "📦", desc: "خدمة التوصيل" },
  { name: "OTO", emoji: "⚡", desc: "شحن سريع" },
  { name: "فيسبوك", emoji: "📘", desc: "ماسنجر وصفحات" },
  { name: "انستغرام", emoji: "📸", desc: "رسائل مباشرة" },
  { name: "ودجت الموقع", emoji: "🌐", desc: "دردشة الموقع" },
];

export default function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#6B00FF] font-semibold text-sm uppercase tracking-wider mb-3"
          >
            التكاملات
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            يتكامل مع كل ما تستخدمه
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-xl mx-auto"
          >
            سند يعمل مع أدواتك المفضلة بدون أي إعداد معقد
          </motion.p>
        </div>

        {/* Integration cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:border-[#6B00FF]/20 transition-all cursor-default"
            >
              <div className="text-4xl mb-3">{integration.emoji}</div>
              <h3 className="text-gray-900 font-bold text-base mb-1">{integration.name}</h3>
              <p className="text-gray-400 text-xs">{integration.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <span className="inline-block bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-full">
            🔜 المزيد من التكاملات قادمة قريباً
          </span>
        </motion.div>
      </div>
    </section>
  );
}
