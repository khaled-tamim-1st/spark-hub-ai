import { Router } from 'express';
import { db } from '@workspace/db';
import { notes } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { contactId, conversationId } = req.query as Record<string, string>;
    const conditions = [eq(notes.organizationId, req.organizationId)];
    if (contactId) conditions.push(eq(notes.contactId, Number(contactId)));
    if (conversationId) conditions.push(eq(notes.conversationId, Number(conversationId)));
    const rows = await db.select().from(notes).where(and(...conditions)).orderBy(desc(notes.createdAt));
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, contactId, conversationId } = req.body ?? {};
    if (!content) { res.status(400).json({ error: 'Content is required' }); return; }
    const [row] = await db.insert(notes).values({
      organizationId: req.organizationId,
      content: String(content),
      authorId: req.userId,
      contactId: contactId ? Number(contactId) : undefined,
      conversationId: conversationId ? Number(conversationId) : undefined,
    }).returning();
    res.status(201).json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: notes.id }).from(notes)
      .where(and(eq(notes.id, Number(req.params.id)), eq(notes.organizationId, req.organizationId))).limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(notes).where(eq(notes.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
