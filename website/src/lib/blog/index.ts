import { Article } from './types';
import { article01AbandonedCarts } from './articles/01-abandoned-carts';
import { article02CartRecovery } from './articles/02-cart-recovery';

// Registry of all articles
const allArticles: Article[] = [
  article01AbandonedCarts,
  article02CartRecovery,
];

/**
 * Get all published articles (status === 'published')
 */
export function getPublishedArticles(): Article[] {
  return allArticles
    .filter((a) => a.meta.status === 'published')
    .sort((a, b) => {
      const dateA = a.meta.publishedAt || a.meta.updatedAt;
      const dateB = b.meta.publishedAt || b.meta.updatedAt;
      return dateB.localeCompare(dateA);
    });
}

/**
 * Get all articles regardless of status (for admin/preview)
 */
export function getAllArticles(): Article[] {
  return allArticles.sort((a, b) => {
    const dateA = a.meta.publishedAt || a.meta.updatedAt;
    const dateB = b.meta.publishedAt || b.meta.updatedAt;
    return dateB.localeCompare(dateA);
  });
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.meta.slug === slug);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): Article[] {
  return getPublishedArticles().filter((a) => a.meta.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const cats = new Set(allArticles.map((a) => a.meta.category));
  return Array.from(cats);
}
