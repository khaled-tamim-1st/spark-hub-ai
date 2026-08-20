import { Router } from 'express';
import { db } from '@workspace/db';
import { voiceSessions, contacts, conversations } from '@workspace/db';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';
import { voiceService } from '../services/voice-service.js';
import { normalizePhoneNumber } from '../services/voice-customer-resolver.js';

const router = Router();

// GET /api/voice/providers - List configured voice/telephony providers
router.get('/providers', requireAuth, async (req, res) => {
  const currentProvider = process.env.TELEPHONY_PROVIDER || 'mock';
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);

  res.json({
    activeProvider: currentProvider,
    isOpenAiConfigured: hasOpenAiKey,
    availableProviders: [
      {
        id: 'mock',
        name: 'Simulator & Mock Telephony Provider (for local/MVP testing)',
        transport: 'websocket_media',
        description: 'Simulates inbound and outbound phone calls and enables real-time testing via web stream.',
      },
      {
        id: 'generic_sip',
        name: 'Generic SIP & Telecom Gateway Adapter',
        transport: 'websocket_media',
        description: 'Standard SIP Trunk / Telephony adapter compatible with Egyptian Telecom trunks, FreeSWITCH, Asterisk, Twilio, Telnyx.',
      },
    ],
  });
});

// GET /api/voice/sessions - List voice sessions strictly scoped to the tenant
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const { limit = '50', page = '1' } = req.query as Record<string, string>;

    const rows = await db.select({
      id: voiceSessions.id,
      sessionId: voiceSessions.sessionId,
      organizationId: voiceSessions.organizationId,
      conversationId: voiceSessions.conversationId,
      contactId: voiceSessions.contactId,
      agentId: voiceSessions.agentId,
      status: voiceSessions.status,
      direction: voiceSessions.direction,
      callerNumber: voiceSessions.callerNumber,
      calleeNumber: voiceSessions.calleeNumber,
      provider: voiceSessions.provider,
      durationSeconds: voiceSessions.durationSeconds,
      transcript: voiceSessions.transcript,
      transcriptJson: voiceSessions.transcriptJson,
      summary: voiceSessions.summary,
      errorReason: voiceSessions.errorReason,
      startedAt: voiceSessions.startedAt,
      answeredAt: voiceSessions.answeredAt,
      endedAt: voiceSessions.endedAt,
      createdAt: voiceSessions.createdAt,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
      contactAvatarUrl: contacts.avatarUrl,
    })
      .from(voiceSessions)
      .leftJoin(contacts, eq(voiceSessions.contactId, contacts.id))
      .where(eq(voiceSessions.organizationId, orgId))
      .orderBy(desc(voiceSessions.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    res.json(rows.map(r => {
      let parsedStructuredTranscript = [];
      try {
        parsedStructuredTranscript = r.transcriptJson ? JSON.parse(r.transcriptJson) : [];
      } catch {}

      return {
        id: r.id,
        sessionId: r.sessionId,
        conversationId: r.conversationId,
        status: r.status,
        direction: r.direction,
        callerNumber: r.callerNumber,
        calleeNumber: r.calleeNumber,
        provider: r.provider,
        durationSeconds: r.durationSeconds,
        transcript: r.transcript,
        transcriptStructured: parsedStructuredTranscript,
        summary: r.summary,
        errorReason: r.errorReason,
        startedAt: r.startedAt,
        answeredAt: r.answeredAt,
        endedAt: r.endedAt,
        createdAt: r.createdAt,
        contact: r.contactId ? {
          id: r.contactId,
          firstName: r.contactFirstName,
          lastName: r.contactLastName,
          avatarUrl: r.contactAvatarUrl,
        } : null,
      };
    }));
  } catch (err) {
    console.error('List voice sessions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/voice/sessions/:id - Get single voice session with strict tenant isolation
router.get('/sessions/:id', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const sessionIdentifier = String(req.params.id);

    const condition = !Number.isNaN(Number(sessionIdentifier))
      ? eq(voiceSessions.id, Number(sessionIdentifier))
      : eq(voiceSessions.sessionId, sessionIdentifier);

    const [row] = await db.select().from(voiceSessions)
      .where(and(condition, eq(voiceSessions.organizationId, orgId)))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: 'Voice session not found' });
      return;
    }

    let parsedTranscript = [];
    try {
      parsedTranscript = row.transcriptJson ? JSON.parse(row.transcriptJson) : [];
    } catch {}

    res.json({
      ...row,
      transcriptStructured: parsedTranscript,
    });
  } catch (err) {
    console.error('Get voice session error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/voice/calls/outbound - Trigger an outbound phone call with tenant & contact validation
router.post('/calls/outbound', requireAuth, async (req, res) => {
  try {
    const { toNumber, fromNumber = '+201000000000', contactId, conversationId, providerId } = req.body ?? {};

    if (!toNumber) {
      res.status(400).json({ error: 'toNumber is required to initiate a call' });
      return;
    }

    const orgId = req.organizationId;
    const normalizedTo = normalizePhoneNumber(String(toNumber));

    // Verify contact belongs to this tenant if provided
    if (contactId) {
      const [c] = await db.select({ id: contacts.id }).from(contacts)
        .where(and(eq(contacts.id, Number(contactId)), eq(contacts.organizationId, orgId)))
        .limit(1);
      if (!c) {
        res.status(403).json({ error: 'Forbidden: Contact does not belong to your organization' });
        return;
      }
    }

    // Verify conversation belongs to this tenant if provided
    if (conversationId) {
      const [conv] = await db.select({ id: conversations.id }).from(conversations)
        .where(and(eq(conversations.id, Number(conversationId)), eq(conversations.organizationId, orgId)))
        .limit(1);
      if (!conv) {
        res.status(403).json({ error: 'Forbidden: Conversation does not belong to your organization' });
        return;
      }
    }

    const result = await voiceService.startOutboundCall({
      organizationId: orgId,
      agentId: req.userId,
      fromNumber: String(fromNumber),
      toNumber: normalizedTo,
      contactId: contactId ? Number(contactId) : undefined,
      conversationId: conversationId ? Number(conversationId) : undefined,
      providerId: providerId ? String(providerId) : undefined,
    });

    res.status(201).json(result);
  } catch (err: any) {
    console.error('Outbound call error:', err);
    res.status(500).json({ error: err.message || 'Failed to initiate outbound call' });
  }
});

// POST /api/voice/calls/:sessionId/hangup - Hang up an active call with tenant check
router.post('/calls/:sessionId/hangup', requireAuth, async (req, res) => {
  try {
    const sessionId = String(req.params.sessionId);
    const orgId = req.organizationId;

    // Verify session belongs to requesting organization
    const active = voiceService.getActiveSession(sessionId);
    if (active && active.organizationId !== orgId && req.role !== 'superadmin') {
      res.status(403).json({ error: 'Forbidden: Cannot hang up call belonging to another organization' });
      return;
    }

    await voiceService.endVoiceSession(sessionId, 'completed');
    res.json({ success: true, message: 'Call ended' });
  } catch (err: any) {
    console.error('Hangup error:', err);
    res.status(500).json({ error: err.message || 'Failed to hang up call' });
  }
});

// POST /api/voice/webhook/inbound - Inbound Call Webhook for Telephony / SIP Gateways
router.post('/webhook/inbound', async (req, res) => {
  try {
    const providerId = (req.query.provider as string) || undefined;
    const result = await voiceService.handleInboundCall(req.body, req.headers, providerId);
    
    res.status(200).json({
      status: 'accepted',
      sessionId: result.sessionId,
      conversationId: result.conversationId,
      mediaTicket: result.mediaTicket,
      streamUrl: result.streamUrl,
    });
  } catch (err: any) {
    console.error('Inbound voice webhook error:', err);
    res.status(400).json({ error: err.message || 'Failed to process inbound call webhook' });
  }
});

export default router;
