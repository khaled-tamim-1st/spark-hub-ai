"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  ShoppingCart,
  Users,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white relative overflow-hidden">
      {/* Ambient cobalt blue glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#3B4FE8]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#5B6EFF]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles size={14} />
            <span>مساعد متجرك الذكي المتكامل</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            من الرد على العميل إلى إتمام الطلب… <span className="ecomate-gradient-text">ECOMATE معك</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            مو مجرد شات بوت. <strong className="text-slate-950 font-bold">ECOMATE هو مساعد متجرك الذكي</strong> الذي يتعامل مع العملاء، يتابع الفرص الضائعة، وينظم بيانات العملاء لمساعدتك على تنمية مبيعاتك.
          </motion.p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CARD 1: 💬 رد يفهم عميلك */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 rounded-3xl p-8 border border-slate-200 hover:border-[#3B4FE8]/40 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-blue-900/5 hover:shadow-xl"
          >
            <div className="relative z-10 mb-6">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#3B4FE8] to-[#5B6EFF] flex items-center justify-center text-white mb-5 shadow-md shadow-[#3B4FE8]/25">
                <MessageSquare size={26} />
              </div>
              <span className="text-xs font-bold text-[#3B4FE8] bg-blue-50 border border-[#3B4FE8]/20 px-3 py-1 rounded-full inline-block mb-3">
                لهجة طبيعية وسرعة فائقة
              </span>
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                💬 رد يفهم عميلك
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                ذكاء اصطناعي يفهم العربية واللهجة الخليجية ويتعامل مع استفسارات العملاء بشكل طبيعي وبدون قيود أو ردود آلية جامدة.
              </p>
            </div>

            {/* Visual Chat Preview */}
            <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs shadow-sm">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">العميل:</span>
                "عندكم فستان كحلي مقاس لارج ومتى يوصلني جدة؟"
              </div>
              <div className="bg-[#EEF0FF] p-2.5 rounded-xl border border-[#3B4FE8]/20 text-slate-900">
                <span className="font-bold text-[#3B4FE8] block mb-0.5">ECOMATE:</span>
                "نعم متوفر مقاس (L)! والتوصيل لجدة يستغرق 24-48 ساعة عبر سمسا. تحب أجهّز لك رابط الطلب مباشرة؟ 🛍️"
              </div>
            </div>
          </motion.div>

          {/* CARD 2: 🛒 لا تترك السلة بدون متابعة */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white via-slate-50/60 to-emerald-50/30 rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-emerald-900/5 hover:shadow-xl"
          >
            <div className="relative z-10 mb-6">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white mb-5 shadow-md shadow-emerald-500/25">
                <ShoppingCart size={26} />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
                استرجاع المبيعات المتروكة
              </span>
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                🛒 لا تترك السلة بدون متابعة
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                استرجع فرص البيع الضائعة من خلال متابعة تلقائية وذكية للعملاء الذين لم يكملوا طلباتهم مع عروض مخصصة تزيد نسبة الإتمام.
              </p>
            </div>

            {/* Visual Cart Recovery Metric */}
            <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">متابعة السلات التلقائية</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                  +34% استرجاع ناجح
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500 text-[11px] block font-medium">سلات تم استرجاعها</span>
                  <strong className="text-emerald-600 font-black text-base">+128 طلب</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500 text-[11px] block font-medium">مبيعات إضافية</span>
                  <strong className="text-[#3B4FE8] font-black text-base">+43,500 ر.س</strong>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: 👥 اعرف عملاءك أكثر */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white via-slate-50/60 to-indigo-50/30 rounded-3xl p-8 border border-slate-200 hover:border-indigo-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-indigo-900/5 hover:shadow-xl"
          >
            <div className="relative z-10 mb-6">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white mb-5 shadow-md shadow-indigo-500/25">
                <Users size={26} />
              </div>
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full inline-block mb-3">
                CRM موحد وقاعدة بيانات شاملة
              </span>
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                👥 اعرف عملاءك أكثر
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                كل بيانات العملاء وتاريخ مشترياتهم وتفضيلاتهم في مكان واحد، جاهزة للمتابعة الشخصية وإعادة التسويق في المواسم والعروض.
              </p>
            </div>

            {/* Visual Customer Profile */}
            <div className="relative z-10 bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#3B4FE8] font-bold flex items-center justify-center text-xs">
                    س
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">سارة المنصور</span>
                    <span className="text-[10px] text-slate-400">عميل مميز (VIP)</span>
                  </div>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  4 طلبات سابقة
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 flex justify-between">
                <span>إجمالي المشتريات: <strong>1,820 ر.س</strong></span>
                <span className="text-[#3B4FE8] font-semibold">آخر طلب: أمس</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 4: 📊 اعرف أثر ECOMATE */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white via-slate-50/60 to-amber-50/30 rounded-3xl p-8 border border-slate-200 hover:border-amber-300 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg shadow-amber-900/5 hover:shadow-xl"
          >
            <div className="relative z-10 mb-6">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white mb-5 shadow-md shadow-amber-500/25">
                <BarChart3 size={26} />
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-3">
                لوحة قياس أداء ذكية
              </span>
              <h3 className="text-2xl font-black text-slate-950 mb-3">
                📊 اعرف أثر ECOMATE
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                تابع أداء المتجر والنتائج التي يحققها النظام بدقة بالأرقام والرسوم البيانية بدل ما تعتمد على التخمين أو التقديرات اليدوية.
              </p>
            </div>

            {/* Visual Stats Row */}
            <div className="relative z-10 grid grid-cols-3 gap-2 text-center text-xs bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-semibold">معدل الحل</span>
                <span className="text-emerald-600 font-black text-sm">99.1%</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-semibold">زمن الرد</span>
                <span className="text-[#3B4FE8] font-black text-sm">&lt;1s</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 text-[10px] block font-semibold">رضا العملاء</span>
                <span className="text-amber-600 font-black text-sm">4.9/5</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
