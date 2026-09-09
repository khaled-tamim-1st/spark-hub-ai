import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Business & Technology Solutions Partner | Enterprise Digital Transformation",
    template: "%s | Business & Technology Solutions",
  },
  description:
    "We engineer scalable business solutions that help ambitious companies modernize operations, automate complexity, and create sustainable growth.",
  keywords: [
    "Business Solutions",
    "Technology Consulting",
    "Digital Transformation",
    "Custom Enterprise Software",
    "Intelligent Automation",
    "Systems Integration",
    "Customer Experience Architecture",
    "Operational Efficiency",
  ],
  authors: [{ name: "Solutions & Technology Group" }],
  creator: "Solutions & Technology Group",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Business & Technology Solutions",
    title: "Business & Technology Solutions Partner",
    description:
      "We engineer scalable business solutions that help ambitious companies modernize operations, automate complexity, and create sustainable growth.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business & Technology Solutions Partner",
    description:
      "We engineer scalable business solutions that help ambitious companies modernize operations, automate complexity, and create sustainable growth.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-slate-900 selection:bg-blue-600/10 selection:text-blue-600 font-sans">
        {children}
      </body>
    </html>
  );
}

