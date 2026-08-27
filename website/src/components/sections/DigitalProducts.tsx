"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bot, Sparkles, ArrowLeft, CheckCircle2, ShoppingCart, MessageSquare, Clock, Zap, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function DigitalProducts() {
  return (
    <section id="products" className="py-28 bg-[#F8FAFC] border-y border-slate-200 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#3B4FE8]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
          >
            <Sparkles size={14} />
            <span>منتجاتنا الرقمية</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-5"
          >
            حلول تقنية تبدأ من المشكلة{" "}
            <span className="ecomate-gradient-text">
              وتنتهي بنتيجة
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium"
          >
            نحن لا نبني منتجات لمجرد إضافة أداة جديدة إلى عملك. نحن نبني حلولًا تعالج مشكلة واضحة وتحقق نتيجة يمكن قياسها بالأرقام.
          </motion.p>
        </div>

        {/* Featured Product: ECOMATE AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#3B4FE8]/40 shadow-2xl shadow-blue-900/10 relative overflow-hidden"
        >
          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-slate-200 shadow-sm relative shrink-0">
                <Image src="/logo.png" alt="ECOMATE" fill className="object-contain p-1" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#3B4FE8] tracking-wider uppercase block">
                  المنتج الرقمي الأول • متوفر الآن 🚀
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  ECOMATE AI Assistant
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>تجربة مجانية 30 يوم</span>
              </span>
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Right text description */}
            <div className="lg:col-span-7 space-y-5">
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                مساعد ذكي متكامل لمتاجر سلة وزد والتجارة الإلكترونية
              </h4>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                يساعد متجرك على أتمتة خدمة العملاء، الرد على الاستفسارات 24/7 بلهجة خليجية طبيعية، متابعة فرص البيع والسلات المتروكة، وتنظيم بيانات العملاء في مكان واحد.
              </p>

              <p className="text-slate-700 text-xs sm:text-sm font-semibold">
                مصمم خصيصاً لمتاجر التجارة الإلكترونية التي تريد خدمة عملاء أسرع وعمليات أكثر كفاءة بدون الحاجة لتكبير فريق العمل.
              </p>

              {/* 4 Feature Bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <Clock size={16} className="text-[#3B4FE8] shrink-0" />
                  <span>خدمة عملاء ورد فوري 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <ShoppingCart size={16} className="text-emerald-600 shrink-0" />
                  <span>استرجاع السلات المتروكة تلقائياً</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <Zap size={16} className="text-amber-500 shrink-0" />
                  <span>ربط رسمي مع سلة، زد، وشركات الشحن</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                  <span>إدارة العملاء وسجل المشتريات (CRM)</span>
                </div>
              </div>

              {/* CTA Button to the Assistant Landing Page */}
              <div className="pt-5 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/assistant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#3B4FE8]/25 hover:shadow-xl hover:scale-105 transition-all"
                >
                  <span>اكتشف ECOMATE AI Assistant</span>
                  <ArrowLeft size={18} />
                </Link>

                <span className="text-xs text-slate-500 font-medium">
                  شاهد المحاكي التفاعلي، الأسعار، وحاسبة التوفير ←
                </span>
              </div>
            </div>

            {/* Left Visual Interactive Teaser */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#1A1B3C] rounded-2xl p-6 text-white text-xs space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-bold text-white">معاينة استجابة المساعد</span>
                </div>
                <span className="text-[10px] text-blue-200 bg-white/10 px-2 py-0.5 rounded">
                  واتساب & ويب
                </span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-slate-200">
                <span className="text-yellow-300 font-bold block mb-1">العميل:</span>
                "مرحباً، طلبي في السلة بس حاب أتأكد هل في توصيل سريع للرياض؟"
              </div>

              <div className="bg-[#3B4FE8]/40 p-3 rounded-xl border border-[#5B6EFF]/40 text-white">
                <span className="text-emerald-300 font-bold block mb-1">ECOMATE Assistant:</span>
                "أهلاً بك! نوفر توصيل سريع للرياض خلال 24 ساعة عبر سمسا، وكود خصم إضافي (SAVE10) جاهز في سلتك لإتمام الطلب فوراً 🎁"
              </div>

              <div className="pt-2 text-center text-[11px] text-blue-200 font-medium">
                جرّب المحاكي الحي الكامل في صفحة المنتج 👆
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
