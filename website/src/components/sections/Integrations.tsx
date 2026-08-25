"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layers } from "lucide-react";

const integrationCategories = [
  {
    category: "منصات المتاجر الإلكترونية",
    description: "مزامنة لحظية للطلبات والعملاء والمنتجات",
    items: [
      { name: "سلة Salla", icon: "🛒", status: "تكامل رسمي مباشر" },
      { name: "زد Zid", icon: "🛍️", status: "متاح الآن" },
      { name: "شوبيفاي Shopify", icon: "🌐", status: "قريباً" },
    ],
  },
  {
    category: "شركات الشحن والخدمات اللوجستية",
    description: "تتبع شحنات لحظي وربط أرقام البوالص",
    items: [
      { name: "SMSA Express", icon: "🚚", status: "تتبع مباشر" },
      { name: "Aramex أرامكس", icon: "📦", status: "تتبع مباشر" },
      { name: "OTO منصة أوتو", icon: "⚡", status: "شحن سريع" },
      { name: "J&T Express", icon: "📫", status: "تتبع مباشر" },
    ],
  },
  {
    category: "قنوات التواصل والمحادثة",
    description: "إدارة كل الرسائل في شاشة واحدة موحدة",
    items: [
      { name: "واتساب ويب & Business", icon: "💬", status: "رد فوري تلقائي" },
      { name: "انستغرام Direct", icon: "📸", status: "رسائل مباشرة" },
      { name: "فيسبوك ماسنجر", icon: "📘", status: "محادثات ذكية" },
      { name: "ودجت الموقع الحي", icon: "💻", status: "شات مباشر" },
    ],
  },
  {
    category: "بوابات الدفع والأقساط",
    description: "الرد على استفسارات الدفع والتقسيط الفوري",
    items: [
      { name: "تمارا Tamara", icon: "✨", status: "تقسيط 4 دفعات" },
      { name: "تابي Tabby", icon: "💳", status: "بدون فوائد" },
      { name: "مدى & Apple Pay", icon: "📱", status: "دفع سريع" },
    ],
  },
];

export default function Integrations() {
  return (
    <section id="integrations" className="py-28 bg-[#FAFAFE] border-y border-[#EDE9FE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-[#EDE9FE] border border-[#DDD6FE] text-[#6B00FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Layers size={14} />
            <span>منظومة متكاملة 100%</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-5">
            يتكامل بسلاسة مع كل أدوات متجرك
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            لا داعي لتغيير نظامك الحالي. سند يندمج مع منصاتك وشركات شحنك في دقائق معدودة.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrationCategories.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-[#EDE9FE] hover:border-[#C4B5FD] flex flex-col justify-between transition-all duration-300 shadow-lg shadow-purple-900/5"
            >
              <div className="mb-5">
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  {cat.category}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {cat.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-[#F8F6FF] border border-[#EDE9FE] hover:border-[#C4B5FD] rounded-2xl p-3.5 flex flex-col justify-between transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#6B00FF] transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span>هل تستخدم منصة أو أداة مخصصة؟ نوفر ربط REST API متكامل لجميع المتاجر.</span>
        </div>

      </div>
    </section>
  );
}
