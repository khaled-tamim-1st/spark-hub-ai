"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowUpLeft, ArrowLeft, Palette, Megaphone, Zap } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    slug: "local-brand-identity-guide",
    title: "الهوية البصرية للبراندات المحلية: كيف تجعل فروعك معروفة من أول نظرة؟",
    category: "البراندنج والهوية",
    categoryColor: "text-purple-700 bg-purple-50 border-purple-100",
    icon: Palette,
    readTime: "6 دقائق",
    desc: "دليل عملي لأصحاب المطاعم والصالونات: كيف توحد المنيو، التغليف، واللافتات لتبني اسماً يرسخ في ذهن العميل.",
  },
  {
    slug: "local-business-geo-marketing",
    title: "التسويق المحلي: كيف تجذب عملاء حقيقيين لمطعمك أو عيادتك في منطقتك؟",
    category: "التسويق والنمو",
    categoryColor: "text-[#0454FF] bg-blue-50 border-blue-100",
    icon: Megaphone,
    readTime: "7 دقائق",
    desc: "استراتيجيات التسويق الجغرافي وحملات المناسبات التي تحرك المبيعات الفعلية وتجلب زواراً لفروعك بدل اللايكات فقط.",
  },
  {
    slug: "reducing-no-shows-with-automation",
    title: "تقليل غياب المواعيد (No-Shows) في العيادات والصالونات بالأتمتة البسيطة",
    category: "الأتمتة وتجربة العميل",
    categoryColor: "text-amber-700 bg-amber-50 border-amber-100",
    icon: Zap,
    readTime: "5 دقائق",
    desc: "كيف تصمم رسائل تذكير تلقائية ومحترمة على الواتساب تحافظ على أوقات الأطباء والخبراء وتمنع خسارة المواعيد.",
  },
];

export default function BlogShowcase() {
  return (
    <section id="blog" className="py-24 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#0454FF]/20 text-[#0454FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <BookOpen size={14} />
              <span>المدونة ودليل نمو البراندات</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-3">
              أفكار وأدلة عملية لتطوير براندك
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              مقالات واقعية وتجارب تطبيقية في البراندنج، التسويق، وتجربة العملاء مكتوبة خصيصاً لأصحاب الأعمال في السوق المحلي.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:border-[#0454FF]/40 transition-all self-start md:self-auto shrink-0"
          >
            <span>استعراض كافة المقالات</span>
            <ArrowLeft size={16} className="text-[#0454FF]" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#0454FF]/40 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 group"
            >
              <div>
                {/* Category & Read Time */}
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className={`px-3 py-1 rounded-full font-bold border ${art.categoryColor}`}>
                    {art.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
                    <Clock size={12} /> {art.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-950 mb-3 leading-snug group-hover:text-[#0454FF] transition-colors">
                  {art.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                  {art.desc}
                </p>
              </div>

              {/* Link */}
              <Link
                href={`/blog`}
                className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-[#0454FF] transition-colors"
              >
                <span>قراءة المقال</span>
                <ArrowUpLeft size={16} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
