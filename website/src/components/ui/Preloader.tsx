"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PreloaderProps {
  locale?: string;
}

export default function Preloader({ locale = "en" }: PreloaderProps) {
  const isAr = locale === "ar";
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";
          }, 350);
          return 100;
        }
        // Accelerate smoothly towards 100
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 90);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white select-none overflow-hidden"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Subtle Ambient Background Motion */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Soft Radial Brand Glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#0454FF]/10 via-[#60A5FA]/8 to-transparent blur-3xl"
            />

            {/* Subtle Rotating Geometric Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[340px] h-[340px] rounded-full border border-blue-500/10 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute w-[440px] h-[440px] rounded-full border border-blue-600/5"
            />

            {/* Subtle Floating Ambient Connection Dots */}
            <motion.div
              animate={{
                y: [-6, 6, -6],
                x: [-4, 4, -4],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-[#0454FF]/20"
            />
            <motion.div
              animate={{
                y: [8, -8, 8],
                x: [5, -5, 5],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-[#60A5FA]/30"
            />
          </div>

          {/* Center Brand & Loading Content */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            
            {/* Logo Container with Subtle Glow & Pulse */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              {/* Pulsing ring behind logo */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute -inset-3 rounded-2xl bg-[#0454FF]/15 blur-sm"
              />

              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-3.5 shadow-[0_10px_35px_-8px_rgba(4,84,255,0.2)] border border-blue-100 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="ECOMATE"
                  width={72}
                  height={72}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 flex flex-col items-center"
            >
              <span className="text-2xl font-extrabold tracking-tight text-slate-950 flex items-center gap-1">
                <span>ECOMATE</span>
                <span className="text-[#0454FF]">.</span>
              </span>
              <span className="text-[11px] font-medium tracking-wider uppercase text-slate-500 font-mono mt-0.5">
                {isAr ? "شريك نمو الأعمال والحلول المتكاملة" : "Business Growth & Solutions"}
              </span>
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ opacity: 0, width: "60%" }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-[220px] flex flex-col items-center gap-2.5"
            >
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/60 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0454FF] to-[#60A5FA] rounded-full shadow-[0_0_12px_rgba(4,84,255,0.5)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.15 }}
                />
              </div>

              {/* Counter & Status */}
              <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-[10px] tracking-wide text-slate-500">
                  {isAr ? "جاري التحميل..." : "Loading..."}
                </span>
                <span className="font-bold text-[#0454FF]">
                  {progress}%
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
