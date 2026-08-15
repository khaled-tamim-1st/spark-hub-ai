import { Router } from 'express';
import { db } from '@workspace/db';
import { deals, pipelineStages, contacts } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { pipelineId, status } = req.query as Record<string, string>;
    const conditions = [eq(deals.organizationId, req.organizationId)];
    if (pipelineId) conditions.push(eq(deals.pipelineId, Number(pipelineId)));
    if (status) conditions.push(eq(deals.status, status));
    const rows = await db.select({
      id: deals.id, title: deals.title, value: deals.value, currency: deals.currency,
      status: deals.status, pipelineId: deals.pipelineId, stageId: deals.stageId,
      assigneeId: deals.assigneeId, closedAt: deals.closedAt,
      createdAt: deals.createdAt, updatedAt: deals.updatedAt,
      stageName: pipelineStages.name,
      contactFirstName: contacts.firstName, contactLastName: contacts.lastName,
      contactId: contacts.id,
    })
      .from(deals)
      .leftJoin(pipelineStages, eq(deals.stageId, pipelineStages.id))
      .leftJoin(contacts, eq(deals.contactId, contacts.id))
      .where(and(...conditions))
      .orderBy(desc(deals.createdAt));
    res.json(rows.map(r => ({
      ...r,
      contact: r.contactId ? { id: r.contactId, firstName: r.contactFirstName!, lastName: r.contactLastName! } : null,
      stage: r.stageName ? { id: r.stageId, name: r.stageName } : null,
    })));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, pipelineId, stageId, contactId, value = 0, currency = 'USD', assigneeId } = req.body ?? {};
    if (!title) { res.status(400).json({ error: 'Title is required' }); return; }
    const [row] = await db.insert(deals).values({
      organizationId: req.organizationId,
      title: String(title),
      pipelineId: pipelineId ? Number(pipelineId) : undefined,
      stageId: stageId ? Number(stageId) : undefined,
      contactId: contactId ? Number(contactId) : undefined,
      value: String(value),
      currency: String(currency),
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
    }).returning();
    res.status(201).json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: deals.id }).from(deals)
      .where(and(eq(deals.id, Number(req.params.id)), eq(deals.organizationId, req.organizationId))).limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const { title, stageId, status, value, closedAt } = req.body ?? {};
    const [row] = await db.update(deals).set({
      ...(title && { title: String(title) }),
      ...(stageId !== undefined && { stageId: stageId ? Number(stageId) : null }),
      ...(status && { status: String(status) }),
      ...(value !== undefined && { value: String(value) }),
      ...(closedAt !== undefined && { closedAt: closedAt ? new Date(closedAt) : null }),
      updatedAt: new Date(),
    }).where(eq(deals.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: deals.id }).from(deals)
      .where(and(eq(deals.id, Number(req.params.id)), eq(deals.organizationId, req.organizationId))).limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(deals).where(eq(deals.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
