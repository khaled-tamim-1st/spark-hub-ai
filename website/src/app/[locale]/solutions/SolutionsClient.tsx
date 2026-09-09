'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface SolutionsClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function SolutionsClient({ locale, dictionary }: SolutionsClientProps) {
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar locale={locale} dictionary={dictionary.nav} />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
          {/* Subtle dot grid pattern */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeUp} className="text-brand font-mono text-sm md:text-base uppercase tracking-wider mb-4">
              {dictionary.capabilities.label}
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight leading-[1.1] mb-6">
              {dictionary.capabilities.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 max-w-2xl">
              {isAr 
                ? 'نحن نقدم مجموعة شاملة من الخدمات المتكاملة التي تغطي كافة جوانب نمو الأعمال.'
                : 'We offer a comprehensive suite of integrated services covering all aspects of business growth.'}
            </motion.p>
          </motion.div>
        </section>

        {/* Capabilities List */}
        <section className="flex flex-col">
          {dictionary.capabilities.items.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index}
                className={`py-20 md:py-32 ${isEven ? 'bg-white' : 'bg-slate-50'}`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start"
                  >
                    {/* Number & Title */}
                    <div className="lg:col-span-5">
                      <motion.div variants={fadeUp} className="text-brand font-mono text-xl md:text-2xl mb-4">
                        {(index + 1).toString().padStart(2, '0')}
                      </motion.div>
                      <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-navy mb-4">
                        {item.title}
                      </motion.h2>
                      <motion.p variants={fadeUp} className="text-xl text-brand font-medium">
                        {item.tagline}
                      </motion.p>
                    </div>

                    {/* Description & Tags */}
                    <div className="lg:col-span-6 lg:col-start-7 pt-2 lg:pt-16">
                      <motion.p variants={fadeUp} className="text-lg text-slate-600 mb-10 leading-relaxed">
                        {item.description}
                      </motion.p>
                      
                      <motion.div variants={staggerContainer} className="flex flex-wrap gap-3">
                        {item.capabilities.map((tag: string, tagIndex: number) => (
                          <motion.span 
                            key={tagIndex}
                            variants={fadeUp}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-brand hover:text-brand transition-colors"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-navy text-white mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto flex flex-col items-center"
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-6">
                {isAr ? 'هل أنت مستعد لبدء مشروعك؟' : 'Ready to start your project?'}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-slate-300 mb-10">
                {isAr 
                  ? 'دعنا نتحدث عن كيف يمكن لخدماتنا المتكاملة أن تساعد في نمو أعمالك.'
                  : 'Let\'s discuss how our integrated services can help your business grow.'}
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link 
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                >
                  {isAr ? 'تواصل معنا' : 'Contact Us'}
                  <Arrow className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer locale={locale} dictionary={dictionary.footer} />
    </div>
  );
}
