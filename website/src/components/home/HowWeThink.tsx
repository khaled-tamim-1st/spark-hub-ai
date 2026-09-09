"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HowWeThinkProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    steps: { title: string; description: string }[];
  };
}

export default function HowWeThink({ locale, dictionary }: HowWeThinkProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isRtl = locale === 'ar';

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % dictionary.steps.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [dictionary.steps.length, isHovered]);

  return (
    <section className="py-24 bg-[#F8FAFC] overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-brand)] font-mono text-sm tracking-widest uppercase mb-4 block"
          >
            {dictionary.label}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#0B0F19] tracking-tight max-w-4xl"
          >
            {dictionary.headline}
          </motion.h2>
        </div>

        {/* Desktop View */}
        <div 
          className="hidden md:flex flex-row items-start justify-between relative min-h-[250px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {dictionary.steps.map((step, index) => {
            const isActive = activeStep === index;
            const isPast = activeStep > index;
            
            return (
              <div key={index} className="relative flex flex-col items-center flex-1 z-10 px-4">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-mono transition-all duration-300 relative z-20 outline-none
                    ${isActive ? 'bg-[var(--color-brand)] text-white shadow-xl scale-110' : 
                      isPast ? 'bg-[#0B0F19] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
                >
                  0{index + 1}
                </button>
                
                <div className="mt-8 text-center h-32 flex flex-col items-center">
                  <h3 className={`text-xl font-medium mb-3 transition-colors duration-300 ${isActive ? 'text-[var(--color-brand)]' : 'text-[#0B0F19]'}`}>
                    {step.title}
                  </h3>
                  
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-600 text-sm max-w-[200px]"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
          
          {/* Connection Lines (Desktop) */}
          <div className="absolute top-7 left-0 right-0 h-[2px] bg-gray-200 z-0 flex" style={{ width: 'calc(100% - 3.5rem)', margin: '0 1.75rem' }}>
            <motion.div 
              className="h-full bg-[var(--color-brand)]"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeStep / (dictionary.steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformOrigin: isRtl ? 'right' : 'left' }}
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex flex-col md:hidden space-y-6 relative before:absolute before:inset-0 before:start-7 before:-translate-x-1/2 rtl:before:translate-x-1/2 before:w-[2px] before:bg-gray-200 before:z-0">
          <motion.div 
            className="absolute top-0 bottom-0 start-7 -translate-x-1/2 rtl:translate-x-1/2 w-[2px] bg-[var(--color-brand)] z-0"
            initial={{ height: '0%' }}
            animate={{ height: `${((activeStep + 1) / dictionary.steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{ originY: 0 }}
          />
          
          {dictionary.steps.map((step, index) => {
            const isActive = activeStep === index;
            const isPast = activeStep >= index;
            
            return (
              <div key={index} className="relative z-10 flex flex-row items-start gap-6">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-lg font-mono transition-all duration-300 outline-none
                    ${isActive ? 'bg-[var(--color-brand)] text-white shadow-lg' : 
                      isPast ? 'bg-[#0B0F19] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
                >
                  0{index + 1}
                </button>
                
                <div className="flex flex-col pt-3 pb-8">
                  <h3 className={`text-xl font-medium mb-2 transition-colors duration-300 ${isActive ? 'text-[var(--color-brand)]' : 'text-[#0B0F19]'}`}>
                    {step.title}
                  </h3>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
