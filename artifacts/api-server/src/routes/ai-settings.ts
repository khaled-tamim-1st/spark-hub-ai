import { Router } from 'express';
import { db } from '@workspace/db';
import { aiSettings } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

const DEFAULT_SETTINGS = {
  provider: 'ollama',
  model: 'llama3',
  baseUrl: 'http://localhost:11434',
  apiKey: null,
  systemPrompt: 'You are a helpful customer support assistant. Be concise, friendly, and professional.',
  temperature: 0.7,
  maxTokens: 1000,
  autoReply: false,
  autoReplyConfidence: 0.8,
};

// GET /api/ai-settings
router.get('/', requireAuth, async (req, res) => {
  try {
    const [row] = await db.select().from(aiSettings)
      .where(eq(aiSettings.organizationId, req.organizationId)).limit(1);
    if (!row) {
      // Return defaults without persisting until they save
      res.json({ ...DEFAULT_SETTINGS, organizationId: req.organizationId });
      return;
    }
    res.json({
      ...row,
      temperature: Number(row.temperature),
      autoReplyConfidence: Number(row.autoReplyConfidence),
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// PUT /api/ai-settings
router.put('/', requireAuth, async (req, res) => {
  try {
    const { provider, model, baseUrl, apiKey, systemPrompt, temperature, maxTokens, autoReply, autoReplyConfidence } = req.body ?? {};
    const values = {
      organizationId: req.organizationId,
      ...(provider && { provider: String(provider) }),
      ...(model && { model: String(model) }),
      ...(baseUrl !== undefined && { baseUrl: String(baseUrl) }),
      ...(apiKey !== undefined && { apiKey: apiKey ? String(apiKey) : null }),
      ...(systemPrompt !== undefined && { systemPrompt: String(systemPrompt) }),
      ...(temperature !== undefined && { temperature: String(temperature) }),
      ...(maxTokens !== undefined && { maxTokens: Number(maxTokens) }),
      ...(autoReply !== undefined && { autoReply: Boolean(autoReply) }),
      ...(autoReplyConfidence !== undefined && { autoReplyConfidence: String(autoReplyConfidence) }),
      updatedAt: new Date(),
    };
    // Upsert
    const [existing] = await db.select({ id: aiSettings.id }).from(aiSettings)
      .where(eq(aiSettings.organizationId, req.organizationId)).limit(1);
    let row;
    if (existing) {
      [row] = await db.update(aiSettings).set(values).where(eq(aiSettings.id, existing.id)).returning();
    } else {
      [row] = await db.insert(aiSettings).values(values).returning();
    }
    res.json({
      ...row,
      temperature: Number(row.temperature),
      autoReplyConfidence: Number(row.autoReplyConfidence),
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
