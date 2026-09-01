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
    default: "ECOMATE | إيكوميت — حلول الأعمال والنمو للبراندات المحلية",
    template: "%s | ECOMATE",
  },
  description:
    "في ECOMATE نبني لبراندك هوية بصرية قوية، تسويقاً فعالاً، وحلولاً تقنية وأتمتة ذكية تزيد مبيعاتك وتسهّل تجربة عملائك في السوق السعودي.",
  keywords: [
    "ECOMATE",
    "إيكوميت",
    "حلول الأعمال",
    "براندنج",
    "هوية بصرية",
    "تسويق محلي",
    "أتمتة المبيعات",
    "مطاعم وكافيهات",
    "عيادات ومراكز طبية",
    "صالونات وتجميل",
    "السوق السعودي",
    "تجربة العملاء",
    "ECO CX",
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
  icons: {
    icon: [
      { url: "/favicon.png?v=3", type: "image/png" },
      { url: "/favicon.ico?v=3" },
    ],
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ECOMATE",
              applicationCategory: "BusinessApplication",
              description:
                "حلول الأعمال والنمو للبراندات والأنشطة المحلية في السوق السعودي",
              operatingSystem: "Web",
              publisher: {
                "@type": "Organization",
                name: "ECOMATE",
                url: "https://ecomate.ai",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-[#0454FF]/15 selection:text-[#0454FF]">
        {children}
        {/* Live ECOMATE Web Chat Widget */}
        <Script
          id="ecomate-widget-script"
          src="/widget.js"
          strategy="afterInteractive"
          data-channel="1"
          data-color="#3B4FE8"
          data-title="مساعد ECOMATE الذكي"
          data-welcome="أهلاً بك في ECOMATE 👋 كيف نقدر نساعدك اليوم في تشغيل متجرك أو شركتك؟"
          data-position="left"
        />
      </body>
    </html>
  );
}
