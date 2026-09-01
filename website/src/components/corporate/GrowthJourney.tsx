"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Megaphone,
  Code2,
  Zap,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface GrowthJourneyProps {
  onOpenConsultation: () => void;
}

const pillars = [
  {
    step: "01",
    pillar: "البراندنج والهوية التجارية",
    title: "تأسيس الهوية البصرية والاتساق المؤسسي",
    desc: "بناء وتطوير هوية بصرية موحدة تضمن ظهوراً احترافياً ومتسقاً لعلامتك التجارية عبر كافة الفروع ونقاط الاتصال مع العميل.",
    details: [
      "تصميم الشعار وتطوير الدليل الإرشادي الكامل للهوية (Brand Identity Guidelines)",
      "توحيد لغة التصميم في واجهات الفروع، المنيو، المطبوعات، ومواد التغليف",
      "إعداد قوالب بصرية متسقة للحسابات الرقمية وقنوات التواصل الاجتماعي",
    ],
    icon: Palette,
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-600 text-white",
  },
  {
    step: "02",
    pillar: "التسويق والنمو المحلي",
    title: "استراتيجيات التسويق الموجه وبناء الجمهور",
    desc: "صياغة وإدارة خطط تسويقية تعتمد على الاستهداف الجغرافي المدروس للوصول إلى الجمهور الفعلي في نطاق فروعك وتحفيز تكرار الزيارات.",
    details: [
      "إدارة الحملات الإعلانية الموجهة جغرافياً (Geo-Targeting) في النطاق المحيط",
      "تخطيط وإطلاق العروض الترويجية والحملات الموسمية لتحريك المبيعات",
      "تحسين محركات البحث المحلي والظهور الاحترافي على خرائط جوجل",
    ],
    icon: Megaphone,
    badgeBg: "bg-blue-50 text-[#0454FF] border-blue-200",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-[#0454FF] text-white",
  },
  {
    step: "03",
    pillar: "الحلول والأنظمة التقنية",
    title: "تطوير أدوات تفاعلية تسهّل تجربة العميل",
    desc: "بناء وتجهيز منصات حجز وطلب رقمية خفيفة وسريعة تمكّن عملاءك من التفاعل والشراء المباشر دون وسطاء أو تعقيد في الإجراءات.",
    details: [
      "صفحات ومنصات حجز مواعيد وطلب مباشر متوافقة بالكامل مع الجوال",
      "قوائم ومنيوهات رقمية تفاعلية تتيح استعراض الخدمات والمنتجات بوضوح",
      "ربط وتكامل تقني مباشر مع بوابات الدفع الإلكتروني وقنوات التواصل",
    ],
    icon: Code2,
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-600 text-white",
  },
  {
    step: "04",
    pillar: "الأتمتة والتشغيل الذكي",
    title: "أتمتة العمليات وقنوات خدمة العملاء",
    desc: "توظيف الأتمتة الذكية للرد اللحظي على الاستفسارات المتكررة وإرسال تذكيرات المواعيد المجدولة لرفع كفاءة التشغيل وتوفير الوقت.",
    details: [
      "ردود مؤتمتة وفورية على الاستفسارات الشائعة والمنيو والموقع على مدار الساعة",
      "نظام إشعارات وتذكير آلي بالمواعيد والطلبات لتقليل نسبة الغياب (No-Shows)",
      "أتمتة استطلاعات الرأي وجمع التقييمات الإيجابية بعد إتمام الخدمة",
    ],
    icon: Zap,
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-600 text-white",
  },
];

export default function GrowthJourney({ onOpenConsultation }: GrowthJourneyProps) {
  return (
    <section id="solutions" className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#0454FF]/20 text-[#0454FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles size={14} />
            <span>منهجية ECOMATE المتكاملة</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
            تكامل الهوية، التسويق، والتقنية في مسار واحد
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            نؤمن أن تميز البراند لا يتحقق بالحلول المجزأة؛ بل بتكامل الهوية البصرية مع استراتيجيات التسويق والأدوات الرقمية التي يلمسها العميل في كل زيارة.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {pillars.map((item, idx) => (
            <motion.div
              key={item.pillar}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-slate-50/60 hover:bg-white rounded-3xl p-8 sm:p-9 border border-slate-200 hover:border-[#0454FF]/40 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl group relative overflow-hidden text-right"
            >
              {/* Soft Gradient Overlay on Hover */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${item.gradient} rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div>
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-md`}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block font-mono">الركن {item.step}</span>
                      <span className="text-sm font-black text-slate-900">{item.pillar}</span>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeBg}`}>
                    {item.pillar}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 group-hover:text-[#0454FF] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6">
                  {item.desc}
                </p>

                {/* Scope Points */}
                <ul className="space-y-2.5 pt-4 border-t border-slate-200/80 mb-6">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      <CheckCircle2 size={16} className="text-[#0454FF] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0454FF]">
                <span>حلول مصممة وفق نموذج نشاطك</span>
                <button
                  onClick={onOpenConsultation}
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>استفسر عن هذه الخدمة</span>
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Informative Consultation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-blue-50/70 border border-[#0454FF]/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="text-right">
            <h4 className="text-lg sm:text-xl font-black text-slate-950 mb-1">
              كيف نحدد أولويات احتياجات براندك؟
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              نقوم بدراسة وضع براندك الحالي وفروعه وقنوات تسويقه لتحديد الحلول ذات الأثر الأكبر على أعمالك.
            </p>
          </div>

          <button
            onClick={onOpenConsultation}
            className="shrink-0 bg-[#0454FF] hover:bg-[#0047E0] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#0454FF]/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>طلب جلسة استشارية أولية</span>
            <ArrowLeft size={16} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
