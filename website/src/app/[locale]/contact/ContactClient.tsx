'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Dictionary, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface ContactClientProps {
  locale: Locale;
  dictionary: Dictionary;
}

const interestOptionsEn = [
  'Strategy', 'Branding', 'Marketing', 'Digital', 'Technology', 'Other'
];
const interestOptionsAr = [
  'الاستراتيجية', 'العلامة التجارية', 'التسويق', 'الرقمية', 'التكنولوجيا', 'أخرى'
];

export default function ContactClient({ locale, dictionary }: ContactClientProps) {
  const isRtl = locale === 'ar';
  const interests = isRtl ? interestOptionsAr : interestOptionsEn;
  const [selectedInterest, setSelectedInterest] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-white text-navy flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar locale={locale} dictionary={dictionary.nav} />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 text-navy tracking-tight">
              {isRtl ? 'لنبنِ ما هو قادم.' : "Let's Build What's Next."}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {isRtl 
                ? 'نحن دائماً مستعدون للتعاون في مشاريع طموحة ومساعدة عملك على تحقيق إمكاناته.'
                : 'We are always open to collaborating on ambitious projects and helping your business reach its potential.'}
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:w-2/3"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {isRtl ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                      placeholder={isRtl ? 'أدخل اسمك' : 'Jane Doe'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                      placeholder={isRtl ? 'you@company.com' : 'you@company.com'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      {isRtl ? 'الشركة' : 'Company'}
                    </label>
                    <input 
                      type="text" 
                      id="company"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                      placeholder={isRtl ? 'اسم شركتك' : 'Your Company'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      {isRtl ? 'المسمى الوظيفي' : 'Role'}
                    </label>
                    <input 
                      type="text" 
                      id="role"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                      placeholder={isRtl ? 'المسمى الوظيفي' : 'e.g. CEO'}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {isRtl ? 'مجال الاهتمام' : 'Area of Interest'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => setSelectedInterest(interest)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                          selectedInterest === interest
                            ? 'bg-brand text-white border-brand'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {isRtl ? 'رسالتك' : 'Message'}
                  </label>
                  <textarea 
                    id="message"
                    required
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors resize-none"
                    placeholder={isRtl ? 'أخبرنا عن مشروعك...' : 'Tell us about your project...'}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-navy hover:bg-brand text-white rounded-xl font-medium transition-all duration-300"
                >
                  {isRtl ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="lg:w-1/3"
            >
              <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 h-full">
                <h3 className="text-2xl font-display font-bold mb-8 text-navy">
                  {isRtl ? 'معلومات التواصل' : 'Contact Information'}
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm text-gray-500 font-medium mb-2">
                      {isRtl ? 'تحدث معنا' : 'Chat with us'}
                    </h4>
                    <a href="mailto:hello@ecomate.ai" className="text-lg font-medium hover:text-brand transition-colors">
                      hello@ecomate.ai
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 font-medium mb-2">
                      {isRtl ? 'المقر الرئيسي' : 'Headquarters'}
                    </h4>
                    <p className="text-lg font-medium text-navy">
                      {isRtl ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, UAE'}
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isRtl 
                      ? 'هدفنا هو الرد على جميع الاستفسارات خلال 24 ساعة في أيام العمل.'
                      : 'We aim to respond to all inquiries within 24 business hours.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dictionary={dictionary.footer} />
    </div>
  );
}
