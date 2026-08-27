"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowUpLeft, ArrowLeft } from "lucide-react";
import Link from "next/link";

const featuredArticles = [
  {
    slug: "abandoned-cart-reasons-and-solutions",
    title: "السلات المتروكة: ليش العميل يضيف للسلة وما يكمل الطلب؟",
    category: "التجارة الإلكترونية",
    readTime: "9 دقائق",
    desc: "دليل تشخيصي لأصحاب المتاجر: كيف تحدد أسباب ترك السلة في متجرك، ما الأرقام التي تراقبها، وما الذي تصلحه بيدك أولاً.",
  },
  {
    slug: "cart-recovery-without-annoying-customers",
    title: "كيف تسترجع السلات المتروكة بدون إزعاج العميل؟",
    category: "التشغيل والمبيعات",
    readTime: "8 دقائق",
    desc: "دليل عملي لبناء آلية متابعة مهنية تحترم العميل — تبدأ يدوياً أولاً وتنتقل للأتمتة فقط عندما تصبح ضرورة تشغيلية.",
  },
  {
    slug: "ecommerce-customer-service-guide",
    title: "أتمتة خدمة العملاء: متى تتدخل التقنية ومتى يكون التدخل البشري ضرورة؟",
    category: "خدمة العملاء والتشغيل",
    readTime: "6 دقائق",
    desc: "كيف تدير نقاط التواصل لضمان الرد اللحظي على الاستفسارات المتكررة مع الحفاظ على اللمسة الإنسانية في الحالات الحرجة.",
  },
];

export default function SimpleBlog() {
  return (
    <section id="blog" className="py-24 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <BookOpen size={14} />
              <span>المدونة والمعرفة التشغيلية</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight mb-3">
              المعرفة التي تدعم نمو أعمالك
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              مقالات وأدلة تشخيصية مبنية على التحديات والأسئلة الواقعية التي تواجه أصحاب الشركات والمتاجر في السوق السعودي.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all self-start md:self-auto shrink-0"
          >
            <span>استعراض كافة المقالات</span>
            <ArrowLeft size={16} className="text-[#3B4FE8]" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((art, idx) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="text-[#3B4FE8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
                    {art.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px]">
                    <Clock size={12} /> {art.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 mb-3 leading-snug group-hover:text-[#3B4FE8] transition-colors">
                  {art.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                  {art.desc}
                </p>
              </div>

              <Link
                href={`/blog/${art.slug}`}
                className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-[#3B4FE8] transition-colors"
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
