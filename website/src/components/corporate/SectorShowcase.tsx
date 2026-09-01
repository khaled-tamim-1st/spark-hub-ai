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
} from "lucide-react";

interface SectorShowcaseProps {
  onOpenConsultation: () => void;
}

const examples = [
  {
    title: "قطاع المطاعم والمقاهي",
    subtitle: "الفروع المفردة والمتعددة",
    icon: UtensilsCrossed,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    desc: "توحيد الهوية البصرية بين الفروع ونقاط البيع، مع إتاحة قنوات طلب وحجز مباشرة عبر القوائم الرقمية، وتفعيل ردود تلقائية للاستفسارات المتكررة حول الموقع والمنيو.",
    points: [
      "توحيد لغة التصميم في المنيو، اللافتات، ومواد التغليف",
      "قنوات طلب واستلام مباشرة دون عمولات وسيطة",
      "أتمتة الرد على استفسارات المنيو وأوقات العمل والموقع",
    ],
  },
  {
    title: "العيادات والمراكز الطبية",
    subtitle: "الأسنان، الجلدية، والمراكز التخصصية",
    icon: Stethoscope,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    desc: "بناء هوية تعكس الثقة والوقار الطبي، مع نظام حجز مواعيد رقمي ميسر وتذكير آلي بالرسائل يقلل من نسبة غياب المرضى عن مواعيدهم المجدولة.",
    points: [
      "نظام حجز مواعيد مرن وسهل الاستخدام للمرضى",
      "إشعارات وتذكير آلي بالمواعيد يقلل الغياب (No-Shows)",
      "هوية بصرية وقوالب رقمية تعزز ثقة المراجعين",
    ],
  },
  {
    title: "صالونات ومراكز العناية الشخصية",
    subtitle: "الصالونات الرجالية والنسائية والسبا",
    icon: Scissors,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    desc: "إتاحة حجز الخدمات واختيار الأوقات رقمياً على مدار اليوم، مع استهداف تسويقي لسكان النطاق الجغرافي وتنبيهات مخصصة لمتابعة تكرار الزيارات.",
    points: [
      "إمكانية حجز الخدمات واختيار الوقت المتاح 24/7",
      "حملات تسويق محلي تركز على النطاق الجغرافي المحيط",
      "تنبيهات دورية لمتابعة رضا العملاء وتكرار الزيارة",
    ],
  },
];

export default function SectorShowcase({ onOpenConsultation }: SectorShowcaseProps) {
  return (
    <section id="sectors" className="py-20 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#0454FF]/20 text-[#0454FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles size={14} />
            <span>نماذج التطبيق العملي</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
            كيف تخدم حلولنا مختلف الأنشطة التجارية
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            تتنوع خصوصية كل نشاط تجاري، وتتكامل منظومتنا لتلائم المتطلبات التشغيلية والتسويقية لكل قطاع وفق نموذج عمله.
          </p>
        </div>

        {/* 3 Balanced Neutral Example Cards */}
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
                <h3 className="text-xl font-black text-slate-950 mb-3 group-hover:text-[#0454FF] transition-colors">
                  {item.title}
                </h3>

                {/* Paragraph Description */}
                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-5">
                  {item.desc}
                </p>

                {/* Points */}
                <ul className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      <CheckCircle2 size={15} className="text-[#0454FF] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-[#0454FF] transition-colors">
                <span>تطبيق متكامل للأركان الأربعة</span>
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Informative Note */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center max-w-2xl mx-auto shadow-xs">
          <p className="text-slate-700 text-xs sm:text-sm font-medium">
            هل تدير نشاطاً تجارياً في قطاع آخر؟ <button onClick={onOpenConsultation} className="text-[#0454FF] font-bold underline mr-1 hover:text-[#0047E0]">تواصل معنا</button> للاطلاع على سبل مواءمة خدماتنا مع نموذج عملك.
          </p>
        </div>

      </div>
    </section>
  );
}
