import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import WorkClient from './WorkClient';

export async function generateMetadata(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  return {
    title: locale === 'ar' ? 'أعمالنا — إيكوميت' : 'Work — ECOMATE',
  };
}

export default async function WorkPage(
  props: { params: Promise<{ locale: Locale }> }
) {
  const params = await props.params;
  const { locale } = params;
  const dictionary = await getDictionary(locale);

  return (
    <WorkClient locale={locale} dictionary={dictionary} />
  );
}
