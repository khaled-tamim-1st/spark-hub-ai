import { Router } from 'express';
import { db } from '@workspace/db';
import { conversations, contacts, messages, users, channels } from '@workspace/db';
import { eq, and, or, ne, lt, desc, asc, sql } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';
import { sendWhatsAppMessage } from '../services/whatsapp-web.js';
import { sendMetaMessage } from '../services/meta-messenger.js';
import { getSupervisorStats } from '../services/ai-supervisor/index.js';

const router = Router();

// GET /api/conversations
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, page = '1', limit = '50' } = req.query as Record<string, string>;
    const orgId = req.organizationId;
    const isSuperAdmin = req.role === 'superadmin';
    const conditions: any[] = [];
    
    if (!isSuperAdmin && orgId) {
      conditions.push(or(eq(conversations.organizationId, orgId), eq(conversations.channelType, 'web')));
    }

    if (status === 'trash') {
      conditions.push(eq(conversations.status, 'trash'));
    } else {
      // Exclude trash from normal views (all, open, resolved, etc.)
      conditions.push(ne(conversations.status, 'trash'));
      if (status && status !== 'all') {
        conditions.push(eq(conversations.status, status));
      }
    }

    const rows = await db.select({
      id: conversations.id,
      status: conversations.status,
      channelType: conversations.channelType,
      channelId: conversations.channelId,
      subject: conversations.subject,
      lastMessage: conversations.lastMessage,
      lastMessageAt: conversations.lastMessageAt,
      unreadCount: conversations.unreadCount,
      aiHandled: conversations.aiHandled,
      assigneeId: conversations.assigneeId,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      contactId: contacts.id,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
      contactAvatarUrl: contacts.avatarUrl,
    })
      .from(conversations)
      .leftJoin(contacts, eq(conversations.contactId, contacts.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(conversations.lastMessageAt), desc(conversations.createdAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    res.json(rows.map((r) => ({
      id: r.id, status: r.status, channelType: r.channelType,
      channelId: r.channelId, subject: r.subject,
      lastMessage: r.lastMessage, lastMessageAt: r.lastMessageAt,
      unreadCount: r.unreadCount, aiHandled: r.aiHandled,
      assigneeId: r.assigneeId, createdAt: r.createdAt, updatedAt: r.updatedAt,
      contact: r.contactId ? {
        id: r.contactId, firstName: r.contactFirstName!,
        lastName: r.contactLastName!, avatarUrl: r.contactAvatarUrl,
      } : null,
    })));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/conversations/trash/count
router.get('/trash/count', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const isSuperAdmin = req.role === 'superadmin';
    const conditions: any[] = [eq(conversations.status, 'trash')];
    if (!isSuperAdmin && orgId) {
      conditions.push(or(eq(conversations.organizationId, orgId), eq(conversations.channelType, 'web')));
    }
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(conversations)
      .where(and(...conditions));
    res.json({ count: Number(countResult?.count || 0) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/conversations/supervisor/stats (Section 17: Supervisor Activity Metrics)
router.get('/supervisor/stats', requireAuth, async (req, res) => {
  try {
    const stats = await getSupervisorStats(req.organizationId || 1);
    res.json(stats);
  } catch (err: any) {
    console.error('[Supervisor API] Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/conversations/trash/empty (Empty Trash - Admin only)
router.delete('/trash/empty', requireAuth, async (req, res) => {
  try {
    const isSuperAdmin = req.role === 'superadmin';
    const isOrgAdmin = req.role === 'owner' || req.role === 'admin';
    if (!isSuperAdmin && !isOrgAdmin) {
      res.status(403).json({ error: 'Forbidden: Admin privileges required to empty trash' });
      return;
    }
    const conditions: any[] = [eq(conversations.status, 'trash')];
    if (!isSuperAdmin && req.organizationId) {
      conditions.push(or(eq(conversations.organizationId, req.organizationId), eq(conversations.channelType, 'web')));
    }
    await db.delete(conversations).where(and(...conditions));
    res.json({ success: true, message: 'Trash emptied successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/conversations/:id/restore (Restore from Trash)
router.post('/:id/restore', requireAuth, async (req, res) => {
  try {
    const isSuperAdmin = req.role === 'superadmin';
    const whereCond = isSuperAdmin
      ? eq(conversations.id, Number(req.params.id))
      : and(eq(conversations.id, Number(req.params.id)), or(eq(conversations.organizationId, req.organizationId), eq(conversations.channelType, 'web')));

    const [existing] = await db.select().from(conversations).where(whereCond).limit(1);
    if (!existing) { res.status(404).json({ error: 'Conversation not found' }); return; }

    const [updated] = await db.update(conversations).set({
      status: 'open',
      updatedAt: new Date(),
    }).where(eq(conversations.id, Number(req.params.id))).returning();

    res.json({ success: true, conversation: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/conversations
router.post('/', requireAuth, async (req, res) => {
  try {
    const { channelType = 'web', contactId, channelId, subject, assigneeId } = req.body ?? {};
    const [row] = await db.insert(conversations).values({
      organizationId: req.organizationId,
      channelType: String(channelType),
      contactId: contactId ? Number(contactId) : undefined,
      channelId: channelId ? Number(channelId) : undefined,
      subject: subject ? String(subject) : undefined,
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
    }).returning();
    res.status(201).json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// PATCH /api/conversations/:id
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const isSuperAdmin = req.role === 'superadmin';
    const whereCond = isSuperAdmin
      ? eq(conversations.id, Number(req.params.id))
      : and(eq(conversations.id, Number(req.params.id)), or(eq(conversations.organizationId, req.organizationId), eq(conversations.channelType, 'web')));

    const [existing] = await db.select({ id: conversations.id }).from(conversations)
      .where(whereCond)
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    const { status, assigneeId, aiHandled } = req.body ?? {};
    const [row] = await db.update(conversations).set({
      ...(status && { status: String(status) }),
      ...(assigneeId !== undefined && { assigneeId: assigneeId ? Number(assigneeId) : null }),
      ...(aiHandled !== undefined && { aiHandled: Boolean(aiHandled) }),
      updatedAt: new Date(),
    }).where(eq(conversations.id, Number(req.params.id))).returning();
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// DELETE /api/conversations/:id (Soft-delete by default, Permanent if ?permanent=true)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const isSuperAdmin = req.role === 'superadmin';
    const isOrgAdmin = req.role === 'owner' || req.role === 'admin';
    const isPermanent = req.query.permanent === 'true';

    const whereCond = isSuperAdmin
      ? eq(conversations.id, Number(req.params.id))
      : and(eq(conversations.id, Number(req.params.id)), or(eq(conversations.organizationId, req.organizationId), eq(conversations.channelType, 'web')));

    const [existing] = await db.select({ id: conversations.id, status: conversations.status }).from(conversations)
      .where(whereCond)
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }

    if (isPermanent) {
      if (!isSuperAdmin && !isOrgAdmin) {
        res.status(403).json({ error: 'Forbidden: Admin privileges required for permanent deletion' });
        return;
      }
      await db.delete(conversations).where(eq(conversations.id, Number(req.params.id)));
      res.json({ success: true, permanent: true });
    } else {
      // Soft-delete to trash
      const [trashed] = await db.update(conversations).set({
        status: 'trash',
        updatedAt: new Date(),
      }).where(eq(conversations.id, Number(req.params.id))).returning();
      res.json({ success: true, permanent: false, conversation: trashed });
    }
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/conversations/:id/messages
router.get('/:id/messages', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const isSuperAdmin = req.role === 'superadmin';
    const whereCond = isSuperAdmin
      ? eq(conversations.id, Number(req.params.id))
      : and(eq(conversations.id, Number(req.params.id)), or(eq(conversations.organizationId, orgId), eq(conversations.channelType, 'web')));

    const [conv] = await db.select({ id: conversations.id }).from(conversations)
      .where(whereCond)
      .limit(1);
    if (!conv) { res.status(404).json({ error: 'Not found' }); return; }
    const msgs = await db.select().from(messages)
      .where(eq(messages.conversationId, Number(req.params.id)))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// POST /api/conversations/:id/messages
router.post('/:id/messages', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const convId = Number(req.params.id);
    const { content, messageType = 'text', isPrivate = false } = req.body ?? {};
    if (!content) { res.status(400).json({ error: 'Content is required' }); return; }
    
    const isSuperAdmin = req.role === 'superadmin';
    const whereCond = isSuperAdmin
      ? eq(conversations.id, convId)
      : and(eq(conversations.id, convId), or(eq(conversations.organizationId, orgId), eq(conversations.channelType, 'web')));

    const [conv] = await db.select({ 
      id: conversations.id,
      channelType: conversations.channelType,
      channelId: conversations.channelId,
      contactId: conversations.contactId,
    }).from(conversations)
      .where(whereCond)
      .limit(1);

    if (!conv) { res.status(404).json({ error: 'Not found' }); return; }
    
    const [user] = await db.select({ firstName: users.firstName, lastName: users.lastName })
      .from(users).where(eq(users.id, req.userId)).limit(1);

    const [msg] = await db.insert(messages).values({
      conversationId: convId,
      senderType: 'agent',
      senderId: req.userId,
      senderName: user ? `${user.firstName} ${user.lastName}` : undefined,
      content: String(content),
      messageType: String(messageType),
      isPrivate: Boolean(isPrivate),
      status: 'sent',
    }).returning();

    await db.update(conversations).set({
      lastMessage: String(content).substring(0, 200),
      lastMessageAt: new Date(),
      unreadCount: 0,
      updatedAt: new Date(),
    }).where(eq(conversations.id, convId));

    // Send through WhatsApp socket if not private and channel is WhatsApp
    if (!isPrivate && conv.channelType === 'whatsapp' && conv.contactId) {
      const [contact] = await db.select({ phone: contacts.phone }).from(contacts)
        .where(eq(contacts.id, conv.contactId)).limit(1);
      
      if (contact?.phone) {
        console.log(`[Conversations] Sending WhatsApp reply to ${contact.phone}...`);
        await sendWhatsAppMessage(conv.channelId || 1, contact.phone, String(content));
      }
    }

    // Send through Meta Graph API if channel is messenger or instagram
    if (!isPrivate && (conv.channelType === 'messenger' || conv.channelType === 'instagram') && conv.contactId) {
      const [contact] = await db.select({ phone: contacts.phone }).from(contacts)
        .where(eq(contacts.id, conv.contactId)).limit(1);

      if (contact?.phone) {
        let metaChannelId = conv.channelId;
        if (!metaChannelId) {
          const [found] = await db.select({ id: channels.id }).from(channels)
            .where(and(eq(channels.organizationId, req.organizationId), eq(channels.provider, 'meta_graph'), eq(channels.isActive, true)))
            .limit(1);
          metaChannelId = found?.id;
        }

        if (metaChannelId) {
          console.log(`[Conversations] Sending Meta reply via channel ${metaChannelId} to ${contact.phone}...`);
          await sendMetaMessage(metaChannelId, contact.phone, String(content));
        } else {
          console.warn(`[Conversations] Cannot send Meta reply: No active Meta channel found.`);
        }
      }
    }

    res.status(201).json(msg);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// Auto-cleanup: periodically permanently delete conversations in trash older than 30 days
export async function cleanupExpiredTrash(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await db.delete(conversations).where(
      and(
        eq(conversations.status, 'trash'),
        lt(conversations.updatedAt, thirtyDaysAgo)
      )
    );
    console.log('[Trash Cleanup] Expired trash check completed.');
    return 0;
  } catch (err) {
    console.error('[Trash Cleanup] Error during automatic trash cleanup:', err);
    return 0;
  }
}

// Run cleanup once on startup and then every 24 hours
cleanupExpiredTrash().catch(() => {});
setInterval(() => {
  cleanupExpiredTrash().catch(() => {});
}, 24 * 60 * 60 * 1000);

export default router;

