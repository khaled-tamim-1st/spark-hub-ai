"use client";

import { motion } from 'framer-motion';

interface BigStatementProps {
  locale: 'en' | 'ar';
  dictionary: {
    headline: string;
    sub: string;
  };
}

export default function BigStatement({ locale, dictionary }: BigStatementProps) {
  const isRtl = locale === 'ar';
  
  // Basic split by space for animation, keeping words together
  const words = dictionary.headline.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 * i }
    })
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: "spring" as const, damping: 20, stiffness: 100 }
    }
  };

  return (
    <section className="bg-[#F8FAFC] py-32 md:py-48 overflow-hidden relative">
      {/* Decorative background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 50 Q 50 10 100 50 T 200 50" fill="none" stroke="#0B0F19" strokeWidth="0.5" strokeDasharray="2 4" />
          <path d="M0 70 Q 50 90 100 70 T 200 70" fill="none" stroke="#0454FF" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="inline-block font-mono text-sm uppercase tracking-[0.2em] text-[#0454FF] font-semibold">
              Everything Connects
            </span>
          </motion.div>

          <motion.h2
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#0B0F19] tracking-tight leading-[1.1] mb-12 flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-4"
          >
            {words.map((word, index) => {
              const isSilo = word.toLowerCase().includes('silo');
              return (
                <motion.span
                  key={index}
                  variants={wordAnimation}
                  className={`inline-block ${
                    isSilo ? 'relative text-gray-400' : 'text-[#0B0F19]'
                  }`}
                >
                  {word}
                  {isSilo && (
                    <motion.span 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                      className="absolute top-1/2 left-[-10%] right-[-10%] h-[10%] bg-[#0454FF] origin-left -rotate-2"
                      aria-hidden="true"
                    />
                  )}
                </motion.span>
              );
            })}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {dictionary.sub}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
