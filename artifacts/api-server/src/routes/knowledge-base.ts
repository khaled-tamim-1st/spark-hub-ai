import { Router } from 'express';
import { db } from '@workspace/db';
import { knowledgeDocs } from '@workspace/db';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// GET /api/knowledge-base/docs
router.get('/docs', requireAuth, async (req, res) => {
  try {
    const { search, page = '1', limit = '50' } = req.query as Record<string, string>;
    const where = search
      ? and(eq(knowledgeDocs.organizationId, req.organizationId), ilike(knowledgeDocs.title, `%${search}%`))
      : eq(knowledgeDocs.organizationId, req.organizationId);
    const rows = await db.select().from(knowledgeDocs)
      .where(where).orderBy(desc(knowledgeDocs.createdAt))
      .limit(Number(limit)).offset((Number(page) - 1) * Number(limit));
    // Don't send full content in list view
    res.json(rows.map(r => ({ ...r, content: r.content.substring(0, 200) + (r.content.length > 200 ? '...' : '') })));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/knowledge-base/docs/:id
router.get('/docs/:id', requireAuth, async (req, res) => {
  try {
    const [row] = await db.select().from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.id, Number(req.params.id)), eq(knowledgeDocs.organizationId, req.organizationId)))
      .limit(1);
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/knowledge-base/docs
router.post('/docs', requireAuth, async (req, res) => {
  try {
    const { title, content, contentType = 'text' } = req.body ?? {};
    if (!title || !content) { res.status(400).json({ error: 'Title and content are required' }); return; }
    const [row] = await db.insert(knowledgeDocs).values({
      organizationId: req.organizationId,
      title: String(title),
      content: String(content),
      contentType: String(contentType),
      status: 'ready',
    }).returning();
    res.status(201).json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// DELETE /api/knowledge-base/docs/:id
router.delete('/docs/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: knowledgeDocs.id }).from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.id, Number(req.params.id)), eq(knowledgeDocs.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(knowledgeDocs).where(eq(knowledgeDocs.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/knowledge-base/search
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q = '' } = req.query as Record<string, string>;
    const rows = await db.select().from(knowledgeDocs)
      .where(and(eq(knowledgeDocs.organizationId, req.organizationId), ilike(knowledgeDocs.content, `%${q}%`)))
      .limit(10);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
