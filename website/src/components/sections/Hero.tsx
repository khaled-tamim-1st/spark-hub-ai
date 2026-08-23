"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppUrl } from "@/lib/config";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      +{count.toLocaleString("ar-SA")}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 500, suffix: "", label: "متجر نشط" },
  { value: 98, suffix: "%", label: "رضا العملاء", isPercent: true },
  { value: 3, suffix: " ثوانٍ", label: "متوسط وقت الرد", isLessThan: true },
];

const badges = [
  "✅ لا يلزم بطاقة ائتمانية",
  "✅ إعداد في أقل من 15 دقيقة",
  "✅ دعم فني بالعربية",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-50" />

      {/* Blur blobs */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#6B00FF]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-[#9B59FF]/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-right">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#6B00FF]/15 border border-[#6B00FF]/30 text-[#9B59FF] px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span>🤖</span>
              <span>مدعوم بالذكاء الاصطناعي GPT</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              ردّ على عملاء متجرك{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#6B00FF] to-[#9B59FF]">
                تلقائياً
              </span>
              {" "}— في ثوانٍ
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mr-0"
            >
              سند هو مساعدك الذكي على واتساب وسلة. يرد على استفسارات العملاء،
              يتتبع الطلبات، ويبيع — كل ذلك بشكل تلقائي وبدون تدخل يدوي.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end"
            >
              <a
                href={getAppUrl("/register")}
                className="group inline-flex items-center justify-center gap-2 bg-[#6B00FF] hover:bg-[#5800D9] text-white px-7 py-4 rounded-xl text-base font-bold transition-all hover:shadow-xl hover:shadow-[#6B00FF]/40 hover:scale-105 active:scale-95"
              >
                ابدأ مجاناً الآن
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-7 py-4 rounded-xl text-base font-medium transition-all hover:bg-white/5"
              >
                <Play size={16} />
                شاهد كيف يعمل
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-end gap-4 mt-6"
            >
              {badges.map((b) => (
                <span key={b} className="text-white/40 text-xs">
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* WhatsApp Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-72 sm:w-80">
              {/* Phone frame */}
              <div className="bg-[#12121A] rounded-[2rem] border border-[#6B00FF]/20 shadow-2xl shadow-[#6B00FF]/20 overflow-hidden">
                {/* WhatsApp header */}
                <div className="bg-[#1B1B26] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B00FF] to-[#9B59FF] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    س
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">سند AI</p>
                    <p className="text-green-400 text-xs">متاح الآن • يرد خلال ثوانٍ</p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-4 space-y-3 bg-[#0E0E18] min-h-[320px]">
                  {/* Customer message */}
                  <div className="flex justify-start">
                    <div className="bg-[#1B1B26] text-white/80 text-sm px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                      وين طلبي رقم #12345؟ 😅
                    </div>
                  </div>

                  {/* AI reply */}
                  <div className="flex justify-end">
                    <div className="bg-[#6B00FF] text-white text-sm px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%]">
                      أهلاً! طلبك رقم #12345 حالياً في الطريق مع SMSA ورقم التتبع هو: <span className="font-mono bg-white/20 px-1 rounded">SA1234567</span> 📦
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex justify-start">
                    <div className="bg-[#1B1B26] text-white/80 text-sm px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                      متى يوصل تقريباً؟
                    </div>
                  </div>

                  {/* AI reply */}
                  <div className="flex justify-end">
                    <div className="bg-[#6B00FF] text-white text-sm px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%]">
                      متوقع وصوله خلال 1-2 يوم عمل، غداً أو بعده إن شاء الله 🚀
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex justify-start">
                    <div className="bg-[#1B1B26] text-white/80 text-sm px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                      شكراً جزيلاً! 🙏
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex justify-end">
                    <div className="bg-[#6B00FF]/60 text-white text-xs px-4 py-2 rounded-full animate-pulse">
                      سند يكتب...
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} />
                رد تلقائي
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#6B00FF] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#6B00FF]/30">
                ⚡ أقل من 3 ثوانٍ
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mt-16 border-t border-white/10 pt-10"
        >
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-white">
              <AnimatedCounter target={500} />
            </p>
            <p className="text-white/50 text-sm mt-1">متجر نشط</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-3xl sm:text-4xl font-bold text-white">
              +{98}%
            </p>
            <p className="text-white/50 text-sm mt-1">رضا العملاء</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-white">
              &lt;3 ثوانٍ
            </p>
            <p className="text-white/50 text-sm mt-1">متوسط وقت الرد</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
