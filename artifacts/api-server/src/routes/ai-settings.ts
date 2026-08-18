import { Router } from 'express';
import { db } from '@workspace/db';
import { aiSettings } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';
import { generateAiReply, generateAiReplyDetailed } from '../services/ai-service.js';

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
    const isSuperAdmin = req.role === 'superadmin';
    const [row] = await db.select().from(aiSettings)
      .where(eq(aiSettings.organizationId, req.organizationId)).limit(1);

    if (!row) {
      res.json({
        ...DEFAULT_SETTINGS,
        organizationId: req.organizationId,
        isSuperAdmin,
        apiKey: isSuperAdmin ? null : undefined,
      });
      return;
    }

    res.json({
      ...row,
      apiKey: isSuperAdmin ? row.apiKey : (row.apiKey ? '••••••••••••••••' : null),
      temperature: Number(row.temperature),
      autoReplyConfidence: Number(row.autoReplyConfidence),
      isSuperAdmin,
    });
  } catch (err) {
    console.error('Get AI settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/ai-settings
router.put('/', requireAuth, async (req, res) => {
  try {
    const isSuperAdmin = req.role === 'superadmin';
    const { provider, model, baseUrl, apiKey, systemPrompt, temperature, maxTokens, autoReply, autoReplyConfidence } = req.body ?? {};

    // Tenants can ONLY modify prompt, temperature, autoReply, confidence
    // SuperAdmin can modify everything including provider, model, keys, baseUrl
    const values: Record<string, any> = {
      organizationId: req.organizationId,
      ...(systemPrompt !== undefined && { systemPrompt: String(systemPrompt) }),
      ...(temperature !== undefined && { temperature: String(temperature) }),
      ...(autoReply !== undefined && { autoReply: Boolean(autoReply) }),
      ...(autoReplyConfidence !== undefined && { autoReplyConfidence: String(autoReplyConfidence) }),
      updatedAt: new Date(),
    };

    if (isSuperAdmin) {
      if (provider !== undefined) values.provider = String(provider);
      if (model !== undefined) values.model = String(model);
      if (baseUrl !== undefined) values.baseUrl = String(baseUrl);
      if (apiKey !== undefined) values.apiKey = apiKey ? String(apiKey) : null;
      if (maxTokens !== undefined) values.maxTokens = Number(maxTokens);
    }

    // Upsert
    const [existing] = await db.select({ id: aiSettings.id }).from(aiSettings)
      .where(eq(aiSettings.organizationId, req.organizationId)).limit(1);
    
    let row;
    if (existing) {
      [row] = await db.update(aiSettings).set(values as any).where(eq(aiSettings.id, existing.id)).returning();
    } else {
      [row] = await db.insert(aiSettings).values(values as any).returning();
    }

    res.json({
      ...row,
      apiKey: isSuperAdmin ? row.apiKey : (row.apiKey ? '••••••••••••••••' : null),
      temperature: Number(row.temperature),
      autoReplyConfidence: Number(row.autoReplyConfidence),
      isSuperAdmin,
    });
  } catch (err) {
    console.error('Update AI settings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/ai-settings/test - Test the AI model live
router.post('/test', requireAuth, async (req, res) => {
  try {
    const { message, provider, model, apiKey, baseUrl, systemPrompt, temperature, maxTokens } = req.body ?? {};
    if (!message) {
      res.status(400).json({ error: 'Test message is required' });
      return;
    }

    const overrideSettings = (provider || apiKey || model) ? {
      provider: provider ? String(provider) : undefined,
      model: model ? String(model) : undefined,
      apiKey: (apiKey && !apiKey.includes('••••')) ? String(apiKey) : undefined,
      baseUrl: baseUrl ? String(baseUrl) : undefined,
      systemPrompt: systemPrompt ? String(systemPrompt) : undefined,
      temperature: temperature !== undefined ? Number(temperature) : undefined,
      maxTokens: maxTokens !== undefined ? Number(maxTokens) : undefined,
    } : undefined;

    const result = await generateAiReplyDetailed({
      organizationId: req.organizationId!,
      customerName: 'Test Customer',
      incomingText: String(message),
      forceGenerate: true,
      overrideSettings,
    });

    if (!result.success) {
      res.status(400).json({ 
        error: result.error || 'Failed to generate AI response. Please ensure provider and API Key are valid in SuperAdmin.' 
      });
      return;
    }

    res.json({ reply: result.reply });
  } catch (err: any) {
    console.error('AI test error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /api/ai-settings/fetch-models - Query provider for available models
router.post('/fetch-models', requireAuth, async (req, res) => {
  try {
    const { provider = 'groq', apiKey } = req.body ?? {};
    
    // Look up API key
    let key = (apiKey && !apiKey.includes('••••')) ? String(apiKey).trim() : '';
    if (!key) {
      const [settings] = await db.select().from(aiSettings).where(eq(aiSettings.organizationId, req.organizationId)).limit(1);
      key = (settings?.apiKey || '').trim();
    }
    if (!key) {
      const allRows = await db.select().from(aiSettings);
      const configured = allRows.find(r => r.apiKey && r.apiKey.trim().length > 10 && !r.apiKey.includes('••••'));
      key = (configured?.apiKey || '').trim();
    }

    if (!key && provider !== 'ollama') {
      res.status(400).json({ error: 'API key is required to fetch models' });
      return;
    }

    let url = 'https://api.groq.com/openai/v1/models';
    if (provider === 'openai') url = 'https://api.openai.com/v1/models';
    else if (provider === 'deepseek') url = 'https://api.deepseek.com/models';
    else if (provider === 'openrouter') url = 'https://openrouter.ai/api/v1/models';
    else if (provider === 'ollama') url = 'http://localhost:11434/api/tags';

    const resp = await fetch(url, {
      headers: {
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      res.status(resp.status).json({ error: `Provider returned status ${resp.status}: ${text}` });
      return;
    }

    const data = await resp.json() as any;
    let modelList: string[] = [];
    if (provider === 'ollama' && Array.isArray(data.models)) {
      modelList = data.models.map((m: any) => m.name);
    } else if (Array.isArray(data.data)) {
      modelList = data.data.map((m: any) => m.id);
    }

    res.json({ models: modelList });
  } catch (err: any) {
    console.error('Fetch models error:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch models' });
  }
});

export default router;
