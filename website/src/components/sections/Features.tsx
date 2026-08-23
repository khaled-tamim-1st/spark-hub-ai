"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Package,
  BookOpen,
  MessageSquare,
  BarChart3,
  Globe,
  CheckCircle,
  Sparkles,
  Zap,
  ArrowRightLeft,
  ShoppingBag,
  ShieldCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-28 bg-[#07070C] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#6B00FF]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#9B59FF]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#6B00FF]/15 border border-[#6B00FF]/30 text-[#C499FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} />
            <span>مميزات مصممة خصيصاً لمتاجر سلة</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5"
          >
            كل ما تحتاجه لإدارة وتنمية متجرك في منصة ذكاء اصطناعي واحدة
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg leading-relaxed"
          >
            توقف عن إضاعة الساعات في الرد المكرر على العملاء وتتبع الشحنات يدوياً.
            سند يتكفل بكل العمليات الروتينية لتركز على زيادة أرباحك.
          </motion.p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* BENTO 1 (Col Span 2): Salla Automated Order Resolution */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card rounded-3xl p-8 border border-[#6B00FF]/20 relative overflow-hidden flex flex-col justify-between group hover:border-[#9B59FF]/40 transition-all duration-300 shadow-xl"
          >
            <div className="relative z-10 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B00FF] to-[#9B59FF] flex items-center justify-center text-white mb-5 shadow-lg shadow-[#6B00FF]/30">
                <Package size={24} />
              </div>
              <span className="text-xs font-bold text-[#C499FF] bg-[#6B00FF]/20 border border-[#6B00FF]/30 px-3 py-1 rounded-full inline-block mb-3">
                تكامل سلة + شركات الشحن
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">
                تتبع الشحنات والطلبات فورياً وبشكل تلقائي
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                عندما يسأل العميل عن طلبه، يقوم سند بالبحث الفوري في قاعدة بيانات متجرك على سلة، وجلب حالة الشحنة من (سمسا، أرامكس، أوتو) وإرسال تقرير دقيق للعميل في ثوانٍ.
              </p>
            </div>

            {/* Interactive Visual UI Preview */}
            <div className="relative z-10 bg-[#0E0E17] border border-white/10 rounded-2xl p-4.5 mt-2">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-white font-bold">طلب سلة #89410</span>
                </div>
                <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                  تم التوصيل بنجاح ✓
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[11px]">
                <div className="bg-[#141422] p-2 rounded-xl">
                  <span className="text-gray-400 block">شركة الشحن</span>
                  <strong className="text-white">SMSA Express</strong>
                </div>
                <div className="bg-[#141422] p-2 rounded-xl">
                  <span className="text-gray-400 block">العميل</span>
                  <strong className="text-white">محمد القحطاني</strong>
                </div>
                <div className="bg-[#141422] p-2 rounded-xl">
                  <span className="text-gray-400 block">وقت المعالجة</span>
                  <strong className="text-[#C499FF]">0.8 ثانية</strong>
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
            className="glass-card rounded-3xl p-8 border border-[#6B00FF]/20 relative overflow-hidden flex flex-col justify-between group hover:border-[#9B59FF]/40 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-lg">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block mb-3">
                100% بدون هلوسة
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                قاعدة معرفة متجرك الصارمة
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                سند لا يخترع منتجات أو أسعار أبداً. يجيب فقط من المستندات والروابط وسياسات المتجر التي تحددها بنفسك.
              </p>
            </div>

            {/* Document Badges */}
            <div className="bg-[#0E0E17] border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 font-medium">📄 سياسة الاسترجاع 2025</span>
                <span className="text-emerald-400 text-[10px]">مفهرس ✓</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 font-medium">🔗 رابط كتالوج المنتجات</span>
                <span className="text-emerald-400 text-[10px]">مفهرس ✓</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5 font-medium">🛒 منتجات متجر سلة</span>
                <span className="text-emerald-400 text-[10px]">تزامن لحظي</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO 3 (Col Span 1): Unified Multi-Channel Inbox */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-8 border border-[#6B00FF]/20 relative overflow-hidden flex flex-col justify-between group hover:border-[#9B59FF]/40 transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 shadow-lg">
                <MessageSquare size={24} />
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block mb-3">
                صندوق وارد موحد
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                كل قنوات التواصل في مكان واحد
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                أدر محادثات واتساب ويب، متجر سلة، انستغرام، وماسنجر في شاشة واحدة منظمة مع تصنيف ذكي للمحادثات.
              </p>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-[#0E0E17] border border-white/5 p-2.5 rounded-xl text-gray-300 font-medium">
                💬 واتساب ويب
              </div>
              <div className="bg-[#0E0E17] border border-white/5 p-2.5 rounded-xl text-gray-300 font-medium">
                🛒 شات متجر سلة
              </div>
              <div className="bg-[#0E0E17] border border-white/5 p-2.5 rounded-xl text-gray-300 font-medium">
                📸 انستغرام Direct
              </div>
              <div className="bg-[#0E0E17] border border-white/5 p-2.5 rounded-xl text-gray-300 font-medium">
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
            className="lg:col-span-2 glass-card rounded-3xl p-8 border border-[#6B00FF]/20 relative overflow-hidden flex flex-col justify-between group hover:border-[#9B59FF]/40 transition-all duration-300 shadow-xl"
          >
            <div className="relative z-10 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white mb-5 shadow-lg shadow-amber-500/20">
                <BarChart3 size={24} />
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block mb-3">
                تقارير وتحليلات استراتيجية
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">
                قرارات مدعومة بالأرقام ومعدلات رضا العملاء
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                لوحة تحكم ذكية تعرض لك معدل الحل التلقائي (Resolution Rate)، أكثر المنتجات والأسئلة تكراراً، وساعات العمل التي تم توفيرها يومياً.
              </p>
            </div>

            {/* Metrics Graph Preview */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0E0E17] border border-white/10 rounded-2xl p-4.5">
              <div className="bg-[#141422] p-3 rounded-xl">
                <span className="text-gray-400 text-xs block">معدل الحل الآلي</span>
                <span className="text-2xl font-black text-emerald-400">98.6%</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">بدون تدخل بشري</span>
              </div>
              <div className="bg-[#141422] p-3 rounded-xl">
                <span className="text-gray-400 text-xs block">ساعات عمل موفرة</span>
                <span className="text-2xl font-black text-white">+180 ساعة</span>
                <span className="text-[10px] text-[#C499FF] block mt-0.5">شهرياً للمتجر الواحد</span>
              </div>
              <div className="bg-[#141422] p-3 rounded-xl">
                <span className="text-gray-400 text-xs block">معدل تقييم العملاء</span>
                <span className="text-2xl font-black text-amber-400">4.9 / 5.0</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">من 12,400 محادثة</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
