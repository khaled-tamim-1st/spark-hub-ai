import type { Metadata } from "next";
import { locales, localeDirection, getDictionary, type Locale } from "@/lib/i18n";
import Preloader from "@/components/ui/Preloader";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || "en";
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.metadata.title,
      template: `%s | ${dict.metadata.siteName}`,
    },
    description: dict.metadata.description,
    keywords: [
      "Business Solutions",
      "Business Growth",
      "Strategy",
      "Branding",
      "Marketing",
      "Digital Transformation",
      "Technology Solutions",
      "Creative Agency",
      "ECOMATE",
    ],
    authors: [{ name: "ECOMATE" }],
    creator: "ECOMATE",
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      siteName: dict.metadata.siteName,
      title: dict.metadata.title,
      description: dict.metadata.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.description,
    },
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) || "en";
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`antialiased bg-white text-slate-900 selection:bg-blue-600/10 selection:text-blue-600 overflow-x-hidden ${
          locale === "ar" ? "font-arabic" : "font-sans"
        }`}
      >
        <Preloader locale={locale} />
        {children}
      </body>
    </html>
  );
}
