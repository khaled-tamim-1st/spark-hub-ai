"use client";

import { CheckCircle, ShoppingBag, TrendingUp, ShieldCheck } from "lucide-react";

const stores = [
  {
    name: "متجر روافد العطور",
    category: "عطور وفاخرة",
    sales: "أكثر من 14,000 محادثة شهرياً",
    growth: "+38% مبيعات",
    platform: "سلة بلس",
  },
  {
    name: "دار الأناقة للعبايات",
    category: "أزياء وموضة",
    sales: "تتبع 4,200 طلب شهرياً",
    growth: "صفر تأخير",
    platform: "سلة برو",
  },
  {
    name: "ماتشا وبن للقهوة المختصة",
    category: "أغذية ومشروبات",
    sales: "رد فوري على الاستفسارات",
    growth: "رضا 99%",
    platform: "سلة بلس",
  },
  {
    name: "سويفت تك للإلكترونيات",
    category: "إلكترونيات وهواتف",
    sales: "أتمتة الدعم الفني 100%",
    growth: "توفير 4 موظفين",
    platform: "سلة إنتربرايز",
  },
  {
    name: "متجر هدايا وتذكار",
    category: "هدايا ومناسبات",
    sales: "استرداد السلات المتروكة",
    growth: "+27% تحويل",
    platform: "سلة بلس",
  },
  {
    name: "نقاء لمستحضرات التجميل",
    category: "عناية وتجميل",
    sales: "دعم متعدد القنوات",
    growth: "رد في 1.1s",
    platform: "سلة برو",
  },
];

const duplicatedStores = [...stores, ...stores];

export default function SocialProof() {
  return (
    <section className="py-16 bg-[#FAFAFE] border-y border-[#EDE9FE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#6B00FF] uppercase tracking-wider bg-[#EDE9FE] border border-[#DDD6FE] px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
          <ShieldCheck size={14} />
          <span>شركاء النجاح في التجارة الإلكترونية السعودية</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          تعتمد عليه كبرى المتاجر الرائدة على منصة سلة
        </h2>
      </div>

      {/* Marquee Slider with Soft Gradient Edge Fades */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#FAFAFE] to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#FAFAFE] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden py-2">
          <div className="flex gap-4 marquee-track">
            {duplicatedStores.map((store, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white border border-[#EDE9FE] hover:border-[#C4B5FD] rounded-2xl p-4 w-[280px] transition-all hover:shadow-md hover:shadow-purple-900/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <ShoppingBag size={14} className="text-[#6B00FF]" />
                    <span className="truncate">{store.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <CheckCircle size={10} />
                    {store.platform}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-medium mb-2">
                  {store.category}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  <span className="text-slate-600 font-semibold">{store.sales}</span>
                  <span className="text-[#6B00FF] font-bold flex items-center gap-0.5">
                    <TrendingUp size={11} />
                    {store.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
