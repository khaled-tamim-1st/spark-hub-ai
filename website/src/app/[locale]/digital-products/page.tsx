import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import DigitalProductsClient from './DigitalProductsClient';

export async function generateMetadata(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  return {
    title: locale === 'ar' ? 'المنتجات الرقمية — إيكوميت' : 'Digital Products — ECOMATE',
  };
}

export default async function DigitalProductsPage(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  const dictionary = await getDictionary(locale);

  return (
    <DigitalProductsClient locale={locale} dictionary={dictionary} />
  );
}
