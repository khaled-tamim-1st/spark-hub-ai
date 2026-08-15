import { Router } from 'express';
import { db } from '@workspace/db';
import { tags } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const rows = await db.select().from(tags).where(eq(tags.organizationId, req.organizationId));
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, color } = req.body ?? {};
    if (!name) { res.status(400).json({ error: 'Name is required' }); return; }
    const [row] = await db.insert(tags).values({
      organizationId: req.organizationId,
      name: String(name),
      color: color ? String(color) : undefined,
    }).returning();
    res.status(201).json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: tags.id }).from(tags)
      .where(and(eq(tags.id, Number(req.params.id)), eq(tags.organizationId, req.organizationId))).limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(tags).where(eq(tags.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
