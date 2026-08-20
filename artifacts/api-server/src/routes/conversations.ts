import { Router } from 'express';
import { db } from '@workspace/db';
import { conversations, contacts, messages, users, channels } from '@workspace/db';
import { eq, and, desc, asc } from 'drizzle-orm';
import { requireAuth } from '../middlewares/auth.js';
import { sendWhatsAppMessage } from '../services/whatsapp-web.js';
import { sendMetaMessage } from '../services/meta-messenger.js';

const router = Router();

// GET /api/conversations
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, page = '1', limit = '50' } = req.query as Record<string, string>;
    const orgId = req.organizationId;
    const conditions = [eq(conversations.organizationId, orgId)];
    if (status && status !== 'all') conditions.push(eq(conversations.status, status));

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
      .where(and(...conditions))
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
    const [existing] = await db.select({ id: conversations.id }).from(conversations)
      .where(and(eq(conversations.id, Number(req.params.id)), eq(conversations.organizationId, req.organizationId)))
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

// DELETE /api/conversations/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select({ id: conversations.id }).from(conversations)
      .where(and(eq(conversations.id, Number(req.params.id)), eq(conversations.organizationId, req.organizationId)))
      .limit(1);
    if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
    await db.delete(conversations).where(eq(conversations.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// GET /api/conversations/:id/messages
router.get('/:id/messages', requireAuth, async (req, res) => {
  try {
    const orgId = req.organizationId;
    const [conv] = await db.select({ id: conversations.id }).from(conversations)
      .where(and(eq(conversations.id, Number(req.params.id)), eq(conversations.organizationId, orgId)))
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
    
    const [conv] = await db.select({ 
      id: conversations.id,
      channelType: conversations.channelType,
      channelId: conversations.channelId,
      contactId: conversations.contactId,
    }).from(conversations)
      .where(and(eq(conversations.id, convId), eq(conversations.organizationId, orgId)))
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

export default router;
