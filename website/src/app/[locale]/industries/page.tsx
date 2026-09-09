import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import IndustriesClient from './IndustriesClient';

export async function generateMetadata(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  return {
    title: locale === 'ar' ? 'القطاعات — إيكوميت' : 'Industries — ECOMATE',
    description: locale === 'ar' ? 'اكتشف القطاعات التي نصنع فيها القيمة.' : 'Discover the industries where we create value.',
  };
}

export default async function IndustriesPage(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  const dictionary = await getDictionary(locale);

  return (
    <IndustriesClient locale={locale} dictionary={dictionary} />
  );
}
