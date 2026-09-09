"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface BusinessChallengesProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    items: { title: string; capabilities: string }[];
  };
}

export default function BusinessChallenges({ locale, dictionary }: BusinessChallengesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isRtl = locale === 'ar';

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="mb-16 md:mb-24 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-sm tracking-widest uppercase text-[#0454FF] mb-6 block">
              {dictionary.label}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#0B0F19]">
              {dictionary.headline}
            </h2>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start"
        >
          {dictionary.items.map((item, index) => {
            const isActive = activeIndex === index;
            // Create asymmetric sizing based on index
            const sizeClass = 
              index % 4 === 0 ? "w-full md:w-[48%]" : 
              index % 4 === 1 ? "w-full md:w-[60%]" : 
              index % 4 === 2 ? "w-full md:w-[36%]" : 
              "w-full md:w-[48%]";
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${sizeClass} relative group cursor-pointer`}
                onClick={() => toggleItem(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] transition-colors duration-500 border border-slate-100 h-full flex flex-col justify-center ${isActive ? 'bg-slate-50 border-[#0454FF]/20' : 'bg-white hover:bg-slate-50'}`}>
                  
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-medium transition-colors duration-300 ${isActive ? 'text-[#0454FF]' : 'text-[#0B0F19]'}`}>
                      {item.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: isActive ? (isRtl ? -45 : 45) : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isActive ? 'bg-[#0454FF] text-white border-[#0454FF]' : 'bg-transparent text-slate-400 border-slate-200'}`}
                    >
                      <Plus size={20} />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="relative pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#0454FF]/30">
                          <p className="text-lg text-slate-600 font-medium">
                            {item.capabilities}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
