import { Router } from 'express';
import { db } from '@workspace/db';
import { pipelines, pipelineStages, deals } from '@workspace/db';
import { eq, and, asc, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// GET /api/pipelines
router.get('/', requireAuth, async (req, res) => {
  try {
    const pipes = await db.select().from(pipelines)
      .where(eq(pipelines.organizationId, req.organizationId))
      .orderBy(desc(pipelines.createdAt));
    const stages = await db.select().from(pipelineStages)
      .where(eq(pipelineStages.pipelineId, pipes[0]?.id ?? 0))
      .orderBy(asc(pipelineStages.order));
    // For simplicity, attach stages for each pipeline
    const pipelineIds = pipes.map(p => p.id);
    const allStages = pipelineIds.length
      ? await db.select().from(pipelineStages)
          .where(eq(pipelineStages.pipelineId, pipelineIds[0]))
          .orderBy(asc(pipelineStages.order))
      : [];
    res.json(pipes.map(p => ({
      ...p,
      stages: allStages.filter(s => s.pipelineId === p.id),
    })));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/pipelines
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, stages: stageNames = ['Lead', 'Qualified', 'Proposal', 'Won/Lost'] } = req.body ?? {};
    if (!name) { res.status(400).json({ error: 'Name is required' }); return; }
    const [pipeline] = await db.insert(pipelines).values({
      organizationId: req.organizationId,
      name: String(name),
    }).returning();
    if (Array.isArray(stageNames) && stageNames.length) {
      await db.insert(pipelineStages).values(
        stageNames.map((n: string, i: number) => ({
          pipelineId: pipeline.id,
          name: String(n),
          order: i,
        }))
      );
    }
    const stages = await db.select().from(pipelineStages)
      .where(eq(pipelineStages.pipelineId, pipeline.id))
      .orderBy(asc(pipelineStages.order));
    res.status(201).json({ ...pipeline, stages });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/pipelines/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [pipeline] = await db.select().from(pipelines)
      .where(and(eq(pipelines.id, Number(req.params.id)), eq(pipelines.organizationId, req.organizationId)))
      .limit(1);
    if (!pipeline) { res.status(404).json({ error: 'Not found' }); return; }
    const stages = await db.select().from(pipelineStages)
      .where(eq(pipelineStages.pipelineId, pipeline.id))
      .orderBy(asc(pipelineStages.order));
    const pipelineDeals = await db.select().from(deals)
      .where(and(eq(deals.pipelineId, pipeline.id), eq(deals.organizationId, req.organizationId)))
      .orderBy(desc(deals.createdAt));
    res.json({ ...pipeline, stages, deals: pipelineDeals });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// DELETE /api/pipelines/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: pipelines.id }).from(pipelines)
      .where(and(eq(pipelines.id, Number(req.params.id)), eq(pipelines.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(pipelines).where(eq(pipelines.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
