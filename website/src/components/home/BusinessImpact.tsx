"use client";

import { motion } from 'framer-motion';

interface BusinessImpactProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    items: { title: string; description: string }[];
  };
}

// Abstract SVG icons component
const AbstractIcon = ({ index, isRtl }: { index: number, isRtl: boolean }) => {
  const color = index % 2 === 0 ? 'var(--color-brand)' : '#0B0F19';
  
  const icons = [
    // Circle & Square
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="12" stroke={color} strokeWidth="3" />
      <rect x="24" y="24" width="16" height="16" stroke={color} strokeWidth="3" />
    </svg>,
    // Connected nodes
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="24" r="6" stroke={color} strokeWidth="3" />
      <circle cx="34" cy="24" r="6" stroke={color} strokeWidth="3" />
      <path d="M20 24H28" stroke={color} strokeWidth="3" />
    </svg>,
    // Angles
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 36L24 16L36 36" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 26L24 20L28 26" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    // Grid
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="12" width="10" height="10" stroke={color} strokeWidth="3" />
      <rect x="26" y="12" width="10" height="10" stroke={color} strokeWidth="3" />
      <rect x="12" y="26" width="10" height="10" stroke={color} strokeWidth="3" />
      <rect x="26" y="26" width="10" height="10" stroke={color} strokeWidth="3" />
    </svg>,
    // Waves
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 24C10 24 14 16 24 16C34 16 38 24 38 24C38 24 34 32 24 32C14 32 10 24 10 24Z" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="4" fill={color} />
    </svg>,
    // Hierarchy
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="12" width="8" height="8" stroke={color} strokeWidth="3" />
      <rect x="12" y="28" width="8" height="8" stroke={color} strokeWidth="3" />
      <rect x="28" y="28" width="8" height="8" stroke={color} strokeWidth="3" />
      <path d="M24 20V24M24 24H16M24 24H32M16 24V28M32 24V28" stroke={color} strokeWidth="3" />
    </svg>
  ];

  return icons[index % icons.length];
};

export default function BusinessImpact({ locale, dictionary }: BusinessImpactProps) {
  const isRtl = locale === 'ar';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 50 } }
  };

  return (
    <section className="py-24 bg-white relative" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-16 md:mb-24">
          <div className="max-w-2xl">
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
              className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#0B0F19] tracking-tight"
            >
              {dictionary.headline}
            </motion.h2>
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8"
        >
          {dictionary.items.map((impact, index) => {
            let colSpan = "md:col-span-6";
            if (index === 0) colSpan = "md:col-span-7";
            else if (index === 1) colSpan = "md:col-span-5";

            return (
              <motion.div 
                key={index}
                variants={item}
                className={`group bg-[#F8FAFC] border border-gray-100 p-8 lg:p-10 rounded-2xl hover:bg-white hover:border-[var(--color-brand)]/30 hover:shadow-[0_8px_30px_rgb(4,84,255,0.06)] transition-all duration-500 relative overflow-hidden flex flex-col ${colSpan}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="mb-8 p-4 bg-white inline-flex rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-500 self-start">
                  <AbstractIcon index={index} isRtl={isRtl} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-semibold text-[#0B0F19] mb-4 group-hover:text-[var(--color-brand)] transition-colors duration-300">
                  {impact.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {impact.description}
                </p>

                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[var(--color-brand)]/20 pointer-events-none">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60 0H0L60 60V0Z" fill="currentColor"/>
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
