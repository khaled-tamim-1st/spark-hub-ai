import { Router } from 'express';
import { db } from '@workspace/db';
import { channels } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';
import {
  getWhatsAppWebStatus,
  startWhatsAppWebSession,
  stopWhatsAppWebSession,
} from '../services/whatsapp-web.js';

const router = Router();

// GET /api/channels/meta/oauth-config
router.get('/meta/oauth-config', requireAuth, async (req, res) => {
  res.json({
    appId: process.env.META_APP_ID || '',
  });
});

// POST /api/channels/meta/list-pages - Fetch pages from Facebook user access token
router.post('/meta/list-pages', requireAuth, async (req, res) => {
  try {
    const { userAccessToken } = req.body ?? {};
    if (!userAccessToken) {
      res.status(400).json({ error: 'userAccessToken is required' });
      return;
    }

    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category,picture,instagram_business_account{id,username,name,profile_picture_url}&access_token=${userAccessToken}`
    );

    if (!fbRes.ok) {
      const err = await fbRes.json().catch(() => ({}));
      console.error('[Meta OAuth] Failed to fetch accounts:', err);
      res.status(400).json({ error: 'Failed to retrieve Facebook pages with this token', details: err });
      return;
    }

    const data = await fbRes.json() as { data?: Array<any> };
    const pages = (data.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      accessToken: p.access_token,
      category: p.category,
      picture: p.picture?.data?.url,
      instagram: p.instagram_business_account
        ? {
            id: p.instagram_business_account.id,
            username: p.instagram_business_account.username,
            name: p.instagram_business_account.name,
            picture: p.instagram_business_account.profile_picture_url,
          }
        : null,
    }));

    res.json({ pages });
  } catch (err: any) {
    console.error('[Meta OAuth] Error listing pages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function subscribePageToWebhooks(pageId: string, pageAccessToken: string) {
  try {
    const subRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks,message_echoes,message_reads&access_token=${pageAccessToken}`,
      { method: 'POST' }
    );
    const subData = await subRes.json();
    console.log(`[Meta Auto-Subscribe] Page ${pageId} subscription result:`, subData);
    return subData;
  } catch (subErr: any) {
    console.warn(`[Meta Auto-Subscribe] Warning: Failed to subscribe page ${pageId}:`, subErr.message || subErr);
    return null;
  }
}

// POST /api/channels/meta/resubscribe/:id - Force resubscribe Page to Webhooks
router.post('/meta/resubscribe/:id', requireAuth, async (req, res) => {
  try {
    const [channel] = await db.select().from(channels)
      .where(and(eq(channels.id, Number(req.params.id)), eq(channels.organizationId, req.organizationId)))
      .limit(1);

    if (!channel || !channel.config) {
      res.status(404).json({ error: 'Channel or config not found' });
      return;
    }

    const config = (typeof channel.config === 'string' ? JSON.parse(channel.config) : channel.config) as any;
    if (!config.pageId || !config.accessToken) {
      res.status(400).json({ error: 'Missing pageId or accessToken in config' });
      return;
    }

    const subResult = await subscribePageToWebhooks(config.pageId, config.accessToken);
    res.json({ success: true, pageId: config.pageId, result: subResult });
  } catch (err: any) {
    console.error('[Meta Resubscribe] Error:', err);
    res.status(500).json({ error: 'Failed to resubscribe' });
  }
});

// POST /api/channels/meta/connect-page - 1-Click Connect Page & Subscribe to Webhooks
router.post('/meta/connect-page', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { pageId, pageName, pageAccessToken, instagramAccountId, channelType = 'messenger' } = req.body ?? {};

    if (!pageId || !pageAccessToken) {
      res.status(400).json({ error: 'pageId and pageAccessToken are required' });
      return;
    }

    // Auto-subscribe page to webhook events
    await subscribePageToWebhooks(pageId, pageAccessToken);

    // Check if channel already exists for this org
    const allOrgChannels = await db.select().from(channels)
      .where(and(eq(channels.organizationId, orgId), eq(channels.provider, 'meta_graph')));

    let existingChannel = allOrgChannels.find((ch) => {
      if (!ch.config) return false;
      const parsed = typeof ch.config === 'string' ? JSON.parse(ch.config) : ch.config;
      return String(parsed.pageId) === String(pageId) && ch.channelType === channelType;
    });

    const channelConfig = {
      pageId: String(pageId),
      accessToken: String(pageAccessToken),
      instagramAccountId: instagramAccountId ? String(instagramAccountId) : undefined,
    };

    let resultChannel;
    if (existingChannel) {
      const [updated] = await db.update(channels).set({
        name: pageName || existingChannel.name,
        config: JSON.stringify(channelConfig),
        isActive: true,
        updatedAt: new Date(),
      }).where(eq(channels.id, existingChannel.id)).returning();
      resultChannel = updated;
    } else {
      const [created] = await db.insert(channels).values({
        organizationId: orgId,
        name: pageName || (channelType === 'instagram' ? 'Instagram Account' : 'Facebook Page'),
        channelType: channelType === 'instagram' ? 'instagram' : 'messenger',
        provider: 'meta_graph',
        config: JSON.stringify(channelConfig),
        isActive: true,
      }).returning();
      resultChannel = created;
    }

    res.status(201).json({
      ...resultChannel,
      config: channelConfig,
    });
  } catch (err: any) {
    console.error('[Meta Connect Page] Error:', err);
    res.status(500).json({ error: 'Failed to connect page' });
  }
});

router.post('/whatsapp-web/start', requireAuth, async (req, res) => {
  try {
    const { name = 'WhatsApp Web', force = false } = req.body ?? {};
    let [channel] = await db.select().from(channels)
      .where(and(eq(channels.organizationId, req.organizationId), eq(channels.provider, 'whatsapp_web')))
      .limit(1);

    if (!channel) {
      [channel] = await db.insert(channels).values({
        organizationId: req.organizationId,
        name: String(name),
        channelType: 'whatsapp',
        provider: 'whatsapp_web',
        config: JSON.stringify({ connectionMode: 'qr' }),
        isActive: true,
      }).returning();
    }

    const status = await startWhatsAppWebSession(channel.id, Boolean(force));
    res.status(201).json({ channelId: channel.id, ...status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to start WhatsApp Web session' });
  }
});

router.get('/whatsapp-web/:id/status', requireAuth, async (req, res) => {
  try {
    const [channel] = await db.select({ id: channels.id }).from(channels)
      .where(and(eq(channels.id, Number(req.params.id)), eq(channels.organizationId, req.organizationId), eq(channels.provider, 'whatsapp_web')))
      .limit(1);
    if (!channel) {
      res.status(404).json({ error: 'WhatsApp Web channel not found' });
      return;
    }
    res.json({ channelId: channel.id, ...getWhatsAppWebStatus(channel.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to read WhatsApp Web status' });
  }
});

router.post('/whatsapp-web/:id/logout', requireAuth, async (req, res) => {
  try {
    const [channel] = await db.select({ id: channels.id }).from(channels)
      .where(and(eq(channels.id, Number(req.params.id)), eq(channels.organizationId, req.organizationId), eq(channels.provider, 'whatsapp_web')))
      .limit(1);
    if (!channel) {
      res.status(404).json({ error: 'WhatsApp Web channel not found' });
      return;
    }
    await stopWhatsAppWebSession(channel.id);
    await db.update(channels).set({ isActive: false, updatedAt: new Date() })
      .where(eq(channels.id, channel.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to disconnect WhatsApp Web' });
  }
});

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
    if (existing.id) await stopWhatsAppWebSession(existing.id);
    await db.delete(channels).where(eq(channels.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
