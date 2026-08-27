"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Lightbulb, Clock, ArrowUpRight } from "lucide-react";

const articles = [
  {
    title: "كيف تسترجع حتى 35% من السلات المتروكة في متجرك بدون إزعاج العميل؟",
    category: "التجارة الإلكترونية",
    readTime: "4 دقائق قراءة",
    desc: "استراتيجيات عملية مجربة لأتمتة رسائل المتابعة وتقديم عروض تحفيزية تزيد معدل التحويل.",
  },
  {
    title: "أتمتة خدمة العملاء: متى تتدخل التقنية ومتى يكون التدخل البشري ضرورة؟",
    category: "خدمة العملاء والأتمتة",
    readTime: "5 دقائق قراءة",
    desc: "دليل إدارة نقاط الاتصال لضمان سرعة الرد مع الحفاظ على اللمسة الإنسانية وبناء ولاء العميل.",
  },
  {
    title: "دليل الشركات لتنظيم بيانات العملاء واستخدامها في مضاعفة المبيعات",
    category: "البيانات والنمو",
    readTime: "6 دقائق قراءة",
    desc: "كيف تحول سجلات المحادثات والطلبات السابقة إلى حملات إعادة استهداف موسمية تحقق أعلى عائد.",
  },
];

export default function KnowledgeSection() {
  return (
    <section id="knowledge" className="py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <BookOpen size={14} />
              <span>المعرفة التي تساعدك تنمو</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight mb-3">
              مواضيع عملية لأصحاب الشركات والمتاجر
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              من إدارة المتجر وخدمة العملاء إلى الأتمتة والذكاء الاصطناعي وتحسين العمليات. نشارك أفكارًا وحلولًا مبنية على الأسئلة والتحديات الحقيقية في السوق السعودي.
            </p>
          </div>

          <a
            href="#knowledge"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all self-start md:self-auto shrink-0"
          >
            <span>استكشف المدونة</span>
            <ArrowLeft size={16} className="text-[#3B4FE8]" />
          </a>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-md shadow-blue-900/5 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="text-[#3B4FE8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
                    {art.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Clock size={12} /> {art.readTime}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-950 mb-3 leading-snug group-hover:text-[#3B4FE8] transition-colors">
                  {art.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                  {art.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-[#3B4FE8] transition-colors">
                <span>قراءة المقال بالكامل</span>
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
