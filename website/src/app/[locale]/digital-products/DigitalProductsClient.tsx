'use client';

import { motion } from 'framer-motion';
import type { Dictionary, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface DigitalProductsClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function DigitalProductsClient({ locale, dictionary }: DigitalProductsClientProps) {
  const isRtl = locale === 'ar';
  
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar locale={locale} dictionary={dictionary.nav} />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white tracking-tight">
              {isRtl ? 'نحن لا نقدم الحلول فقط. بل نبنيها أيضاً.' : "We Don't Just Deliver Solutions. We Build Them Too."}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isRtl 
                ? 'استكشف منتجاتنا الرقمية الخاصة المصممة لدفع عجلة الابتكار والنمو.'
                : 'Explore our proprietary digital products designed to drive innovation and growth.'}
            </p>
          </motion.div>

          {/* ECO CX Product Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand/20 text-brand text-sm font-medium border border-brand/30">
                {isRtl ? 'منتج حصري' : 'Proprietary Product'}
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold">ECO CX</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {isRtl 
                  ? 'منصة متقدمة لتجربة العملاء مصممة لتحويل التفاعلات العادية إلى تجارب استثنائية. تجمع بين الذكاء الاصطناعي والتحليلات العميقة لبناء ولاء مستدام.'
                  : 'An advanced customer experience platform designed to transform ordinary interactions into extraordinary experiences. Combining AI and deep analytics to build sustainable loyalty.'}
              </p>
              
              <Link 
                href="https://ecocx.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand hover:bg-brand/90 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-brand/25"
              >
                {isRtl ? 'اكتشف ECO CX' : 'Discover ECO CX'}
                <svg className={`w-5 h-5 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            <div className="lg:w-1/2 w-full">
              {/* Abstract Product Visual */}
              <div className="relative aspect-video bg-gradient-to-br from-brand/20 to-navy/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(4,84,255,0.1),transparent_70%)]" />
                
                <div className="w-full h-full bg-navy/80 rounded-xl border border-white/5 p-4 flex flex-col gap-4 backdrop-blur-sm relative z-10">
                  {/* Mockup Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </div>
                  
                  {/* Mockup Body */}
                  <div className="flex gap-4 h-full pt-2">
                    <div className="w-1/4 h-full bg-white/5 rounded-lg flex flex-col gap-2 p-2">
                      <div className="w-full h-6 bg-brand/20 rounded" />
                      <div className="w-full h-6 bg-white/5 rounded" />
                      <div className="w-full h-6 bg-white/5 rounded" />
                    </div>
                    <div className="w-3/4 flex flex-col gap-4">
                      <div className="w-full h-1/3 bg-white/5 rounded-lg p-3">
                        <div className="w-1/3 h-4 bg-white/20 rounded mb-2" />
                        <div className="w-full h-2 bg-white/5 rounded" />
                      </div>
                      <div className="flex gap-4 h-2/3">
                        <div className="w-1/2 h-full bg-brand/10 rounded-lg border border-brand/20 flex items-end p-3">
                          <div className="w-full h-1/2 bg-brand/30 rounded" />
                        </div>
                        <div className="w-1/2 h-full bg-white/5 rounded-lg p-3 flex flex-col gap-2">
                          <div className="w-full h-4 bg-white/10 rounded" />
                          <div className="w-full h-4 bg-white/10 rounded" />
                          <div className="w-3/4 h-4 bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 text-center pb-12"
          >
            <p className="text-gray-500 italic">
              {isRtl ? 'المزيد من المنتجات قريباً...' : 'More products coming soon...'}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer locale={locale} dictionary={dictionary.footer} />
    </div>
  );
}
