"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Package,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  CreditCard,
  Ruler,
  CheckCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAppUrl } from "@/lib/config";

// Simulation scenarios
const scenarios = [
  {
    id: "tracking",
    title: "📦 تتبع شحنة سمسا",
    icon: Truck,
    customerMsg: "مساء الخير، طلبي رقم #78942 وين وصل؟ 🚚",
    aiReply: "أهلاً بك! طلبك رقم #78942 تم شحنه عبر SMSA Express وهو الآن في مرحلة (جاري التوصيل للرياض).",
    extraData: {
      type: "order-card",
      orderId: "#78942",
      carrier: "SMSA Express",
      status: "جاري التوصيل للرياض",
      eta: "اليوم قبل 8 مساءً",
      trackingNumber: "SMSA982341",
    },
  },
  {
    id: "payment",
    title: "💳 تابي وتمارا",
    icon: CreditCard,
    customerMsg: "هل متوفر عندكم الدفع بالتقسيط تابي أو تمارا؟",
    aiReply: "نعم بكل تأكيد! متجرنا يوفر الدفع عبر (تابي) و(تمارا) بدون أي فوائد أو رسوم إضافية، مقسمة على 4 دفعات شهرية مريحة.",
    extraData: {
      type: "payment-badges",
      methods: ["تمارا - 4 دفعات", "تابي - بدون فوائد", "مدى و Apple Pay"],
    },
  },
  {
    id: "size",
    title: "👗 استفسار المقاسات",
    icon: Ruler,
    customerMsg: "وزني 65 وطولي 168، أي مقاس أنسب لي في الفستان؟",
    aiReply: "بناءً على جدول القياسات الدقيق للمنتج، مقاس (M - Medium) سيكون ملائماً ومريحاً جداً لكِ! يمكنكِ أيضاً الاستفادة من ميزة التبديل المجاني إذا رغبتِ في تعديل المقاس.",
    extraData: {
      type: "recommendation",
      recommendedSize: "مقاس M (Medium)",
      policy: "التبديل مجاني خلال 7 أيام",
    },
  },
  {
    id: "return",
    title: "🔄 استبدال واسترجاع",
    icon: RotateCcw,
    customerMsg: "كيف أعمل طلب استبدال لمنتج وصلني أمس؟",
    aiReply: "يسرنا خدمتك! يمكنك إنشاء طلب الاستبدال فوراً بالضغط على الرابط أدناه، ومندوب الشحن سيمر لاستلام الشحنة من باب بيتك خلال 48 ساعة مجاناً.",
    extraData: {
      type: "return-action",
      actionText: "طلب استبدال فوري بنقرة واحدة",
      sla: "استلام من الباب خلال 48 ساعة",
    },
  },
];

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

