"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Palette,
  TrendingUp,
  Globe,
  Cpu,
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface HeroProps {
  locale: "en" | "ar";
  dictionary: {
    headline: string[];
    sub: string;
    cta: string;
    scrollLabel: string;
  };
  onOpenConsultation?: () => void;
}

export default function Hero({ locale, dictionary, onOpenConsultation }: HeroProps) {
  const isRtl = locale === "ar";
  const prefersReducedMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headlineVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.18 + 0.2,
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      },
    }),
  };

  const disciplines = [
    {
      id: 1,
      nameEn: "Strategy & Solutions",
      nameAr: "الاستراتيجية وحلول الأعمال",
      tagEn: "Clarity & Direction",
      tagAr: "الوضوح والتوجه",
      color: "#0454FF",
      icon: Compass,
      positionClass: "top-4 left-4",
    },
    {
      id: 2,
      nameEn: "Branding & Creative",
      nameAr: "العلامة التجارية والإبداع",
      tagEn: "Identity & Story",
      tagAr: "الهوية والقصة",
      color: "#3B82F6",
      icon: Palette,
      positionClass: "top-4 right-4",
    },
    {
      id: 3,
      nameEn: "Marketing & Growth",
      nameAr: "التسويق والنمو",
      tagEn: "Audience & Performance",
      tagAr: "الجمهور والأداء",
      color: "#60A5FA",
      icon: TrendingUp,
      positionClass: "bottom-14 left-4",
    },
    {
      id: 4,
      nameEn: "Digital Experiences",
      nameAr: "التجارب الرقمية",
      tagEn: "Websites & Platforms",
      tagAr: "المواقع والمنصات",
      color: "#2563EB",
      icon: Globe,
      positionClass: "bottom-14 right-4",
    },
  ];

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white flex items-center pt-28 pb-16">
      {/* Ambient background glow & fine grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left / Primary Column: Positioning Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start">
            
            {/* Strategic Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0454FF] text-xs font-semibold tracking-wide uppercase mb-6 self-start shadow-xs"
            >
              <Sparkles size={13} className="text-[#0454FF]" />
              <span>
                {isRtl
                  ? "شريك نمو الأعمال والحلول المتكاملة"
                  : "Business Growth & Solutions Partner"}
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] mb-6">
              {dictionary.headline.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={headlineVariants}
                  initial="hidden"
                  animate="visible"
                  className={`inline-block mr-3 sm:mr-4 ${
                    i === dictionary.headline.length - 1
                      ? "text-[#0454FF]"
                      : "text-slate-950"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed font-normal"
            >
              {dictionary.sub}
            </motion.p>

            {/* CTAs Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="flex flex-wrap items-center gap-4"
            >
              {onOpenConsultation ? (
                <button
                  onClick={onOpenConsultation}
                  className="group inline-flex items-center gap-2.5 bg-[#0454FF] hover:bg-[#003ECC] text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{dictionary.cta}</span>
                  <ArrowRight
                    size={16}
                    className={`transition-transform group-hover:translate-x-1 ${
                      isRtl ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={`/${locale}/contact`}
                  className="group inline-flex items-center gap-2.5 bg-[#0454FF] hover:bg-[#003ECC] text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-blue-500/25 hover:-translate-y-0.5"
                >
                  <span>{dictionary.cta}</span>
                  <ArrowRight
                    size={16}
                    className={`transition-transform group-hover:translate-x-1 ${
                      isRtl ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""
                    }`}
                  />
                </Link>
              )}

              <Link
                href={`/${locale}/solutions`}
                className="inline-flex items-center gap-2 text-slate-700 hover:text-[#0454FF] bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-2xs"
              >
                <span>{isRtl ? "استكشف الحلول" : "Explore Capabilities"}</span>
              </Link>
            </motion.div>

            {/* 5 Disciplines Micro Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-mono font-medium"
            >
              <span className="text-slate-900 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
                {isRtl ? "استراتيجية" : "Strategy"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-900 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
                {isRtl ? "علامة تجارية" : "Branding"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-900 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
                {isRtl ? "تسويق" : "Marketing"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-900 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
                {isRtl ? "تجارب رقمية" : "Digital"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-900 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0454FF]" />
                {isRtl ? "تكنولوجيا" : "Technology"}
              </span>
            </motion.div>

          </div>

          {/* Right Column: "Everything Connects" Living Ecosystem Hub */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full max-w-[480px] aspect-square rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden text-white group"
            >
              {/* Subtle background radial glow in card */}
              <div className="absolute inset-0 bg-radial from-blue-600/15 via-transparent to-transparent pointer-events-none" />
              
              {/* Animated orbital ring */}
              <div className="absolute inset-8 rounded-full border border-blue-500/20 animate-slow-spin pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-dashed border-blue-400/15 pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300">
                    {isRtl ? "منظومة النمو المتصلة" : "Connected Ecosystem"}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#60A5FA] bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/60">
                  {isRtl ? "كل شيء متصل" : "Everything Connects"}
                </span>
              </div>

              {/* Central Core + Orbiting Satellites */}
              <div className="relative z-10 my-auto h-[260px] flex items-center justify-center">
                
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <line x1="20" y1="20" x2="50" y2="50" stroke="#0454FF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                  <line x1="80" y1="20" x2="50" y2="50" stroke="#0454FF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                  <line x1="20" y1="80" x2="50" y2="50" stroke="#0454FF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                  <line x1="80" y1="80" x2="50" y2="50" stroke="#0454FF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                </svg>

                {/* Central ECOMATE Core Hub */}
                <div className="relative z-20 flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0454FF] to-[#003ECC] p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                    <div className="w-full h-full rounded-[14px] bg-slate-950/90 flex flex-col items-center justify-center p-2 text-center">
                      <Layers className="w-6 h-6 text-[#60A5FA] mb-1 animate-pulse" />
                      <span className="text-[10px] font-black tracking-wider text-white">ECOMATE</span>
                      <span className="text-[8px] font-mono text-blue-300 uppercase">HUB</span>
                    </div>
                  </div>
                </div>

                {/* Satellite Discipline Nodes */}
                {disciplines.map((item) => {
                  const Icon = item.icon;
                  const isHovered = activeNode === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveNode(item.id)}
                      onMouseLeave={() => setActiveNode(null)}
                      className={`absolute ${item.positionClass} z-20 cursor-pointer transition-all duration-300`}
                    >
                      <div
                        className={`p-2.5 rounded-xl border flex items-center gap-2 shadow-md transition-all ${
                          isHovered
                            ? "bg-blue-900/90 border-[#60A5FA] scale-105"
                            : "bg-slate-900/90 border-slate-700/80 hover:border-blue-500/60"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-950 text-[#60A5FA] flex items-center justify-center">
                          <Icon size={14} />
                        </div>
                        <div className="flex flex-col text-start">
                          <span className="text-[11px] font-bold text-white whitespace-nowrap">
                            {isRtl ? item.nameAr : item.nameEn}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
                            {isRtl ? item.tagAr : item.tagEn}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 5th Discipline (Technology Bottom Center) */}
                <div
                  onMouseEnter={() => setActiveNode(5)}
                  onMouseLeave={() => setActiveNode(null)}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 cursor-pointer transition-all duration-300"
                >
                  <div
                    className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 shadow-md transition-all ${
                      activeNode === 5
                        ? "bg-blue-900/90 border-[#60A5FA] scale-105"
                        : "bg-slate-900/90 border-slate-700/80 hover:border-blue-500/60"
                    }`}
                  >
                    <Cpu size={12} className="text-[#60A5FA]" />
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">
                      {isRtl ? "التكنولوجيا والبرمجيات" : "Technology & Software"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Card Footer Live Readout */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Activity size={12} className="text-[#60A5FA]" />
                  <span>
                    {activeNode
                      ? isRtl
                        ? "تكامل نشط وفوري"
                        : "Active Discipline Synergy"
                      : isRtl
                      ? "تكامل تام عبر ٥ ركائز"
                      : "05 Integrated Disciplines"}
                  </span>
                </span>
                <span className="text-[#60A5FA] font-bold">
                  {isRtl ? "بدون جزر منعزلة" : "Zero Silos"}
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-slate-400"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {dictionary.scrollLabel}
        </span>
        <ChevronDown size={14} className="animate-bounce text-slate-400" />
      </motion.div>
    </section>
  );
}
