"use client";

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface CapabilitiesSectionProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    items: {
      number: string;
      title: string;
      tagline: string;
      description: string;
      capabilities: string[];
    }[];
  };
}

// Background visuals components
const StrategyVisual = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
    <motion.path 
      d="M0,50 C20,20 40,80 60,50 C80,20 100,50 100,50" 
      fill="none" 
      stroke="url(#gradient-strategy)" 
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
    />
    <defs>
      <linearGradient id="gradient-strategy" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0454FF" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const BrandingVisual = () => (
  <div className="absolute inset-0 flex items-center justify-center opacity-30 gap-4 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-12 h-32 rounded-full mix-blend-screen"
        style={{ backgroundColor: i % 2 === 0 ? '#0454FF' : '#ffffff' }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: [20, -20, 20], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
      />
    ))}
  </div>
);

const MarketingVisual = () => (
  <div className="absolute top-0 right-0 w-full h-full opacity-20">
    <motion.svg viewBox="0 0 100 100" className="w-full h-full">
      {[10, 30, 50, 70, 90].map((x, i) => (
        <motion.line
          key={i}
          x1={x} y1="100" x2={x} y2="0"
          stroke="#0454FF" strokeWidth="1"
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray: "100 100" }}
          transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </motion.svg>
  </div>
);

const DigitalVisual = () => (
  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1 p-8 opacity-10">
    {[...Array(24)].map((_, i) => (
      <motion.div
        key={i}
        className="border border-[#0454FF]/50 rounded-sm"
        animate={{ 
          backgroundColor: ["rgba(4,84,255,0)", "rgba(4,84,255,0.2)", "rgba(4,84,255,0)"] 
        }}
        transition={{ duration: 2, delay: (i % 6) * 0.2 + Math.floor(i / 6) * 0.1, repeat: Infinity }}
      />
    ))}
  </div>
);

const TechnologyVisual = () => (
  <div className="absolute inset-0 opacity-20">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <motion.circle cx="50" cy="50" r="30" fill="none" stroke="#0454FF" strokeWidth="1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle cx="50" cy="50" r="20" fill="none" stroke="#0454FF" strokeWidth="0.5"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
      />
    </svg>
  </div>
);

const VisualElement = ({ index }: { index: number }) => {
  switch (index) {
    case 0: return <StrategyVisual />;
    case 1: return <BrandingVisual />;
    case 2: return <MarketingVisual />;
    case 3: return <DigitalVisual />;
    case 4: return <TechnologyVisual />;
    default: return null;
  }
};

export default function CapabilitiesSection({ locale, dictionary }: CapabilitiesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isRtl = locale === 'ar';
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="py-32 bg-[#0B0F19] text-white relative overflow-hidden" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #0454FF 0%, transparent 60%)',
          y: bgY
        }}
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-sm tracking-widest uppercase text-slate-400 mb-6 block">
              {dictionary.label}
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white max-w-4xl">
              {dictionary.headline}
            </h2>
          </motion.div>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {dictionary.items.map((item, index) => {
            const isEven = index % 2 === 0;
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative group rounded-3xl p-8 md:p-16 transition-colors duration-500 overflow-hidden ${isHovered ? 'bg-white/5' : 'bg-transparent'}`}
              >
                {/* Background Hover Visual */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <VisualElement index={index} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={`relative z-10 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                  {/* Number area */}
                  <div className={`w-full md:w-1/3 flex ${isEven ? 'justify-start' : 'justify-end md:justify-start'}`}>
                    <span className="text-8xl md:text-[12rem] font-bold text-white opacity-10 leading-none tracking-tighter">
                      {item.number}
                    </span>
                  </div>

                  {/* Content area */}
                  <div className="w-full md:w-2/3 flex flex-col gap-6">
                    <div>
                      <h3 className="text-3xl md:text-5xl font-medium mb-3 text-white">
                        {item.title}
                      </h3>
                      <p className="text-xl md:text-2xl text-[#0454FF] font-medium font-mono tracking-tight">
                        {item.tagline}
                      </p>
                    </div>

                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {item.capabilities.map((cap, capIndex) => (
                        <span 
                          key={capIndex}
                          className="px-4 py-2 rounded-full border border-slate-700 text-sm text-slate-300 font-mono tracking-wide bg-slate-800/30 backdrop-blur-sm transition-colors group-hover:border-slate-500 group-hover:text-white"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
