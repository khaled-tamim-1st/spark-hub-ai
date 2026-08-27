"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layers } from "lucide-react";
import {
  LogoSalla,
  LogoZid,
  LogoShopify,
  LogoSMSA,
  LogoAramex,
  LogoOTO,
  LogoJT,
  LogoWhatsApp,
  LogoInstagram,
  LogoMessenger,
  LogoTamara,
  LogoTabby,
  LogoMada,
  LogoApplePay,
} from "@/components/ui/BrandLogos";

const integrationCategories = [
  {
    category: "منصات المتاجر الإلكترونية",
    description: "مزامنة لحظية للطلبات والعملاء والمنتجات",
    items: [
      { name: "سلة Salla", logo: LogoSalla, status: "تكامل رسمي مباشر" },
      { name: "زد Zid", logo: LogoZid, status: "متاح الآن" },
      { name: "شوبيفاي Shopify", logo: LogoShopify, status: "قريباً" },
    ],
  },
  {
    category: "شركات الشحن والخدمات اللوجستية",
    description: "تتبع شحنات لحظي وربط أرقام البوالص",
    items: [
      { name: "SMSA Express", logo: LogoSMSA, status: "تتبع مباشر" },
      { name: "Aramex أرامكس", logo: LogoAramex, status: "تتبع مباشر" },
      { name: "OTO منصة أوتو", logo: LogoOTO, status: "شحن سريع" },
      { name: "J&T Express", logo: LogoJT, status: "تتبع مباشر" },
    ],
  },
  {
    category: "قنوات التواصل والمحادثة",
    description: "إدارة كل الرسائل في شاشة واحدة موحدة",
    items: [
      { name: "واتساب ويب & Business", logo: LogoWhatsApp, status: "رد فوري تلقائي" },
      { name: "انستغرام Direct", logo: LogoInstagram, status: "رسائل مباشرة" },
      { name: "فيسبوك ماسنجر", logo: LogoMessenger, status: "محادثات ذكية" },
    ],
  },
  {
    category: "بوابات الدفع والأقساط",
    description: "الرد على استفسارات الدفع والتقسيط الفوري",
    items: [
      { name: "تمارا Tamara", logo: LogoTamara, status: "تقسيط 4 دفعات" },
      { name: "تابي Tabby", logo: LogoTabby, status: "بدون فوائد" },
      { name: "مدى Mada", logo: LogoMada, status: "دفع سريع" },
      { name: "Apple Pay", logo: LogoApplePay, status: "دفع سريع" },
    ],
  },
];

export default function Integrations() {
  return (
    <section id="integrations" className="py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Layers size={14} />
            <span>منظومة متكاملة 100%</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5">
            يتكامل بسلاسة مع كل أدوات متجرك
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            لا داعي لتغيير نظامك الحالي. ECOMATE يندمج مع منصاتك وشركات شحنك في دقائق معدودة.
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
              className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#3B4FE8]/30 flex flex-col justify-between transition-all duration-300 shadow-lg shadow-blue-900/5"
            >
              <div className="mb-5">
                <h3 className="text-lg font-black text-slate-950 mb-1">
                  {cat.category}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {cat.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-slate-50 border border-slate-200/80 hover:border-[#3B4FE8]/40 hover:bg-white rounded-2xl p-3.5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-xs">
                        <item.logo className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#3B4FE8] transition-colors truncate">
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
