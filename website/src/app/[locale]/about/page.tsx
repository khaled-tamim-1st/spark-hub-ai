import { getDictionary, type Locale } from '@/lib/i18n';
import AboutClient from './AboutClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  
  return {
    title: isAr ? 'من نحن — إيكوميت' : 'About — ECOMATE',
    description: isAr ? 'نحن شريك نمو أعمال متعدد التخصصات.' : 'A multi-disciplinary business growth partner.',
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || 'en';
  const dict = await getDictionary(locale);
  
  return <AboutClient locale={locale} dictionary={dict} />;
}
