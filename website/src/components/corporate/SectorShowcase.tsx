"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Stethoscope,
  Scissors,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Smartphone,
  Calendar,
  MessageSquare,
  Clock,
  TrendingUp,
} from "lucide-react";

interface SectorShowcaseProps {
  onOpenConsultation: () => void;
}

const sectors = [
  {
    id: "restaurants",
    icon: UtensilsCrossed,
    title: "مطاعم وسلاسل مطاعم",
    subtitle: "فرع أو عدة فروع",
    badge: "قطاع الأغذية والمشروبات",
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50/50 border-orange-200/80",
    accent: "#EA580C",
    mainProblem: "تشتت الهوية بين الفروع + ضياع رسائل واستفسارات الطلبات والحجز في أوقات الذروة.",
    solutions: [
      {
        title: "هوية بصرية موحدة بين الفروع",
        desc: "تصميم متناسق للمنيو المطبوع والرقمي، ديكورات الفروع، والتغليف يجعل براندك معروفاً فوراً.",
      },
      {
        title: "نظام طلبات وحجز مباشر",
        desc: "صفحة طلب وحجز سريعة وسلسة للعميل بدون عمولات تطبيقات التوصيل الخارجية.",
      },
      {
        title: "أتمتة الردود على الواتساب",
        desc: "رد فوري على استفسارات المنيو، الموقع، أوقات العمل، وتأكيد الحجوزات 24/7.",
      },
    ],
    mockup: {
      type: "chat",
      sender: "مطعم ريف • الفرع الرئيسي",
      time: "07:30 PM",
      preview: "تم تأكيد طلبك #4829:\n🍔 2x برجر كلاسيك دبل\n🍟 1x بطاطس بالجبنة\n🥤 2x مشروب غازي\n\n📍 الاستلام من فرع التحلية خلال 15 دقيقة.",
    },
  },
  {
    id: "clinics",
    icon: Stethoscope,
    title: "عيادات ومراكز طبية",
    subtitle: "أسنان، جلدية، تجميل، عيون",
    badge: "الرعاية الصحية والتجميل",
    color: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50/50 border-sky-200/80",
    accent: "#0284C7",
    mainProblem: "غياب المرضى عن المواعيد (No-Shows) + هوية بصرية لا تعكس مستوى واحترافية الكادر الطبي.",
    solutions: [
      {
        title: "حجز مواعيد أسهل بضغطة زر",
        desc: "رابط حجز سلس يختار منه المريض الطبيب والوقت المتاح بدون انتظار مكالمات طويلة.",
      },
      {
        title: "تذكير آلي بالمواعيد ومتابعة",
        desc: "رسائل تذكير ذكية قبل الموعد تؤكد الحضور وتقلل الغياب بنسبة تصل إلى 80%.",
      },
      {
        title: "هوية بصرية تبني الثقة والوقار",
        desc: "تصاميم راقية تعكس الأمان الطبي والاحترافية للمركز عبر كافة قنوات التواصل.",
      },
    ],
    mockup: {
      type: "booking",
      sender: "عيادات النخبة التخصصية",
      time: "11:00 AM",
      preview: "تذكير بموعدك القادم 🩺\n\nالمريض: سارة الأحمد\nالعيادة: د. ريم - الجلدية والتجميل\nالموعد: اليوم الساعة 5:30 مساءً\n\nللتأكيد اضغط 1، أو لتعديل الموعد اضغط 2.",
    },
  },
  {
    id: "salons",
    icon: Scissors,
    title: "صالونات ومراكز عناية",
    subtitle: "صالونات نسائية ورجالية وسبا",
    badge: "العناية الشخصية والجمال",
    color: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50/50 border-rose-200/80",
    accent: "#E11D48",
    mainProblem: "صعوبة إدارة أوقات الذروة والرد على طلبات الحجز أثناء تقديم الخدمة.",
    solutions: [
      {
        title: "حجز خدمات أونلاين 24/7",
        desc: "تتيح للعميلات اختيار الخدمة، الخبيرة، والوقت المناسب في أي وقت حتى بعد إغلاق الصالون.",
      },
      {
        title: "تسويق محلي يجيب عملاء جدد",
        desc: "حملات إعلانية مركزة على أهالي الحي والأحياء المجاورة بعروض افتتاح ومناسبات.",
      },
      {
        title: "برامج ولاء وعروض مخصصة",
        desc: "تذكير تلقائي بالزيارة الدورية وعروض عيد الميلاد ومتابعة رضا العميل بعد كل زيارة.",
      },
    ],
    mockup: {
      type: "salon",
      sender: "صالون غاردينيا للتجميل",
      time: "03:15 PM",
      preview: "تم حجز موعدكِ بنجاح 🌸\n\nالخدمة: بكج العناية الملكي + سشوار\nالأخصائية: مريم\nالموعد: السبت 4:00 عصراً\n\nنتشرف بزيارتكِ ونسعد بخدمتك!",
    },
  },
];

export default function SectorShowcase({ onOpenConsultation }: SectorShowcaseProps) {
  const [activeTab, setActiveTab] = useState(sectors[0].id);
  const currentSector = sectors.find((s) => s.id === activeTab) || sectors[0];

  return (
    <section id="sectors" className="py-24 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#0454FF]/20 text-[#0454FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles size={14} />
            <span>قطاعات الأعمال المحلية</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
            لأي نوع براند بنشتغل
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            حلول عملية مخصصة تراعي التحديات الواقعية لنشاطك المحلي وطبيعة عملائك في السوق السعودي.
          </p>
        </div>

        {/* Sector Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all border ${
                activeTab === sec.id
                  ? "bg-white text-slate-950 border-slate-300 shadow-md scale-105"
                  : "bg-white/60 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900"
              }`}
            >
              <sec.icon size={18} style={{ color: sec.accent }} />
              <span>{sec.title}</span>
            </button>
          ))}
        </div>

        {/* Active Sector Display Card */}
        <motion.div
          key={currentSector.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Content Column */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentSector.color} flex items-center justify-center text-white shadow-md`}>
                  <currentSector.icon size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block">{currentSector.badge}</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    {currentSector.title}
                  </h3>
                </div>
              </div>

              {/* Challenge / Problem Statement */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                <strong className="text-slate-900 font-bold block mb-1">التحدي الشائع:</strong>
                {currentSector.mainProblem}
              </div>

              {/* Specific Solution Points */}
              <div className="space-y-4 pt-2">
                {currentSector.solutions.map((sol, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0454FF] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 mb-1">
                        {sol.title}
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        {sol.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA for this Sector */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenConsultation}
                  className="bg-[#0454FF] hover:bg-[#0047E0] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#0454FF]/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>استشارة مجانية لـ {currentSector.title}</span>
                  <ArrowLeft size={16} />
                </button>
              </div>

            </div>

            {/* Right/Mockup Column */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 relative">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0454FF] flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs font-black block">{currentSector.mockup.sender}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">متصل الآن 🟢</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{currentSector.mockup.time}</span>
                </div>

                {/* Message Bubble Preview */}
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 mb-6 text-right whitespace-pre-line leading-relaxed text-xs font-medium text-slate-200">
                  {currentSector.mockup.preview}
                </div>

                {/* Impact Stat Badge */}
                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-4 text-center">
                  <span className="text-[11px] text-blue-200 font-bold block mb-1">
                    أدوات متصلة بهويتك وتخدم عملاءك
                  </span>
                  <span className="text-sm font-black text-white">
                    تجربة متكاملة من أول زيارة لغاية ما يرجع تاني
                  </span>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
