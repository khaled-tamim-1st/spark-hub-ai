'use client';

import { motion } from 'framer-motion';
import type { Dictionary, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface WorkClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

const placeholders = [
  {
    id: '1',
    categoryEn: 'Branding',
    categoryAr: 'العلامة التجارية',
    titleEn: 'Brand Identity for a Retail Company',
    titleAr: 'هوية العلامة التجارية لشركة تجزئة',
    descEn: 'A complete revitalization of a national retail brand focusing on modern consumer values.',
    descAr: 'تنشيط شامل لعلامة تجارية وطنية للتجزئة يركز على قيم المستهلك الحديثة.',
    height: 'h-[400px]',
  },
  {
    id: '2',
    categoryEn: 'Digital Experience',
    categoryAr: 'التجربة الرقمية',
    titleEn: 'Digital Platform for Financial Services',
    titleAr: 'منصة رقمية للخدمات المالية',
    descEn: 'Creating an intuitive, secure digital banking experience for next-generation users.',
    descAr: 'إنشاء تجربة مصرفية رقمية آمنة وبديهية لمستخدمي الجيل القادم.',
    height: 'h-[500px]',
  },
  {
    id: '3',
    categoryEn: 'Marketing Campaign',
    categoryAr: 'حملة تسويقية',
    titleEn: 'Marketing Strategy for Real Estate',
    titleAr: 'استراتيجية تسويق للعقارات',
    descEn: 'Data-driven market entry strategy and omnichannel campaign execution.',
    descAr: 'استراتيجية دخول السوق تعتمد على البيانات وتنفيذ حملة عبر قنوات متعددة.',
    height: 'h-[450px]',
  },
];

export default function WorkClient({ locale, dictionary }: WorkClientProps) {
  const isRtl = locale === 'ar';
  
  return (
    <div className="min-h-screen bg-gray-50 text-navy flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar locale={locale} dictionary={dictionary.nav} />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 text-navy tracking-tight">
              {isRtl ? 'أعمالنا' : 'Our Work'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {isRtl 
                ? 'مشاريع مختارة تسلط الضوء على نهجنا متعدد التخصصات في حلول الأعمال والنمو.'
                : 'Selected projects highlighting our multi-disciplinary approach to business growth and solutions.'}
            </p>
          </motion.div>

          {/* Masonry-style Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {placeholders.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className={`relative group rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 ${item.height} flex flex-col justify-end p-8`}
              >
                {/* Background placeholder pattern */}
                <div className="absolute inset-0 bg-gray-100 pattern-dots opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {/* Content */}
                <div className="relative z-20 flex flex-col h-full justify-between transition-transform duration-500 group-hover:-translate-y-4">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex px-3 py-1 bg-white/90 backdrop-blur-sm text-navy text-xs font-bold tracking-wide uppercase rounded-full shadow-sm">
                      {isRtl ? item.categoryAr : item.categoryEn}
                    </span>
                    <span className="inline-flex px-3 py-1 bg-brand text-white text-xs font-bold uppercase rounded-md shadow-sm">
                      {isRtl ? 'قريباً' : 'Coming Soon'}
                    </span>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <h3 className="text-2xl font-bold font-display text-white mb-3 leading-tight">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-gray-200 line-clamp-3">
                      {isRtl ? item.descAr : item.descEn}
                    </p>
                  </div>
                  
                  {/* Default visible title when not hovered */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-xl font-bold font-display text-navy mb-2">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-32 text-center bg-navy rounded-3xl p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
                {isRtl ? 'هل لديك مشروع في ذهنك؟' : 'Have a project in mind?'}
              </h2>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center px-8 py-4 bg-brand hover:bg-brand/90 text-white rounded-xl font-medium transition-all duration-300"
              >
                {isRtl ? 'لنبدأ المحادثة' : 'Let\'s start a conversation'}
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer locale={locale} dictionary={dictionary.footer} />
    </div>
  );
}
