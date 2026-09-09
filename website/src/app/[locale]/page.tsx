import { getDictionary, type Locale } from "@/lib/i18n";
import HomeClient from "./HomeClient";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || "en";
  const dict = await getDictionary(locale);

  return <HomeClient locale={locale} dictionary={dict} />;
}
