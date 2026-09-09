"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FinalCTAProps {
  locale: 'en' | 'ar';
  dictionary: {
    headline: string;
    sub: string;
    cta: string;
  };
}

export default function FinalCTA({ locale, dictionary }: FinalCTAProps) {
  const isRTL = locale === 'ar';

  return (
    <section className="relative overflow-hidden bg-brand py-32 md:py-48 flex items-center justify-center text-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -70, 70, 0],
            y: [0, 70, -70, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-navy/20 rounded-full blur-[120px]"
        />

        {/* Connecting Lines SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            d="M-100,200 C300,300 500,-100 1200,400"
            fill="none"
            stroke="white"
            strokeWidth="1"
            className="hidden md:block"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
            d="M-200,500 C400,100 800,600 1500,200"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white mb-8 leading-tight tracking-tight"
        >
          {dictionary.headline}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-white/90 font-light mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {dictionary.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#0B0F19] text-white rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-navy/20">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative font-medium text-lg flex items-center gap-3">
              {dictionary.cta}
              <motion.svg
                animate={{ x: isRTL ? [-5, 0, -5] : [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={isRTL ? "rotate-180" : ""}
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </motion.svg>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
