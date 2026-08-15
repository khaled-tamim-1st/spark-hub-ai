import { Router } from 'express';
import { db } from '@workspace/db';
import { companies } from '@workspace/db';
import { eq, and, ilike, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { search, page = '1', limit = '50' } = req.query as Record<string, string>;
    const orgId = req.organizationId;
    const where = search
      ? and(eq(companies.organizationId, orgId), ilike(companies.name, `%${search}%`))
      : eq(companies.organizationId, orgId);
    const rows = await db.select().from(companies).where(where)
      .orderBy(desc(companies.createdAt))
      .limit(Number(limit)).offset((Number(page) - 1) * Number(limit));
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [row] = await db.select().from(companies)
      .where(and(eq(companies.id, Number(req.params.id)), eq(companies.organizationId, req.organizationId)))
      .limit(1);
    if (!row) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, website, industry, size } = req.body ?? {};
    if (!name) { res.status(400).json({ error: 'Name is required' }); return; }
    const [row] = await db.insert(companies).values({
      organizationId: req.organizationId,
      name: String(name),
      website: website ? String(website) : undefined,
      industry: industry ? String(industry) : undefined,
      size: size ? String(size) : undefined,
    }).returning();
    res.status(201).json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: companies.id }).from(companies)
      .where(and(eq(companies.id, Number(req.params.id)), eq(companies.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const { name, website, industry, size } = req.body ?? {};
    const [row] = await db.update(companies).set({
      ...(name && { name: String(name) }),
      ...(website !== undefined && { website: String(website) }),
      ...(industry !== undefined && { industry: String(industry) }),
      ...(size !== undefined && { size: String(size) }),
      updatedAt: new Date(),
    }).where(eq(companies.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: companies.id }).from(companies)
      .where(and(eq(companies.id, Number(req.params.id)), eq(companies.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(companies).where(eq(companies.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
