import { Router } from 'express';
import { db } from '@workspace/db';
import { knowledgeDocs } from '@workspace/db';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Enhanced Helper to scrape and extract meaningful content from a website URL
async function scrapeUrlContent(targetUrl: string): Promise<{ title: string; content: string }> {
  let normalizedUrl = targetUrl.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Sanad Store AI Scraper)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        title: normalizedUrl,
        content: `رابط موقع المتجر المسجل في قاعدة المعرفة: ${normalizedUrl} (حالة الاستجابة: ${res.status})`,
      };
    }

    const html = await res.text();

    // Extract <title> if present
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : normalizedUrl;

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const metaDesc = descMatch ? descMatch[1].trim() : '';

    // Clean HTML: Remove scripts, styles, head, comments, tags
    const cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    const fullContent = [
      `رابط الصفحة: ${normalizedUrl}`,
      metaDesc ? `الوصف: ${metaDesc}` : '',
      cleaned ? `المحتوى:\n${cleaned.slice(0, 15000)}` : '',
    ].filter(Boolean).join('\n\n');

    return {
      title: pageTitle || normalizedUrl,
      content: fullContent || `رابط الموقع: ${normalizedUrl}`,
    };
  } catch (err: any) {
    console.warn(`[KnowledgeBase] Failed to scrape URL ${targetUrl}:`, err.message);
    return {
      title: normalizedUrl,
      content: `رابط الموقع المسجل في قاعدة المعرفة: ${normalizedUrl}`,
    };
  }
}

// Handler for listing docs
const listDocsHandler = async (req: any, res: any) => {
  try {
    const { search, page = '1', limit = '100' } = req.query as Record<string, string>;
    const where = search
      ? and(eq(knowledgeDocs.organizationId, req.organizationId), ilike(knowledgeDocs.title, `%${search}%`))
      : eq(knowledgeDocs.organizationId, req.organizationId);

    const rows = await db.select().from(knowledgeDocs)
      .where(where)
      .orderBy(desc(knowledgeDocs.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    res.json(rows);
  } catch (err) {
    console.error('[KnowledgeBase] List error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler for creating docs
const createDocHandler = async (req: any, res: any) => {
  try {
    const body = req.body ?? {};
    let title = body.title || body.name;
    const fileType = body.fileType || body.contentType || 'txt';
    let content = body.content || '';
    const url = body.url || (fileType === 'url' && (body.title?.startsWith('http') ? body.title : undefined));

    if (!title && !url) {
      res.status(400).json({ error: 'العنوان أو الرابط مطلوب' });
      return;
    }

    // If it's a URL or title is a URL, automatically scrape content
    if (fileType === 'url' || url || title?.startsWith('http://') || title?.startsWith('https://')) {
      const targetUrl = url || title;
      const scraped = await scrapeUrlContent(targetUrl);
      if (!title || title.startsWith('http')) {
        title = scraped.title;
      }
      if (!content) {
        content = scraped.content;
      }
    }

    if (!content) {
      content = title || 'مستند معرفي';
    }

    const [row] = await db.insert(knowledgeDocs).values({
      organizationId: req.organizationId,
      title: String(title),
      content: String(content),
      contentType: String(fileType),
      status: 'ready',
    }).returning();

    res.status(201).json(row);
  } catch (err: any) {
    console.error('[KnowledgeBase] Create error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// Handler for deleting docs
const deleteDocHandler = async (req: any, res: any) => {
  try {
    const docId = Number(req.params.id);
    const [existing] = await db.select({ id: knowledgeDocs.id }).from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.id, docId), eq(knowledgeDocs.organizationId, req.organizationId)))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: 'المستند غير موجود' });
      return;
    }

    await db.delete(knowledgeDocs).where(eq(knowledgeDocs.id, docId));
    res.status(200).json({ status: 'success', id: docId });
  } catch (err) {
    console.error('[KnowledgeBase] Delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler for getting a single doc
const getSingleDocHandler = async (req: any, res: any) => {
  try {
    const [row] = await db.select().from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.id, Number(req.params.id)), eq(knowledgeDocs.organizationId, req.organizationId)))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(row);
  } catch (err) {
    console.error('[KnowledgeBase] Get doc error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Route definitions supporting all route variations
router.get('/', requireAuth, listDocsHandler);
router.get('/docs', requireAuth, listDocsHandler);

router.post('/', requireAuth, createDocHandler);
router.post('/docs', requireAuth, createDocHandler);
router.post('/url', requireAuth, createDocHandler);
router.post('/website', requireAuth, createDocHandler);

router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q = '' } = req.query as Record<string, string>;
    const rows = await db.select().from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.organizationId, req.organizationId), ilike(knowledgeDocs.content, `%${q}%`)))
      .limit(10);
    res.json(rows);
  } catch (err) {
    console.error('[KnowledgeBase] Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', requireAuth, getSingleDocHandler);
router.get('/docs/:id', requireAuth, getSingleDocHandler);

router.delete('/:id', requireAuth, deleteDocHandler);
router.delete('/docs/:id', requireAuth, deleteDocHandler);

export default router;
