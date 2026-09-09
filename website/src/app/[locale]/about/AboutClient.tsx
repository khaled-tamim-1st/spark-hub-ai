'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface AboutClientProps {
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
      staggerChildren: 0.15,
    },
  },
};

export default function AboutClient({ locale, dictionary }: AboutClientProps) {
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const content = {
    hero: {
      label: isAr ? 'من نحن' : 'About ECOMATE',
      headline: isAr ? 'شريك نمو الأعمال والحلول المتكاملة' : 'A Business Growth & Solutions Partner',
      body: isAr 
        ? 'نجمع بين الاستراتيجية والعلامة التجارية والتسويق والرقمي والتكنولوجيا تحت سقف واحد. نؤمن أن الشركات العظيمة لا تنمو في جزر منعزلة — بل تنمو عندما تعمل كل التخصصات معاً نحو هدف مشترك.'
        : 'We bring together strategy, branding, marketing, digital, and technology under one roof. We believe great businesses don\'t grow in silos — they grow when every discipline works together toward a shared goal.'
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar locale={locale} dictionary={dictionary.nav} />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero & Philosophy Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end"
          >
            <div className="lg:col-span-8">
              <motion.p variants={fadeUp} className="text-brand font-mono text-sm md:text-base uppercase tracking-wider mb-6">
                {content.hero.label}
              </motion.p>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-navy tracking-tight leading-[1.1] mb-8">
                {content.hero.headline}
              </motion.h1>
            </div>
            
            <div className="lg:col-span-4 lg:pb-3">
              <motion.div variants={fadeUp} className="w-16 h-1 bg-brand mb-6" />
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 leading-relaxed">
                {content.hero.body}
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mt-20 h-64 md:h-96 w-full bg-slate-100 rounded-3xl overflow-hidden relative"
          >
            {/* Abstract visual representation of "Everything Connects" */}
            <div className="absolute inset-0 bg-navy">
               <div className="absolute inset-0 bg-[radial-gradient(#0454FF_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand rounded-full blur-3xl opacity-50 mix-blend-screen" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-3xl md:text-5xl font-bold text-white tracking-widest opacity-80 uppercase">
                {isAr ? 'كل شيء مترابط' : 'Everything Connects'}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Methodology / How We Think */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-navy mb-16">
                {dictionary.methodology.headline}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dictionary.methodology.steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeUp}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-brand/20 transition-colors"
                  >
                    <div className="text-brand font-mono text-xl mb-4">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Principles / Why Us */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-navy sticky top-32">
                  {dictionary.whyUs.headline}
                </motion.h2>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-12">
                {dictionary.whyUs.principles.map((principle, index) => (
                  <motion.div key={index} variants={fadeUp} className="border-t border-slate-200 pt-8">
                    <h3 className="text-2xl font-bold text-navy mb-4">{principle.title}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">{principle.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-brand text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            >
              <div className="max-w-2xl">
                <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-6">
                  {isAr ? 'دعنا ننمو معاً' : 'Let\'s grow together'}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-xl text-blue-100">
                  {isAr 
                    ? 'هل تبحث عن شريك يفهم عملك بشكل كامل؟ نحن هنا للمساعدة.'
                    : 'Looking for a partner who understands your business as a whole? We\'re here to help.'}
                </motion.p>
              </div>
              <motion.div variants={fadeUp} className="shrink-0">
                <Link 
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand rounded-full font-medium hover:bg-slate-50 transition-colors"
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
