export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeFonts: Record<Locale, string> = {
  en: "'Plus Jakarta Sans', 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  ar: "'Cairo', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// Dictionary type for translations
export interface Dictionary {
  metadata: {
    title: string;
    description: string;
    siteName: string;
  };
  nav: {
    solutions: string;
    industries: string;
    digitalProducts: string;
    about: string;
    work: string;
    cta: string;
    langSwitch: string;
  };
  hero: {
    headline: string[];
    sub: string;
    cta: string;
    scrollLabel: string;
  };
  bigStatement: {
    headline: string;
    sub: string;
  };
  challenges: {
    label: string;
    headline: string;
    items: { title: string; capabilities: string }[];
  };
  capabilities: {
    label: string;
    headline: string;
    items: {
      number: string;
      title: string;
      tagline: string;
      description: string;
      capabilities: string[];
    }[];
  };
  methodology: {
    label: string;
    headline: string;
    steps: { title: string; description: string }[];
  };
  impact: {
    label: string;
    headline: string;
    items: { title: string; description: string }[];
  };
  industries: {
    label: string;
    headline: string;
    items: {
      name: string;
      challenges: string[];
      capabilities: string[];
    }[];
  };
  products: {
    label: string;
    headline: string;
    ecoCx: {
      name: string;
      description: string;
      cta: string;
    };
  };
  whyUs: {
    label: string;
    headline: string;
    principles: { title: string; description: string }[];
  };
  finalCta: {
    headline: string;
    sub: string;
    cta: string;
  };
  footer: {
    tagline: string;
    statement: string;
    cta: string;
    description: string;
    ecoCxLabel: string;
    ecoCxCta: string;
    solutionsTitle: string;
    industriesTitle: string;
    companyTitle: string;
    copyright: string;
    privacy: string;
    terms: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
