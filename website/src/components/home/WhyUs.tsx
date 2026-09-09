"use client";

import { motion } from 'framer-motion';

interface WhyUsProps {
  locale: 'en' | 'ar';
  dictionary: {
    label: string;
    headline: string;
    principles: { title: string; description: string }[];
  };
}

export default function WhyUs({ locale, dictionary }: WhyUsProps) {
  const isRtl = locale === 'ar';
  
  return (
    <section className="py-24 bg-[var(--color-brand)] relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Abstract floating background shapes */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full border border-white/10 opacity-30 pointer-events-none"
      />
      <motion.div 
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[30%] -left-[10%] w-[80vw] h-[80vw] rounded-full border border-white/5 opacity-20 pointer-events-none"
      />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Sticky Left Content */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:h-max">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/70 font-mono text-sm tracking-widest uppercase mb-4 block"
            >
              {dictionary.label}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-medium text-white tracking-tight"
            >
              {dictionary.headline}
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 hidden lg:block"
            >
              <p className="text-white/80 text-lg">
                ECOMATE brings together strategy, branding, marketing, and technology under one roof.
              </p>
            </motion.div>
          </div>
          
          {/* Scrolling Right Content */}
          <div className="lg:w-2/3 flex flex-col gap-8 md:gap-12">
            {dictionary.principles.map((principle, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-3xl hover:bg-white/10 transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="text-4xl md:text-6xl font-mono text-white/30 font-bold shrink-0">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">
                      {principle.title}
                    </h3>
                    <p className="text-white/70 text-lg leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
