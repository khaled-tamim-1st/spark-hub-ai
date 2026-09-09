import { getDictionary, type Locale } from "@/lib/i18n";
import SolutionsClient from "./SolutionsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "الحلول — إيكوميت" : "Solutions — ECOMATE",
    description: isAr
      ? "نجمع بين الاستراتيجية والعلامة التجارية والتسويق والرقمي والتكنولوجيا لحل تحديات الأعمال."
      : "We combine strategy, branding, marketing, digital, and technology to solve business challenges.",
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || "en";
  const dict = await getDictionary(locale);
  return <SolutionsClient locale={locale} dictionary={dict} />;
}