export default function Hero() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedReply, setDisplayedReply] = useState(scenarios[0].aiReply);

  const handleScenarioChange = (scenario: typeof scenarios[0]) => {
    if (scenario.id === activeScenario.id) return;
    setActiveScenario(scenario);
    setIsTyping(true);
    setDisplayedReply("");

    setTimeout(() => {
      setIsTyping(false);
      setDisplayedReply(scenario.aiReply);
    }, 600);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-20 bg-radial-gradient">
      {/* Subtle Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#6B00FF]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#9B59FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column (Text in RTL): 7 Cols */}
          <div className="lg:col-span-7 text-center lg:text-right">
            {/* Live Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 bg-[#141422] border border-[#6B00FF]/30 text-[#C499FF] px-4 py-2 rounded-full text-xs font-semibold mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>سند v2.0 • مساعد الذكاء الاصطناعي المتكامل لمتاجر سلة</span>
              <Sparkles size={14} className="text-[#9B59FF]" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-6 tracking-tight"
            >
              ردّ على عملاء متجرك{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#C499FF] via-[#9B59FF] to-[#6B00FF] underline decoration-[#6B00FF]/40">
                تلقائياً في ثوانٍ
              </span>
              {" "}وبلا توقف
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mr-0"
            >
              سند يتصل مباشرة بمتجرك على <strong className="text-white">سلة</strong> وشركات الشحن وواتساب. 
              يرد على الاستفسارات، يتتبع الطلبات، ويحول السلات المتروكة لمبيعات بدقة 100% وبدون أي هلوسة.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start items-center"
            >
              <a
                href={getAppUrl("/register")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#6B00FF] to-[#9B59FF] hover:from-[#5800D9] hover:to-[#8B33FF] text-white px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:shadow-xl hover:shadow-[#6B00FF]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>ابدأ تجربتك المجانية (14 يوم)</span>
                <ArrowLeft size={18} />
              </a>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#141422]/80 hover:bg-[#1A1A2E] text-gray-200 hover:text-white border border-white/10 hover:border-[#6B00FF]/30 px-7 py-4 rounded-xl text-base font-semibold transition-all backdrop-blur-md"
              >
                <span>استكشف المميزات</span>
              </a>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 mt-8 text-xs text-gray-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>ربط فوري بسلة (أقل من 5 دقائق)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>لا يلزم إدخال بطاقة ائتمانية</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={15} className="text-emerald-400" />
                <span>دعم فني سعودي على مدار الساعة</span>
              </div>
            </motion.div>

            {/* KPI Metrics Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 mt-12 pt-8 border-t border-white/10"
            >
              <div className="bg-[#141422]/60 border border-white/5 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  <AnimatedCounter target={500} />
                </p>
                <p className="text-gray-400 text-xs mt-1">متجر سلة نشط</p>
              </div>
              <div className="bg-[#141422]/60 border border-white/5 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  +99.2%
                </p>
                <p className="text-gray-400 text-xs mt-1">دقة الردود الفورية</p>
              </div>
              <div className="bg-[#141422]/60 border border-white/5 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-[#C499FF]">
                  &lt;1.2 ثانية
                </p>
                <p className="text-gray-400 text-xs mt-1">متوسط زمن الاستجابة</p>
              </div>
            </motion.div>
          </div>

          {/* Left Column (Interactive Smartphone Simulator in RTL): 5 Cols */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Interactive Scenario Buttons */}
            <div className="w-full max-w-sm mb-3">
              <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-between">
                <span>جرّب المحاكي المباشر بنفسك:</span>
                <span className="text-[#9B59FF] text-[11px]">اضغط لتغيير السؤال 👇</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {scenarios.map((sc) => {
                  const isCurrent = sc.id === activeScenario.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleScenarioChange(sc)}
                      className={`text-xs py-2 px-2.5 rounded-xl font-medium transition-all text-right flex items-center gap-1.5 border ${
                        isCurrent
                          ? "bg-[#6B00FF]/25 border-[#9B59FF] text-white shadow-md shadow-[#6B00FF]/20"
                          : "bg-[#141422]/70 border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <sc.icon size={13} className={isCurrent ? "text-[#C499FF]" : "text-gray-400"} />
                      <span className="truncate">{sc.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smartphone Device Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[2.5rem] bg-[#0E0E17] border-4 border-[#2A2A40] shadow-2xl shadow-[#6B00FF]/20 p-2.5">
              
              {/* Dynamic Island / Notch */}
              <div className="w-28 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A2E] mr-2"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
              </div>

              {/* WhatsApp Header */}
              <div className="bg-[#141422] rounded-t-2xl px-3.5 py-2.5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B00FF] to-[#9B59FF] flex items-center justify-center text-white font-bold text-sm shadow-md">
                    س
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-xs font-bold">سند AI للمتاجر</span>
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                      متصل الآن • رد فوري
                    </span>
                  </div>
                </div>
                <div className="bg-[#6B00FF]/20 text-[#C499FF] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#6B00FF]/30">
                  سلة 🛒
                </div>
              </div>

              {/* Chat Message Window */}
              <div className="bg-[#0B0B14] rounded-b-2xl p-3.5 min-h-[340px] max-h-[380px] overflow-y-auto space-y-3.5 text-xs flex flex-col justify-end">
                
                {/* Customer Message */}
                <div className="flex justify-start">
                  <div className="bg-[#1C1C2E] text-gray-100 rounded-2xl rounded-br-none px-3.5 py-2.5 max-w-[85%] border border-white/5 shadow-sm">
                    <p>{activeScenario.customerMsg}</p>
                    <span className="text-[9px] text-gray-400 block text-left mt-1">11:42 ص</span>
                  </div>
                </div>

                {/* AI Reply Stream */}
                <div className="flex justify-end">
                  <div className="bg-[#6B00FF] text-white rounded-2xl rounded-bl-none px-3.5 py-2.5 max-w-[90%] shadow-lg shadow-[#6B00FF]/25">
                    {isTyping ? (
                      <div className="flex items-center gap-1 py-1 px-2">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    ) : (
                      <>
                        <p className="leading-relaxed">{displayedReply}</p>
                        
                        {/* Extra Rich UI Cards */}
                        {activeScenario.extraData?.type === "order-card" && "carrier" in activeScenario.extraData && (
                          <div className="mt-2.5 bg-black/25 border border-white/10 rounded-xl p-2.5 text-[11px] space-y-1">
                            <div className="flex justify-between text-gray-300">
                              <span>شركة الشحن:</span>
                              <strong className="text-white">{activeScenario.extraData.carrier}</strong>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>حالة الشحنة:</span>
                              <span className="text-emerald-300 font-semibold">{activeScenario.extraData.status}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>الموعد المتوقع:</span>
                              <strong className="text-white">{activeScenario.extraData.eta}</strong>
                            </div>
                          </div>
                        )}

                        {activeScenario.extraData?.type === "payment-badges" && "methods" in activeScenario.extraData && Array.isArray(activeScenario.extraData.methods) && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {activeScenario.extraData.methods.map((m: string) => (
                              <span key={m} className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}

                        {activeScenario.extraData?.type === "recommendation" && "recommendedSize" in activeScenario.extraData && (
                          <div className="mt-2 bg-black/25 rounded-lg p-2 text-[10px] text-emerald-200 flex items-center gap-1">
                            <Package size={12} />
                            <span>{activeScenario.extraData.recommendedSize} • {activeScenario.extraData.policy}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[9px] text-white/70 mt-1.5">
                          <span>سند الذكي • مؤكد بسلة</span>
                          <span className="flex items-center gap-0.5 text-cyan-200">
                            11:42 ص <CheckCheck size={12} />
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Action Suggestion Bar */}
                <div className="pt-2 border-t border-white/5 flex gap-1.5">
                  <span className="text-[10px] bg-[#141422] border border-white/10 text-gray-300 px-2 py-1 rounded-full flex-1 text-center truncate">
                    👍 شكراً، واضحة
                  </span>
                  <span className="text-[10px] bg-[#141422] border border-white/10 text-gray-300 px-2 py-1 rounded-full flex-1 text-center truncate">
                    📞 تحويل لموظف بشري
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
