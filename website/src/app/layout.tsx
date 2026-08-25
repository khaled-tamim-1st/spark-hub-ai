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
    default: "سند | المساعد الذكي لمتجرك على سلة",
    template: "%s | سند AI",
  },
  description:
    "سند هو المساعد الذكي المتخصص في خدمة عملاء المتاجر السعودية على سلة. ردود تلقائية على واتساب، تتبع الطلبات، وإدارة المحادثات بالذكاء الاصطناعي.",
  keywords: [
    "سند",
    "مساعد ذكي",
    "سلة",
    "واتساب",
    "بوت واتساب",
    "خدمة عملاء تلقائية",
    "ذكاء اصطناعي",
    "متجر إلكتروني",
    "سعودي",
    "ردود ذكية",
    "مساعد ذكي سلة",
  ],
  authors: [{ name: "سند AI" }],
  creator: "سند AI",
  metadataBase: new URL("https://sanadai.com"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://sanadai.com",
    siteName: "سند AI",
    title: "سند | المساعد الذكي لمتجرك على سلة",
    description:
      "سند يرد على عملاء متجرك على واتساب وسلة تلقائياً بالذكاء الاصطناعي. جرّبه مجاناً الآن.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "سند AI - المساعد الذكي لمتجرك",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سند | المساعد الذكي لمتجرك على سلة",
    description:
      "ردود تلقائية على واتساب وسلة بالذكاء الاصطناعي. جرّب سند مجاناً.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sanadai.com",
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
              name: "سند AI",
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
                name: "سند AI",
                url: "https://sanadai.com",
              },
            }),
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-cairo)] antialiased bg-white text-slate-900 selection:bg-[#6B00FF]/15 selection:text-[#6B00FF]">
        {children}
      </body>
    </html>
  );
}
