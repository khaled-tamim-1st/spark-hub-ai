"use client";

import { CheckCircle2, ShieldCheck, TrendingUp } from "lucide-react";
import {
  LogoSalla,
  LogoZid,
  LogoSMSA,
  LogoAramex,
  LogoTamara,
  LogoTabby,
  LogoWhatsApp,
} from "@/components/ui/BrandLogos";

const trustedPartners = [
  {
    name: "سلة Salla",
    category: "منصة تجارة إلكترونية",
    logo: LogoSalla,
    status: "ربط مباشر متكامل",
    metric: "مزامنة لحظية للطلبات",
  },
  {
    name: "زد Zid",
    category: "منصة تجارة إلكترونية",
    logo: LogoZid,
    status: "تكامل رسمي",
    metric: "أتمتة الفواتير والعملاء",
  },
  {
    name: "SMSA Express",
    category: "شحن وتوصيل",
    logo: LogoSMSA,
    status: "تتبع بوالص",
    metric: "تحديث لحظي للشحنة",
  },
  {
    name: "Aramex أرامكس",
    category: "شحن دولي ومحلي",
    logo: LogoAramex,
    status: "تتبع بوالص",
    metric: "استعلام فوري للعميل",
  },
  {
    name: "تمارا Tamara",
    category: "دفع وتقسيط",
    logo: LogoTamara,
    status: "تقسيط 4 دفعات",
    metric: "رد فوري على الأقساط",
  },
  {
    name: "تابي Tabby",
    category: "دفع وتقسيط",
    logo: LogoTabby,
    status: "بدون فوائد",
    metric: "زيادة معدل إتمام الشراء",
  },
  {
    name: "واتساب للأعمال",
    category: "قناة محادثة رئيسية",
    logo: LogoWhatsApp,
    status: "ردود آلية 24/7",
    metric: "رد فوري في أقل من 1s",
  },
];

const duplicatedPartners = [...trustedPartners, ...trustedPartners];

export default function SocialProof() {
  return (
    <section className="py-14 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-7">
        <div className="inline-flex items-center gap-2 text-xs font-black text-[#3B4FE8] uppercase tracking-wider bg-blue-50 border border-[#3B4FE8]/20 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
          <ShieldCheck size={14} />
          <span>تكامل موثوق مع رواد منظومة التجارة الإلكترونية</span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">
          متوافق ومتكامل 100% مع منصاتك وشركات الشحن والدفع المعتمدة
        </h2>
      </div>

      {/* Marquee Slider with Real Brand Logos */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden py-2">
          <div className="flex gap-4 marquee-track">
            {duplicatedPartners.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white border border-slate-200/80 hover:border-[#3B4FE8]/40 rounded-2xl p-4 w-[290px] transition-all hover:shadow-md shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-2xs">
                      <item.logo className="w-full h-full object-contain" />
                    </div>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <CheckCircle2 size={10} />
                    {item.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-medium mb-2">
                  {item.category}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  <span className="text-slate-600 font-semibold">{item.metric}</span>
                  <span className="text-[#3B4FE8] font-bold flex items-center gap-0.5">
                    <TrendingUp size={11} />
                    جاهز للربط
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
