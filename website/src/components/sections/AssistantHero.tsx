"use client";

import { motion } from "framer-motion";
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
  CheckCheck,
  Clock,
  ShoppingCart,
  Users,
  Send,
  Bot,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getAppUrl, getApiUrl } from "@/lib/config";

// Interactive WhatsApp scenarios for stores
const scenarios = [
  {
    id: "cart",
    title: "🛒 استرجاع سلة متروكة",
    icon: ShoppingCart,
    customerMsg: "كنت ناوي أطلب بس ترددت بخصوص التوصيل للدمام",
    aiReply: "أهلاً بك! طلبك في السلة جاهز ونوفر توصيل سريع للدمام خلال 24-48 ساعة. وخصم خاص 10% لك إذا أتممت الطلب الآن بكود (SAVE10) 🎁",
    extraData: {
      type: "cart-recovery",
      cartValue: "340 ر.س",
      discount: "كود خصم: SAVE10 (10%-)",
      status: "تم استرجاع السلة وتأكيد الطلب بنجاح ✓",
    },
  },
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

interface ChatMessage {
  id: string;
  sender: "customer" | "ai";
  text: string;
  time: string;
  extra?: any;
}

export default function AssistantHero() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "customer",
      text: scenarios[0].customerMsg,
      time: "11:42 ص",
    },
    {
      id: "2",
      sender: "ai",
      text: scenarios[0].aiReply,
      time: "11:42 ص",
      extra: scenarios[0].extraData,
    },
  ]);

  const [visitorId, setVisitorId] = useState<string>('');
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    let vid = localStorage.getItem('ecomate_sim_visitor');
    if (!vid) {
      vid = 'sim_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('ecomate_sim_visitor', vid);
    }
    setVisitorId(vid);
  }, []);

  const getOrCreateSession = async (vid: string): Promise<number | null> => {
    if (conversationId) return conversationId;
    try {
      const res = await fetch(getApiUrl('/api/widget/session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: 1,
          visitorId: vid || 'sim_visitor',
          name: 'زائر محاكي الموقع',
        }),
      });
      const data = await res.json();
      if (data.success && data.conversationId) {
        setConversationId(data.conversationId);
        return data.conversationId;
      }
    } catch (e) {
      console.warn('[Simulator] session init error:', e);
    }
    return null;
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMsgIdRef = useRef<number>(0);

  // Poll for live agent replies from dashboard
  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(getApiUrl(`/api/widget/messages/${conversationId}?afterId=${lastMsgIdRef.current}`));
        const data = await res.json();
        if (data.success && data.messages && data.messages.length > 0) {
          data.messages.forEach((m: any) => {
            if (m.id > lastMsgIdRef.current) {
              lastMsgIdRef.current = m.id;
              if (m.senderType === 'agent') {
                const now = new Date(m.createdAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
                setMessages((prev) => [
                  ...prev,
                  {
                    id: String(m.id),
                    sender: "ai",
                    text: m.content,
                    time: now,
                  },
                ]);
              }
            }
          });
        }
      } catch {
        // silent
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleScenarioChange = (scenario: typeof scenarios[0]) => {
    if (scenario.id === activeScenario.id) return;
    setActiveScenario(scenario);
    setIsTyping(true);

    const now = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "customer",
        text: scenario.customerMsg,
        time: now,
      },
    ]);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: scenario.aiReply,
          time: now,
          extra: scenario.extraData,
        },
      ]);
    }, 600);
  };

  // Live Chat handler: connects to backend API or intelligent fallback
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = customInput.trim();
    if (!text || isTyping) return;

    const now = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "customer",
        text: text,
        time: now,
      },
    ]);

    setCustomInput("");
    setIsTyping(true);

    try {
      const activeConvId = await getOrCreateSession(visitorId);
      if (activeConvId) {
        const res = await fetch(getApiUrl("/api/widget/messages"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: activeConvId,
            content: text,
            visitorName: "زائر الموقع",
          }),
        });

        if (res && res.ok) {
          const data = await res.json();
          if (data.success && data.aiMessage?.content) {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                sender: "ai",
                text: data.aiMessage.content,
                time: now,
              },
            ]);
            return;
          }
        }
      }
    } catch {
      // Fallback
    }

    // 2. Intelligent local AI simulation when offline
    setTimeout(() => {
      setIsTyping(false);
      let reply = "أهلاً بك! يسرني مساعدتك. استفسارك بخصوص المنتجات والشحن مسجل وسأوافيك بالتفاصيل فوراً.";
      
      const lower = text.toLowerCase();
      if (lower.includes("شحن") || lower.includes("توصيل") || lower.includes("متى")) {
        reply = "نوفر شحن سريع لجميع مناطق المملكة عبر سمسا وأرامكس خلال 24-48 ساعة، مع إمكانية التتبع المباشر للشحنة.";
      } else if (lower.includes("تابي") || lower.includes("تمارا") || lower.includes("تقسيط") || lower.includes("دفع")) {
        reply = "نعم بكل تأكيد! نوفر الدفع عبر تابي وتمارا مقسمة على 4 دفعات بدون أي فوائد، بالإضافة إلى مدى و Apple Pay.";
      } else if (lower.includes("خصم") || lower.includes("كود") || lower.includes("سعر")) {
        reply = "يسعدنا خدمتك! يمكنك استخدام كود الخصم (WELCOME10) للحصول على خصم 10% عند إتمام طلبك اليوم.";
      } else if (lower.includes("استرجاع") || lower.includes("استبدال") || lower.includes("ارجاع")) {
        reply = "سياستنا تتيح الاستبدال والاسترجاع مجاناً خلال 7 أيام من استلام الطلب مع خدمة الاستلام من الباب.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: reply,
          time: now,
        },
      ]);
    }, 700);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-20 hero-ecomate-bg">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-light opacity-75 pointer-events-none" />

      {/* Ambient Cobalt Blue Lighting Orbs */}
      <div className="absolute top-1/6 right-1/4 w-[550px] h-[550px] bg-[#3B4FE8]/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#5B6EFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column: 7 Cols */}
          <div className="lg:col-span-7 text-center lg:text-right">
            
            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 bg-white border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-2 rounded-full text-xs font-bold mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B6EFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B4FE8]"></span>
              </span>
              <span>ابدأ تجربتك المجانية لمدة 30 يوم</span>
              <Sparkles size={14} className="text-[#3B4FE8]" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-950 leading-[1.2] mb-6 tracking-tight"
            >
              خل متجرك يبيع ويرد ويتابع عملاءه{" "}
              <span className="ecomate-gradient-text">
                تلقائيًا
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mr-0 font-medium"
            >
              <strong className="text-slate-950 font-bold">ECOMATE</strong> يساعدك ترد على عملائك 24/7، تسترجع السلات المتروكة، وتنظم بيانات عملائك في مكان واحد — بدون ما تكبّر فريق خدمة العملاء.
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 shadow-md shadow-[#3B4FE8]/25 hover:shadow-lg hover:shadow-[#3B4FE8]/35 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>ابدأ تجربتك المجانية</span>
                <ArrowLeft size={18} />
              </a>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 px-7 py-4 rounded-xl text-base font-bold transition-all shadow-sm"
              >
                <span>شوف كيف يعمل ECOMATE</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 mt-8 text-xs text-slate-500 font-bold"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>بدون التزام</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>إعداد وربط مجاني</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={15} className="text-emerald-600" />
                <span>مصمم لمتاجر سلة وزد</span>
              </div>
            </motion.div>

            {/* Supporting Metrics (3 Cards) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-10 pt-6 border-t border-slate-200 text-right"
            >
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-[#3B4FE8]/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B4FE8] flex items-center justify-center mb-2">
                  <Clock size={18} />
                </div>
                <p className="text-xl sm:text-2xl font-black text-slate-950 font-sans">
                  24/7
                </p>
                <p className="text-slate-500 text-xs mt-1 font-semibold">خدمة عملاء تلقائية</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-[#3B4FE8]/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <ShoppingCart size={18} />
                </div>
                <p className="text-lg sm:text-xl font-black text-[#3B4FE8]">
                  استرجاع السلات
                </p>
                <p className="text-slate-500 text-xs mt-1 font-semibold">متابعة تلقائية للعملاء</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-[#3B4FE8]/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                  <Users size={18} />
                </div>
                <p className="text-lg sm:text-xl font-black text-slate-950">
                  قاعدة عملاء واحدة
                </p>
                <p className="text-slate-500 text-xs mt-1 font-semibold">بياناتك منظمة وجاهزة لإعادة التسويق</p>
              </div>
            </motion.div>
          </div>

          {/* Left Column (Interactive Smartphone Simulator): 5 Cols */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Interactive Scenario Buttons */}
            <div className="w-full max-w-sm mb-3">
              <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
                <span>جرّب شات ECOMATE الحي:</span>
                <span className="text-[#3B4FE8] text-[11px] font-extrabold">اختر سيناريو أو اكتب استفسارك 👇</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {scenarios.map((sc) => {
                  const isCurrent = sc.id === activeScenario.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleScenarioChange(sc)}
                      className={`text-xs py-2 px-2.5 rounded-xl font-bold transition-all text-right flex items-center gap-1.5 border ${
                        isCurrent
                          ? "bg-blue-50 border-[#3B4FE8]/40 text-[#3B4FE8] shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <sc.icon size={13} className={isCurrent ? "text-[#3B4FE8]" : "text-slate-400"} />
                      <span className="truncate">{sc.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smartphone Device Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[2.5rem] bg-slate-900 border-4 border-slate-800 shadow-2xl shadow-blue-900/15 p-2.5">
              
              {/* Dynamic Island */}
              <div className="w-28 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
              </div>

              {/* WhatsApp Header */}
              <div className="bg-[#075E54] rounded-t-2xl px-3.5 py-2.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm overflow-hidden relative">
                    <Image src="/logo.png" alt="Ecomate" fill className="object-contain p-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white text-xs font-bold">ECOMATE</span>
                      <CheckCircle2 size={12} className="text-emerald-300" />
                    </div>
                    <span className="text-[10px] text-emerald-200 flex items-center gap-1 font-medium">
                      متصل الآن • رد فوري بالـ AI
                    </span>
                  </div>
                </div>
                <div className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/30">
                  سلة & زد 🛒
                </div>
              </div>

              {/* Chat Window */}
              <div 
                ref={chatContainerRef}
                className="bg-[#ECE5DD] p-3.5 min-h-[300px] max-h-[340px] overflow-y-auto space-y-3 text-xs flex flex-col"
              >
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-start" : "justify-end"}`}>
                    <div className={`${
                      m.sender === "customer" 
                        ? "bg-white text-slate-800 rounded-2xl rounded-br-none border border-black/5" 
                        : "bg-[#E7FFDB] text-slate-900 rounded-2xl rounded-bl-none border border-emerald-200"
                    } px-3.5 py-2.5 max-w-[88%] shadow-sm`}>
                      <p className="leading-relaxed font-medium">{m.text}</p>
                      
                      {/* Scenario Extra Cards */}
                      {m.extra?.type === "cart-recovery" && (
                        <div className="mt-2 bg-white border border-emerald-300 rounded-xl p-2 text-[10.5px] space-y-1 shadow-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>قيمة السلة:</span>
                            <strong className="text-slate-900">{m.extra.cartValue}</strong>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>العرض:</span>
                            <span className="text-[#3B4FE8] font-bold">{m.extra.discount}</span>
                          </div>
                          <div className="text-emerald-700 font-bold text-[9.5px] pt-1 border-t border-slate-100">
                            {m.extra.status}
                          </div>
                        </div>
                      )}

                      {m.extra?.type === "order-card" && (
                        <div className="mt-2 bg-white border border-emerald-300 rounded-xl p-2 text-[10.5px] space-y-1 shadow-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>شركة الشحن:</span>
                            <strong className="text-slate-900">{m.extra.carrier}</strong>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>حالة الشحنة:</span>
                            <span className="text-emerald-700 font-bold">{m.extra.status}</span>
                          </div>
                        </div>
                      )}

                      {m.extra?.type === "payment-badges" && Array.isArray(m.extra.methods) && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {m.extra.methods.map((method: string) => (
                            <span key={method} className="bg-emerald-100 text-emerald-900 text-[9.5px] px-1.5 py-0.5 rounded font-bold">
                              {method}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[8.5px] text-slate-400 mt-1 font-medium">
                        <span>{m.sender === "ai" ? "ECOMATE AI" : "أنت"}</span>
                        <span className="flex items-center gap-0.5 text-blue-500 font-bold">
                          {m.time} <CheckCheck size={11} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-end">
                    <div className="bg-[#E7FFDB] text-slate-900 rounded-2xl rounded-bl-none px-3.5 py-2 shadow-sm border border-emerald-200">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#075E54] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#075E54] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#075E54] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive WhatsApp Typing Input Bar */}
              <form onSubmit={handleSendMessage} className="bg-[#F0F2F5] rounded-b-2xl p-2 flex items-center gap-1.5 border-t border-slate-200">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="جرّب كتابة أي سؤال..."
                  className="flex-1 bg-white rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:border-[#075E54] font-medium"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || isTyping}
                  className="w-8 h-8 rounded-xl bg-[#075E54] hover:bg-[#064E46] text-white flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
                  aria-label="إرسال"
                >
                  <Send size={13} className="rotate-180" />
                </button>
              </form>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
