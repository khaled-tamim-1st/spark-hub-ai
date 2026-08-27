import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ecomate | إيكوميت — المساعد الذكي لمتاجر سلة والتجارة الإلكترونية",
    template: "%s | Ecomate AI",
  },
  description:
    "Ecomate (إيكوميت) هو المساعد الذكي المتخصص في أتمتة خدمة عملاء المتاجر الإلكترونية على سلة. ردود فورية على واتساب، تتبع الشحنات، وزيادة المبيعات بالذكاء الاصطناعي.",
  keywords: [
    "Ecomate",
    "إيكوميت",
    "مساعد ذكي",
    "سلة",
    "واتساب",
    "بوت واتساب",
    "خدمة عملاء تلقائية",
    "ذكاء اصطناعي",
    "متجر إلكتروني",
    "سعودي",
    "ردود ذكية",
    "E-commerce AI",
  ],
  authors: [{ name: "Ecomate AI" }],
  creator: "Ecomate AI",
  metadataBase: new URL("https://ecomate.ai"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://ecomate.ai",
    siteName: "Ecomate AI",
    title: "Ecomate | إيكوميت — المساعد الذكي لمتجرك الإلكتروني",
    description:
      "Ecomate يرد على عملاء متجرك على واتساب وسلة تلقائياً بالذكاء الاصطناعي. جرّبه مجاناً الآن.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Ecomate AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecomate | إيكوميت — المساعد الذكي لمتجرك",
    description:
      "ردود تلقائية على واتساب وسلة بالذكاء الاصطناعي. جرّب Ecomate مجاناً.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Ecomate AI",
              applicationCategory: "BusinessApplication",
              description:
                "مساعد ذكي لخدمة عملاء المتاجر على سلة عبر واتساب والقنوات المتعددة",
              operatingSystem: "Web",
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "SAR",
                lowPrice: "149",
                highPrice: "349",
              },
              publisher: {
                "@type": "Organization",
                name: "Ecomate AI",
                url: "https://ecomate.ai",
              },
            }),
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-cairo)] antialiased bg-white text-slate-900 selection:bg-[#0052FF]/15 selection:text-[#0052FF]">
        {children}
      </body>
    </html>
  );
}
