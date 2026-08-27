"use client";

import { motion } from "framer-motion";
import { Workflow, Users, BarChart3, Wrench, Sparkles, ArrowLeft } from "lucide-react";

const solutions = [
  {
    id: "automation",
    icon: Workflow,
    title: "أتمتة العمليات",
    desc: "قلل المهام اليدوية وخل فريقك يركز على الأعمال التي تحتاج قيمة حقيقية وقرارات استراتيجية.",
    badge: "كفاءة وإنتاجية",
    color: "from-[#3B4FE8] to-[#5B6EFF]",
    highlights: ["أتمتة الردود والمراسلات", "ربط الأنظمة وتدفق البيانات", "تقليل الأخطاء البشرية"],
  },
  {
    id: "cx",
    icon: Users,
    title: "إدارة وتجربة العملاء",
    desc: "نظّم تفاعلاتك مع العملاء عبر مختلف القنوات وحسّن سرعة وجودة الاستجابة في كل نقطة اتصال.",
    badge: "رضا وولاء العميل",
    color: "from-emerald-500 to-emerald-600",
    highlights: ["صندوق محادثات موحد", "رد فوري على مدار الساعة", "سجل عملاء منظم وشامل"],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "البيانات والتحليلات",
    desc: "حوّل بيانات عملائك وعملياتك إلى معلومات واضحة ورؤى دقيقة تساعدك على اتخاذ قرارات أفضل.",
    badge: "قرارات مبنية على الأرقام",
    color: "from-indigo-500 to-indigo-600",
    highlights: ["لوحات أداء لحظية", "تحليل سلوك ومشتريات العملاء", "تقارير فرص النمو الضائعة"],
  },
  {
    id: "custom",
    icon: Wrench,
    title: "حلول مخصصة",
    desc: "عندما لا يكفي الحل الجاهز، نساعدك في بناء وتطوير حل رقمي مخصص يناسب طبيعة عملك واحتياجاتك.",
    badge: "تصميم حسب الطلب",
    color: "from-amber-500 to-amber-600",
    highlights: ["تكامل API مخصص", "أتمتة سيناريوهات العمل المعقدة", "استشارات تقنية وتشغيلية"],
  },
];

export default function CorporateServices() {
  return (
    <section id="solutions" className="py-28 bg-white relative overflow-hidden">
      {/* Soft Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#3B4FE8]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles size={14} />
            <span>ماذا نقدم؟</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            حلول الأعمال — <span className="ecomate-gradient-text">لتشغيل أذكى ونمو أسرع</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            نساعد الشركات على تحسين وتطوير عملياتها باستخدام الأتمتة والأدوات الرقمية والذكاء الاصطناعي العملي.
          </motion.p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50/60 rounded-3xl p-8 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-md shadow-blue-900/5 hover:shadow-xl hover:bg-white group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md shadow-[#3B4FE8]/20`}>
                    <item.icon size={26} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-3 group-hover:text-[#3B4FE8] transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Highlights List */}
              <div className="pt-5 border-t border-slate-200/80 space-y-2">
                {item.highlights.map((hl) => (
                  <div key={hl} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B4FE8]"></span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
