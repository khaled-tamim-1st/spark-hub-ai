import { Router } from 'express';
import { db, organizations, organizationMembers, aiSettings } from '@workspace/db';
import { sql } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// POST /api/organizations - Create a new company workspace by authenticated user
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, website, industry } = req.body ?? {};
    if (!name || !String(name).trim()) {
      res.status(400).json({ error: 'Company name is required' });
      return;
    }

    const trimmedName = String(name).trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).slice(2, 7);

    const [org] = await db.insert(organizations).values({
      name: trimmedName,
      slug,
      website: website ? String(website) : undefined,
      plan: 'starter',
      status: 'active',
      maxUsers: 5,
      maxChannels: 2,
      aiEnabled: true,
    }).returning();

    // Assign creating user as Owner in organization_members
    await db.execute(sql`
      INSERT INTO organization_members (organization_id, user_id, role)
      VALUES (${org.id}, ${req.userId}, 'owner')
      ON CONFLICT (organization_id, user_id)
      DO UPDATE SET role = 'owner';
    `);

    // Seed default AI settings
    await db.insert(aiSettings).values({
      organizationId: org.id,
      provider: 'ollama',
      model: 'llama3',
      baseUrl: 'http://localhost:11434',
      systemPrompt: `You are an AI customer support assistant for ${org.name}. Be polite, professional, and concise.`,
      temperature: '0.7',
      maxTokens: 1000,
      autoReply: false,
      autoReplyConfidence: '0.8',
    } as any).catch(() => {});

    res.status(201).json(org);
  } catch (err) {
    console.error('Create organization error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
