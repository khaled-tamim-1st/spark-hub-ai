'use client';

import { motion } from 'framer-motion';
import type { Dictionary, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface IndustriesClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

const industriesData = [
  {
    id: 'retail',
    titleEn: 'Retail & E-commerce',
    titleAr: 'التجزئة والتجارة الإلكترونية',
    descEn: 'Building seamless omnichannel experiences that drive growth.',
    descAr: 'بناء تجارب سلسة عبر قنوات متعددة تدفع عجلة النمو.',
  },
  {
    id: 'real-estate',
    titleEn: 'Real Estate',
    titleAr: 'العقارات',
    descEn: 'Digital strategies that connect properties with people.',
    descAr: 'استراتيجيات رقمية تربط العقارات بالأشخاص.',
  },
  {
    id: 'finance',
    titleEn: 'Financial Services',
    titleAr: 'الخدمات المالية',
    descEn: 'Trust-driven digital transformation for modern finance.',
    descAr: 'تحول رقمي مبني على الثقة للمالية الحديثة.',
  },
  {
    id: 'healthcare',
    titleEn: 'Healthcare',
    titleAr: 'الرعاية الصحية',
    descEn: 'Patient-centric digital solutions for better outcomes.',
    descAr: 'حلول رقمية تركز على المريض لتحقيق نتائج أفضل.',
  },
];

export default function IndustriesClient({ locale, dictionary }: IndustriesClientProps) {
  const isRtl = locale === 'ar';
  
  return (
    <div className="min-h-screen bg-white text-navy flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar locale={locale} dictionary={dictionary.nav} />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-navy tracking-tight">
            {isRtl ? 'أين نصنع القيمة' : 'Where We Create Value'}
          </h1>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'نحن نقدم حلولاً مخصصة عبر مختلف القطاعات، متفهمين التحديات الفريدة والفرص في كل مجال.'
              : 'We deliver tailored solutions across diverse sectors, understanding the unique challenges and opportunities in each field.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {industriesData.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-50 rounded-2xl p-8 md:p-10 overflow-hidden border border-gray-100 hover:border-brand/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <h3 className="text-2xl font-bold mb-4 text-navy relative z-10 font-display">
                  {isRtl ? industry.titleAr : industry.titleEn}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10 text-lg">
                  {isRtl ? industry.descAr : industry.descEn}
                </p>
                
                <div className="mt-8 flex items-center text-brand font-medium relative z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <span className={isRtl ? 'ml-2' : 'mr-2'}>
                    {isRtl ? 'اكتشف المزيد' : 'Discover capabilities'}
                  </span>
                  <svg className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer locale={locale} dictionary={dictionary.footer} />
    </div>
  );
}
