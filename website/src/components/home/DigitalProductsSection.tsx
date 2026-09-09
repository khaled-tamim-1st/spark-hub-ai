"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface DigitalProductsSectionProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    ecoCx: {
      name: string;
      description: string;
      cta: string;
    };
  };
}

export default function DigitalProductsSection({ locale, dictionary }: DigitalProductsSectionProps) {
  const isRTL = locale === 'ar';

  return (
    <section className="py-24 bg-[#0B0F19] relative overflow-hidden text-white">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand font-mono text-sm tracking-widest uppercase mb-4 block"
          >
            {dictionary.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-medium leading-tight"
          >
            {dictionary.headline}
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* ECO CX Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden flex flex-col lg:flex-row items-center gap-12"
          >
            {/* Content Side */}
            <div className="flex-1 space-y-6 relative z-10 text-center lg:text-start">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Product
              </div>
              <h3 className="text-4xl md:text-5xl font-display font-medium text-white">
                {dictionary.ecoCx.name}
              </h3>
              <p className="text-white/70 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                {dictionary.ecoCx.description}
              </p>
              <div className="pt-4">
                <a 
                  href="https://ecocx.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-white font-medium hover:bg-brand/90 transition-colors"
                >
                  {dictionary.ecoCx.cta}
                </a>
              </div>
            </div>

            {/* Visual Side: Abstract UI Mockup */}
            <div className="flex-1 w-full relative h-[250px] sm:h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent rounded-2xl border border-white/10 overflow-hidden">
                {/* Floating UI Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/4 start-1/4 w-32 p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-lg"
                >
                  <div className="w-8 h-2 bg-white/20 rounded-full mb-3" />
                  <div className="space-y-2">
                    <div className="w-full h-1.5 bg-white/10 rounded-full" />
                    <div className="w-4/5 h-1.5 bg-white/10 rounded-full" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-1/4 end-1/4 w-40 p-4 bg-[#0B0F19]/80 backdrop-blur-md rounded-xl border border-brand/30 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-brand/50 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div className="w-16 h-2 bg-white/30 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-8 bg-white/5 rounded" />
                    <div className="h-8 bg-brand/20 rounded border border-brand/30" />
                    <div className="h-8 bg-white/5 rounded" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/30 rounded-full blur-3xl"
                />
              </div>
            </div>
          </motion.div>

          {/* More coming soon indicator */}
          <div className="mt-8 flex justify-center">
            <span className="text-white/30 font-mono text-sm tracking-wide uppercase flex items-center gap-3">
              <span className="w-8 h-px bg-white/20" />
              + More Coming Soon
              <span className="w-8 h-px bg-white/20" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
