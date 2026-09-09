"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IndustriesSectionProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    items: {
      name: string;
      challenges: string[];
      capabilities: string[];
    }[];
  };
}

export default function IndustriesSection({ locale, dictionary }: IndustriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isRTL = locale === 'ar';

  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16">
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
            className="text-4xl md:text-5xl font-display font-medium text-navy"
          >
            {dictionary.headline}
          </motion.h2>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-12 gap-12">
          {/* List Panel */}
          <div className="col-span-5 flex flex-col gap-6">
            {dictionary.items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`text-start group flex items-center gap-6 transition-all duration-300 ${
                  activeIndex === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'bg-brand scale-100' : 'bg-navy/50 scale-0 group-hover:scale-50'
                  }`}
                />
                <h3 className={`text-3xl xl:text-4xl font-display font-medium transition-transform duration-300 ${
                  activeIndex === idx ? (isRTL ? '-translate-x-4' : 'translate-x-4') : ''
                }`}>
                  {item.name}
                </h3>
              </button>
            ))}
          </div>

          {/* Details Panel */}
          <div className="col-span-7 bg-white rounded-3xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative border border-navy/5 min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-brand font-mono text-xs tracking-widest uppercase mb-6">
                      Challenges
                    </h4>
                    <ul className="space-y-4">
                      {dictionary.items[activeIndex].challenges.map((challenge, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-navy/20 mt-2 flex-shrink-0" />
                          <span className="text-navy/70 leading-relaxed text-sm md:text-base">
                            {challenge}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-brand font-mono text-xs tracking-widest uppercase mb-6">
                      How We Help
                    </h4>
                    <ul className="space-y-4">
                      {dictionary.items[activeIndex].capabilities.map((cap, capIdx) => (
                        <li key={capIdx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                          <span className="text-navy font-medium leading-relaxed text-sm md:text-base">
                            {cap}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex flex-col gap-4">
          {dictionary.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                className="w-full text-start p-6 flex justify-between items-center"
              >
                <h3 className={`text-xl font-display font-medium ${activeIndex === idx ? 'text-brand' : 'text-navy'}`}>
                  {item.name}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === idx ? 180 : 0 }}
                  className="w-6 h-6 rounded-full border border-navy/10 flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="w-full h-px bg-navy/5 mb-6" />
                    <div className="flex flex-col gap-8">
                      <div>
                        <h4 className="text-brand font-mono text-xs tracking-widest uppercase mb-4">
                          Challenges
                        </h4>
                        <ul className="space-y-3">
                          {item.challenges.map((challenge, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-navy/20 mt-2 flex-shrink-0" />
                              <span className="text-navy/70 text-sm">
                                {challenge}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-brand font-mono text-xs tracking-widest uppercase mb-4">
                          How We Help
                        </h4>
                        <ul className="space-y-3">
                          {item.capabilities.map((cap, capIdx) => (
                            <li key={capIdx} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 flex-shrink-0" />
                              <span className="text-navy font-medium text-sm">
                                {cap}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
