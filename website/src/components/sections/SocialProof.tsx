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
    <section className="py-16 bg-[#0B0B14] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C499FF] uppercase tracking-wider bg-[#6B00FF]/15 border border-[#6B00FF]/30 px-3.5 py-1.5 rounded-full mb-3">
          <ShieldCheck size={14} />
          <span>شركاء النجاح في التجارة الإلكترونية السعودية</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          تعتمد عليه كبرى المتاجر الرائدة على منصة سلة
        </h2>
      </div>

      {/* Marquee Slider with Gradient Edge Fades */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0B14] to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0B14] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden py-2">
          <div className="flex gap-4 marquee-track">
            {duplicatedStores.map((store, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-[#141422]/90 border border-[#6B00FF]/15 hover:border-[#9B59FF]/50 rounded-2xl p-4 w-[280px] transition-all hover:bg-[#1A1A2E] shadow-lg shadow-black/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <ShoppingBag size={14} className="text-[#9B59FF]" />
                    <span className="truncate">{store.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} />
                    {store.platform}
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 mb-2">
                  {store.category}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-gray-300 font-medium">{store.sales}</span>
                  <span className="text-[#C499FF] font-bold flex items-center gap-0.5">
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
