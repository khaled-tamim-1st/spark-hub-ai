"use client";

import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Building2,
  Store,
} from "lucide-react";

interface SectorShowcaseProps {
  onOpenConsultation: () => void;
}

const examples = [
  {
    title: "مطاعم وسلاسل مطاعم",
    subtitle: "فرع أو عدة فروع",
    icon: UtensilsCrossed,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    points: [
      "هوية بصرية موحدة بين الفروع (منيو، لافتات، وتغليف)",
      "نظام طلبات وحجز مباشر لتسهيل تجربة العميل",
      "أتمتة الرد على استفسارات المنيو والموقع والطلبات",
    ],
  },
  {
    title: "عيادات ومراكز طبية",
    subtitle: "أسنان، جلدية، ومراكز تخصصية",
    icon: Stethoscope,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    points: [
      "حجز مواعيد أسهل وأسرع بضغطة زر",
      "تذكير آلي بالمواعيد يقلل غياب المرضى (No-Shows)",
      "هوية بصرية واحترافية تبني الثقة والاطمئنان",
    ],
  },
  {
    title: "صالونات ومراكز عناية",
    subtitle: "عناية وتجميل وسبا",
    icon: Scissors,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    points: [
      "حجز خدمات أونلاين على مدار 24 ساعة",
      "تذكير تلقائي بالمواعيد وعروض الزيارات الدورية",
      "تسويق محلي يجيب عميلات جدد من محيط الصالون",
    ],
  },
];

export default function SectorShowcase({ onOpenConsultation }: SectorShowcaseProps) {
  return (
    <section id="sectors" className="py-20 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#0454FF]/20 text-[#0454FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles size={14} />
            <span>أمثلة وتطبيقات واقعية</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
            لأي نوع براند بنشتغل
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            حلولنا مصممة لتخدم أصحاب البراندات والأعمال المحلية بمختلف أنشطتها — نبني لك المنظومة اللي تناسب طبيعة عملائك وتحدياتك اليومية.
          </p>
        </div>

        {/* 3 Unified Clean Example Cards (No tabs, No chat simulators) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {examples.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 hover:border-[#0454FF]/40 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-lg group text-right"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                    <item.icon size={22} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {item.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-slate-950 mb-4 group-hover:text-[#0454FF] transition-colors">
                  {item.title}
                </h3>

                {/* Points */}
                <ul className="space-y-3 pt-3 border-t border-slate-100 mb-6">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      <CheckCircle2 size={16} className="text-[#0454FF] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-[#0454FF] transition-colors">
                <span>هوية + تسويق + أدوات + أتمتة</span>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* General Statement Callout */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center max-w-2xl mx-auto shadow-xs">
          <p className="text-slate-700 text-xs sm:text-sm font-bold">
            عندك نشاط تجاري أو براند آخر؟ <button onClick={onOpenConsultation} className="text-[#0454FF] underline mr-1 hover:text-[#0047E0]">احجز استشارتك المجانية</button> ونوضح لك كيف تنطبق حلولنا على مجالك.
          </p>
        </div>

      </div>
    </section>
  );
}
