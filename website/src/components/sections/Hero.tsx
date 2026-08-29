"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Cpu,
  TrendingUp,
  Workflow,
  MessageSquare,
  Building2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-32 pb-24 hero-ecomate-bg">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-light opacity-75 pointer-events-none" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/6 right-1/4 w-[550px] h-[550px] bg-[#3B4FE8]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#5B6EFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Right Column (Text): 7 Cols */}
          <div className="lg:col-span-7 text-center lg:text-right">
            
            {/* Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 bg-white border border-[#3B4FE8]/20 text-[#3B4FE8] px-4.5 py-2 rounded-full text-xs font-bold mb-6 shadow-sm"
            >
              <Sparkles size={14} className="text-[#3B4FE8]" />
              <span>ECOMATE • Business Solutions & Digital Products</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.6rem] font-black text-slate-950 leading-[1.2] mb-6 tracking-tight"
            >
              نبني حلولًا تخلي أعمالك{" "}
              <span className="ecomate-gradient-text">
                تشتغل بشكل أذكى
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl mx-auto lg:mr-0 font-medium"
            >
              في <strong className="text-slate-950 font-bold">ECOMATE</strong> نساعد الشركات والمتاجر الإلكترونية على تبسيط عملياتها، أتمتة المهام المتكررة، وتحسين تجربة عملائها من خلال حلول رقمية عملية مدعومة بالذكاء الاصطناعي.
            </motion.p>

            {/* Value Proposition Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="inline-block bg-blue-50/80 border border-[#3B4FE8]/20 text-[#3B4FE8] text-sm sm:text-base font-bold px-4 py-2 rounded-xl mb-8"
            >
              من مشكلة في التشغيل إلى حل رقمي يساعدك تنمو.
            </motion.div>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start items-center"
            >
              <a
                href="#solutions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 shadow-md shadow-[#3B4FE8]/25 hover:shadow-lg hover:shadow-[#3B4FE8]/35 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>استكشف حلولنا</span>
                <ArrowLeft size={18} />
              </a>

              <a
                href="mailto:hello@ecomate.ai?subject=استشارة من موقع ECOMATE"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 px-7 py-4 rounded-xl text-base font-bold transition-all shadow-sm"
              >
                <MessageSquare size={17} className="text-[#3B4FE8]" />
                <span>تحدث مع فريق ECOMATE</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 mt-10 text-xs text-slate-500 font-bold"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>حلول عملية مصممة للنمو</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>ذكاء اصطناعي وأتمتة متقدمة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>خبرة عميقة بالسوق المحلي</span>
              </div>
            </motion.div>

          </div>

          {/* Left Column (Interactive Visual Showcase): 5 Cols */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Corporate Solutions Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl shadow-blue-900/10 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 shadow-xs relative">
                    <Image src="/logo.png?v=2" alt="ECOMATE" fill className="object-contain p-0.5" unoptimized />
                  </div>
                  <div>
                    <span className="font-black text-slate-900 text-sm block">منظومة ECOMATE</span>
                    <span className="text-[11px] text-slate-400 font-medium">Business Solutions Matrix</span>
                  </div>
                </div>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  نظام متكامل ✓
                </span>
              </div>

              {/* Matrix Pillars Showcase */}
              <div className="space-y-3 text-xs">
                
                {/* Item 1: Automation */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between hover:border-[#3B4FE8]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#3B4FE8] flex items-center justify-center">
                      <Workflow size={16} />
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">أتمتة العمليات والمهام</strong>
                      <span className="text-[11px] text-slate-500 font-medium">تقليل العمل اليدوي بنسبة تصل إلى 80%</span>
                    </div>
                  </div>
                  <span className="text-[#3B4FE8] font-bold text-[11px]">أتمتة</span>
                </div>

                {/* Item 2: Digital Product (AI Assistant) */}
                <div className="bg-[#EEF0FF] border border-[#3B4FE8]/30 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#3B4FE8] text-white flex items-center justify-center shadow-xs">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <strong className="text-slate-950 block font-black text-xs">ECOMATE AI Assistant</strong>
                      <span className="text-[11px] text-[#3B4FE8] font-semibold">مساعد ذكي 24/7 للمتاجر والشركات</span>
                    </div>
                  </div>
                  <span className="bg-[#3B4FE8] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    متاح الآن
                  </span>
                </div>

                {/* Item 3: Data & Intelligence */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between hover:border-[#3B4FE8]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-xs">البيانات وتحليلات النمو</strong>
                      <span className="text-[11px] text-slate-500 font-medium">قرارات دقيقة مبنية على الأرقام الحقيقية</span>
                    </div>
                  </div>
                  <span className="text-indigo-600 font-bold text-[11px]">ذكاء</span>
                </div>

              </div>

              {/* Bottom Summary Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>حلول مصممة للسوق السعودي</span>
                <span className="text-slate-900 font-bold">جاهزة للتطبيق السريع</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
