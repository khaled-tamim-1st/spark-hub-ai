import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import ContactClient from './ContactClient';

export async function generateMetadata(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  return {
    title: locale === 'ar' ? 'تواصل معنا — إيكوميت' : 'Contact — ECOMATE',
  };
}

export default async function ContactPage(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  const dictionary = await getDictionary(locale);

  return (
    <ContactClient locale={locale} dictionary={dictionary} />
  );
}
