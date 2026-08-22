import { Router } from 'express';
import { db } from '@workspace/db';
import { knowledgeDocs } from '@workspace/db';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Helper to scrape text from a website URL
async function scrapeUrlContent(targetUrl: string): Promise<string> {
  try {
    let normalizedUrl = targetUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return `محتوى مستخرج من الرابط ${normalizedUrl} (حالة الاستجابة: ${res.status})`;
    }

    const html = await res.text();

    // Clean HTML: Remove scripts, styles, head, comments, tags
    const cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned.slice(0, 10000) || `رابط الموقع: ${normalizedUrl}`;
  } catch (err: any) {
    console.warn(`[KnowledgeBase] Failed to scrape URL ${targetUrl}:`, err.message);
    return `رابط الموقع المسجل في قاعدة المعرفة: ${targetUrl}`;
  }
}

// Handler for listing docs (supports GET / and GET /docs)
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

// Handler for creating docs (supports POST / and POST /docs)
const createDocHandler = async (req: any, res: any) => {
  try {
    const body = req.body ?? {};
    const title = body.title || body.name;
    const fileType = body.fileType || body.contentType || 'text';
    let content = body.content || '';
    const url = body.url || (fileType === 'url' && body.title?.startsWith('http') ? body.title : undefined);

    if (!title) {
      res.status(400).json({ error: 'العنوان أو الرابط مطلوب' });
      return;
    }

    // If it's a URL or content is missing, automatically scrape content
    if ((fileType === 'url' || url) && !content) {
      const targetUrl = url || title;
      content = await scrapeUrlContent(targetUrl);
    }

    if (!content) {
      content = title;
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

// Handler for deleting docs (supports DELETE /:id and DELETE /docs/:id)
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

// Route definitions supporting both / and /docs
router.get('/', requireAuth, listDocsHandler);
router.get('/docs', requireAuth, listDocsHandler);

router.post('/', requireAuth, createDocHandler);
router.post('/docs', requireAuth, createDocHandler);

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
