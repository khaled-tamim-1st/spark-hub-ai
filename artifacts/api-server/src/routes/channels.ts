import { Router } from 'express';
import { db } from '@workspace/db';
import { channels } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const rows = await db.select().from(channels)
      .where(eq(channels.organizationId, req.organizationId))
      .orderBy(desc(channels.createdAt));
    res.json(rows.map((r) => ({ ...r, config: r.config ? JSON.parse(r.config) : {} })));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [row] = await db.select().from(channels)
      .where(and(eq(channels.id, Number(req.params.id)), eq(channels.organizationId, req.organizationId)))
      .limit(1);
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ ...row, config: row.config ? JSON.parse(row.config) : {} });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, channelType, provider, config, isActive = true } = req.body ?? {};
    if (!name || !channelType || !provider) {
      res.status(400).json({ error: 'name, channelType, and provider are required' });
      return;
    }
    const [row] = await db.insert(channels).values({
      organizationId: req.organizationId,
      name: String(name),
      channelType: String(channelType),
      provider: String(provider),
      config: config ? JSON.stringify(config) : undefined,
      isActive: Boolean(isActive),
    }).returning();
    res.status(201).json({ ...row, config: row.config ? JSON.parse(row.config) : {} });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: channels.id }).from(channels)
      .where(and(eq(channels.id, Number(req.params.id)), eq(channels.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const { name, config, isActive } = req.body ?? {};
    const [row] = await db.update(channels).set({
      ...(name && { name: String(name) }),
      ...(config !== undefined && { config: JSON.stringify(config) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      updatedAt: new Date(),
    }).where(eq(channels.id, Number(req.params.id))).returning();
    res.json({ ...row, config: row.config ? JSON.parse(row.config) : {} });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: channels.id }).from(channels)
      .where(and(eq(channels.id, Number(req.params.id)), eq(channels.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(channels).where(eq(channels.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
