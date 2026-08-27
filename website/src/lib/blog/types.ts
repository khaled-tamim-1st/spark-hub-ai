export type ArticleStatus = 'draft' | 'published';

export interface ArticleMeta {
  slug: string;
  status: ArticleStatus;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  targetAudience: string;
  contentCluster: string;
  suggestedCta: string;
  category: string;
  readTime: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface ArticleSection {
  type: 'paragraph' | 'heading2' | 'heading3' | 'list' | 'table' | 'code-block' | 'callout' | 'faq-item';
  content: string;
  items?: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
  question?: string;
  answer?: string;
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ArticleCTA {
  headline: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  note?: string;
}

export interface InternalLink {
  targetArticle: string;
  anchorText: string;
  placement: string;
}

export interface ArticleSource {
  name: string;
  url?: string;
  note?: string;
}

export interface Article {
  meta: ArticleMeta;
  content: string; // Full markdown content
  faq: ArticleFAQ[];
  ecomateSolution: string; // Markdown content for ECOMATE solution section
  cta: ArticleCTA;
  internalLinks: InternalLink[];
  sources: ArticleSource[];
}
