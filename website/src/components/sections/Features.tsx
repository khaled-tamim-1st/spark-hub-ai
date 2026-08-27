"use client";

import { motion } from "framer-motion";
import {
  Package,
  BookOpen,
  MessageSquare,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white relative overflow-hidden">
      {/* Ambient electric blue glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-sky-100/40 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles size={14} />
            <span>مميزات Ecomate لمتاجر سلة</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            كل ما تحتاجه لإدارة وتنمية متجرك في منصة ذكاء اصطناعي واحدة
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            توقف عن إضاعة الساعات في الرد المكرر على العملاء وتتبع الشحنات يدوياً.
            Ecomate يتكفل بكل العمليات الروتينية لتركز على زيادة أرباحك.
          </motion.p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* BENTO 1 (Col Span 2): Salla Automated Order Resolution */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl p-8 border border-slate-200 hover:border-blue-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-blue-900/5"
          >
            <div className="relative z-10 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B4FE8] to-[#2563EB] flex items-center justify-center text-white mb-5 shadow-md shadow-[#3B4FE8]/25">
                <Package size={24} />
              </div>
              <span className="text-xs font-bold text-[#3B4FE8] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
                تكامل سلة + شركات الشحن
              </span>
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                تتبع الشحنات والطلبات فورياً وبشكل تلقائي
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-medium">
                عندما يسأل العميل عن طلبه، يقوم Ecomate بالبحث الفوري في قاعدة بيانات متجرك على سلة، وجلب حالة الشحنة من (سمسا، أرامكس، أوتو) وإرسال تقرير دقيق للعميل في ثوانٍ.
              </p>
            </div>

            {/* Interactive Visual UI Preview */}
            <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-4.5 mt-2 shadow-sm">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-900 font-bold">طلب سلة #89410</span>
                </div>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  تم التوصيل بنجاح ✓
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">شركة الشحن</span>
                  <strong className="text-slate-900 font-bold">SMSA Express</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">العميل</span>
                  <strong className="text-slate-900 font-bold">محمد القحطاني</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">وقت المعالجة</span>
                  <strong className="text-[#3B4FE8] font-black">0.8 ثانية</strong>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BENTO 2 (Col Span 1): Zero Hallucination Knowledge Base */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl p-8 border border-slate-200 hover:border-blue-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-blue-900/5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5 shadow-sm">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
                100% بدون هلوسة
              </span>
              <h3 className="text-xl font-black text-slate-950 mb-3">
                قاعدة معرفة متجرك الصارمة
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                Ecomate لا يخترع منتجات أو أسعار أبداً. يجيب فقط من المستندات والروابط وسياسات المتجر التي تحددها بنفسك.
              </p>
            </div>

            {/* Document Badges */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-bold">📄 سياسة الاسترجاع 2025</span>
                <span className="text-emerald-700 font-bold text-[10px]">مفهرس ✓</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-bold">🔗 رابط كتالوج المنتجات</span>
                <span className="text-emerald-700 font-bold text-[10px]">مفهرس ✓</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-bold">🛒 منتجات متجر سلة</span>
                <span className="text-[#3B4FE8] font-bold text-[10px]">تزامن لحظي</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO 3 (Col Span 1): Unified Multi-Channel Inbox */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl p-8 border border-slate-200 hover:border-blue-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-blue-900/5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5 shadow-sm">
                <MessageSquare size={24} />
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
                صندوق وارد موحد
              </span>
              <h3 className="text-xl font-black text-slate-950 mb-3">
                كل قنوات التواصل في مكان واحد
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                أدر محادثات واتساب ويب، متجر سلة، انستغرام، وماسنجر في شاشة واحدة منظمة مع تصنيف ذكي للمحادثات.
              </p>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-700 font-bold shadow-sm">
                💬 واتساب ويب
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-700 font-bold shadow-sm">
                🛒 شات متجر سلة
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-700 font-bold shadow-sm">
                📸 انستغرام Direct
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-700 font-bold shadow-sm">
                🌐 ودجت الموقع
              </div>
            </div>
          </motion.div>

          {/* BENTO 4 (Col Span 2): Analytics & ROI Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl p-8 border border-slate-200 hover:border-blue-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-blue-900/5"
          >
            <div className="relative z-10 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5 shadow-sm">
                <BarChart3 size={24} />
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-3">
                تقارير وتحليلات استراتيجية
              </span>
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                قرارات مدعومة بالأرقام ومعدلات رضا العملاء
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-medium">
                لوحة تحكم ذكية تعرض لك معدل الحل التلقائي (Resolution Rate)، أكثر المنتجات والأسئلة تكراراً، وساعات العمل التي تم توفيرها يومياً.
              </p>
            </div>

            {/* Metrics Graph Preview */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 text-xs block font-semibold">معدل الحل الآلي</span>
                <span className="text-2xl font-black text-emerald-600">98.6%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">بدون تدخل بشري</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 text-xs block font-semibold">ساعات عمل موفرة</span>
                <span className="text-2xl font-black text-slate-900">+180 ساعة</span>
                <span className="text-[10px] text-[#3B4FE8] block mt-0.5 font-bold">شهرياً للمتجر الواحد</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-slate-500 text-xs block font-semibold">معدل تقييم العملاء</span>
                <span className="text-2xl font-black text-amber-600">4.9 / 5.0</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">من 12,400 محادثة</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
