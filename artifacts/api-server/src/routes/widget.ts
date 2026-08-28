import { Router, type IRouter, type Request, type Response } from 'express';
import { eq, and, ne, desc, asc } from 'drizzle-orm';
import { db } from '@workspace/db';
import { channels, organizations, contacts, conversations, messages } from '@workspace/db/schema';
import { generateAiReplyDetailed } from '../services/ai-service.js';
import {
  dispatchSupervisorInspection,
  CUSTOMER_HANDOFF_TEXT,
  HUMAN_REQUEST_REPLY,
  isHumanAgentRequested,
  handleImmediateHumanHandoff,
  isInternalNoteContent,
} from '../services/ai-supervisor/index.js';

const router: IRouter = Router();

async function getOrCreateDefaultChannel(channelId?: number) {
  let channel: any = null;

  // 1. If explicit valid channelId provided, find it
  if (channelId && !isNaN(channelId)) {
    [channel] = await db.select().from(channels).where(eq(channels.id, channelId)).limit(1);
  }

  // 2. Otherwise, look for an active 'web' widget channel
  if (!channel) {
    [channel] = await db.select().from(channels)
      .where(and(eq(channels.channelType, 'web'), eq(channels.isActive, true)))
      .limit(1);
  }

  // 3. Otherwise, look for any 'web' channel
  if (!channel) {
    [channel] = await db.select().from(channels).where(eq(channels.channelType, 'web')).limit(1);
  }

  // 4. Otherwise, look for any channel at all
  if (!channel) {
    [channel] = await db.select().from(channels).limit(1);
  }

  // 5. If no channel exists at all, find the first organization or create one
  if (!channel) {
    let [firstOrg] = await db.select().from(organizations).orderBy(asc(organizations.id)).limit(1);
    if (!firstOrg) {
      [firstOrg] = await db.insert(organizations).values({
        name: 'ECOMATE AI',
        slug: 'ecomate-ai',
        aiEnabled: true,
      }).returning();
    }

    const [newChannel] = await db.insert(channels).values({
      organizationId: firstOrg.id,
      name: 'ودجت الشات الرئيسي (ECOMATE)',
      channelType: 'web',
      provider: 'web_widget',
      isActive: true,
      config: JSON.stringify({
        widgetName: 'مساعد ECOMATE الذكي',
        welcomeMessage: 'أهلاً بك في ECOMATE 👋 كيف يمكننا مساعدتك اليوم؟',
        primaryColor: '#3B4FE8',
        position: 'left',
      }),
    }).returning();
    channel = newChannel;
  }
  return channel;
}

/**
 * GET /api/widget/config/:channelId
 * Public endpoint to fetch widget configuration
 */
router.get('/config/:channelId', async (req: Request, res: Response): Promise<void> => {
  try {
    const channelId = Number(req.params.channelId);
    const channel = await getOrCreateDefaultChannel(channelId);

    const [org] = await db.select({ id: organizations.id, name: organizations.name })
      .from(organizations).where(eq(organizations.id, channel.organizationId)).limit(1);

    let config: Record<string, any> = {};
    if (channel.config) {
      if (typeof channel.config === 'object') {
        config = channel.config as Record<string, any>;
      } else {
        try {
          config = JSON.parse(String(channel.config));
        } catch {
          config = {};
        }
      }
    }

    res.json({
      channelId: channel.id,
      organizationId: channel.organizationId,
      organizationName: org?.name || 'خدمة العملاء',
      widgetName: config.widgetName || channel.name || 'مساعد المتجر الذكي',
      welcomeMessage: config.welcomeMessage || 'أهلاً بك 👋 كيف يمكننا مساعدتك اليوم؟',
      primaryColor: config.primaryColor || '#3B4FE8',
      position: config.position || 'right',
      showAvatar: config.showAvatar ?? true,
      botName: config.botName || 'المساعد الذكي',
    });
  } catch (err: any) {
    console.error('[Widget API] Error fetching config:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/widget/session
 * Public endpoint to start or restore a visitor session
 */
router.post('/session', async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId, visitorId, name = 'زائر الموقع', phone, email } = req.body ?? {};

    const numericChannelId = Number(channelId) || 1;
    const channel = await getOrCreateDefaultChannel(numericChannelId);
    const orgId = channel.organizationId;
    const finalVisitorId = visitorId || `visitor_${Math.random().toString(36).substring(2, 11)}`;

    // 1. Find or create Contact
    let contactId: number;
    const [existingContact] = await db.select({ id: contacts.id })
      .from(contacts)
      .where(and(eq(contacts.organizationId, orgId), eq(contacts.phone, finalVisitorId)))
      .limit(1);

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      const [newContact] = await db.insert(contacts).values({
        organizationId: orgId,
        firstName: name || 'زائر',
        lastName: 'الموقع',
        phone: phone || finalVisitorId,
        email: email || `${finalVisitorId}@widget.visitor`,
        lastActivityAt: new Date(),
      }).returning({ id: contacts.id });
      contactId = newContact.id;
    }

    // 2. Find or create Open Conversation
    let conversationId: number;
    const [existingConv] = await db.select({ id: conversations.id })
      .from(conversations)
      .where(and(
        eq(conversations.organizationId, orgId),
        eq(conversations.contactId, contactId),
        eq(conversations.status, 'open')
      ))
      .limit(1);

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      const [newConv] = await db.insert(conversations).values({
        organizationId: orgId,
        channelId: channel.id,
        contactId,
        channelType: 'web',
        subject: `محادثة موقع • ${name || 'زائر'}`,
        status: 'open',
        lastMessageAt: new Date(),
      }).returning({ id: conversations.id });
      conversationId = newConv.id;
    }

    // 3. Fetch past messages (INTERNAL NOTES STRICTLY EXCLUDED FROM CUSTOMER SESSIONS)
    const messageRows = await db.select().from(messages)
      .where(and(
        eq(messages.conversationId, conversationId),
        eq(messages.isPrivate, false),
        ne(messages.messageType, 'internal_note')
      ))
      .orderBy(asc(messages.createdAt));

    res.json({
      success: true,
      visitorId: finalVisitorId,
      conversationId,
      messages: messageRows.map(m => ({
        id: m.id,
        senderType: m.senderType,
        senderName: m.senderName,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (err: any) {
    console.error('[Widget API] Session error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/widget/messages/:conversationId
 * Public endpoint to poll latest messages for a conversation
 * (INTERNAL NOTES STRICTLY EXCLUDED FROM CUSTOMER POLLING)
 */
router.get('/messages/:conversationId', async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationId = Number(req.params.conversationId);
    const afterId = Number(req.query.afterId) || 0;

    if (!conversationId || isNaN(conversationId)) {
      res.status(400).json({ error: 'Invalid conversationId' });
      return;
    }

    const messageRows = await db.select().from(messages)
      .where(and(
        eq(messages.conversationId, conversationId),
        eq(messages.isPrivate, false),
        ne(messages.messageType, 'internal_note')
      ))
      .orderBy(asc(messages.createdAt));

    const filtered = afterId > 0 ? messageRows.filter(m => m.id > afterId) : messageRows;

    res.json({
      success: true,
      messages: filtered.map(m => ({
        id: m.id,
        senderType: m.senderType,
        senderName: m.senderName,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (err: any) {
    console.error('[Widget API] Polling error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/widget/messages
 * Public endpoint to send a message from the visitor, with AI auto-response
 */
router.post('/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    let { conversationId, channelId = 1, visitorId, content, visitorName = 'زائر الموقع' } = req.body ?? {};

    if (!content || !String(content).trim()) {
      res.status(400).json({ error: 'content is required' });
      return;
    }

    let numericConvId = Number(conversationId);
    let conv: any = null;

    if (numericConvId && !isNaN(numericConvId)) {
      [conv] = await db.select().from(conversations).where(eq(conversations.id, numericConvId)).limit(1);
    }

    // Auto-resolve or create conversation if ID wasn't provided or found
    if (!conv) {
      const channel = await getOrCreateDefaultChannel(Number(channelId) || 1);
      const orgId = channel.organizationId;
      const finalVisitorId = visitorId || `visitor_${Math.random().toString(36).substring(2, 11)}`;

      let contactId: number;
      const [existingContact] = await db.select({ id: contacts.id })
        .from(contacts)
        .where(and(eq(contacts.organizationId, orgId), eq(contacts.phone, finalVisitorId)))
        .limit(1);

      if (existingContact) {
        contactId = existingContact.id;
      } else {
        const [newContact] = await db.insert(contacts).values({
          organizationId: orgId,
          firstName: visitorName || 'زائر',
          lastName: 'الموقع',
          phone: finalVisitorId,
          email: `${finalVisitorId}@widget.visitor`,
          lastActivityAt: new Date(),
        }).returning({ id: contacts.id });
        contactId = newContact.id;
      }

      const [existingConv] = await db.select()
        .from(conversations)
        .where(and(
          eq(conversations.organizationId, orgId),
          eq(conversations.contactId, contactId),
          eq(conversations.status, 'open')
        ))
        .limit(1);

      if (existingConv) {
        conv = existingConv;
        numericConvId = existingConv.id;
      } else {
        const [newConv] = await db.insert(conversations).values({
          organizationId: orgId,
          channelId: channel.id,
          contactId,
          channelType: 'web',
          subject: `محادثة موقع • ${visitorName || 'زائر'}`,
          status: 'open',
          lastMessageAt: new Date(),
        }).returning();
        conv = newConv;
        numericConvId = newConv.id;
      }
    }

    const orgId = conv.organizationId;
    const cleanContent = String(content).trim();

    // 1. Insert visitor message
    const [userMsg] = await db.insert(messages).values({
      conversationId: numericConvId,
      senderType: 'contact',
      senderName: visitorName,
      content: cleanContent,
      messageType: 'text',
      status: 'delivered',
    }).returning();

    // 2. Update conversation
    await db.update(conversations).set({
      lastMessage: cleanContent.substring(0, 200),
      lastMessageAt: new Date(),
      unreadCount: (conv.unreadCount || 0) + 1,
      updatedAt: new Date(),
    }).where(eq(conversations.id, numericConvId));

    // ─── Instant Human Agent Request Detection (Supervisor Fast-Path) ──────
    if (isHumanAgentRequested(cleanContent)) {
      console.log(`[Widget API] Human agent requested: "${cleanContent}". Disarming AI & responding with handoff.`);
      const { handoffMessage } = await handleImmediateHumanHandoff({
        conversationId: numericConvId,
        incomingText: cleanContent,
      });

      res.json({
        success: true,
        conversationId: numericConvId,
        userMessage: {
          id: userMsg.id,
          senderType: userMsg.senderType,
          senderName: userMsg.senderName,
          content: userMsg.content,
          createdAt: userMsg.createdAt,
        },
        aiMessage: {
          id: handoffMessage.id,
          senderType: handoffMessage.senderType,
          senderName: handoffMessage.senderName,
          content: handoffMessage.content,
          createdAt: handoffMessage.createdAt,
        },
      });
      return;
    }

    // ─── Dispatch AI Operations Supervisor (Non-blocking) ─────────────────
    dispatchSupervisorInspection({
      organizationId: orgId,
      conversationId: numericConvId,
      contactId: conv.contactId,
      messageId: userMsg.id,
      channelType: 'web',
      incomingText: cleanContent,
      customerName: visitorName,
    });

    // 3. Trigger AI Auto-Reply if enabled (with Critical Safety Gate)
    let botReplyMsg: any = null;
    try {
      // Critical Safety Gate: If conversation was set to manual/escalated, send handoff message only
      const [latestConv] = await db.select({ aiHandled: conversations.aiHandled })
        .from(conversations).where(eq(conversations.id, numericConvId)).limit(1);

      if (latestConv && !latestConv.aiHandled) {
        console.log(`[Widget API] Safety Gate: Conv #${numericConvId} is manual/escalated. Providing handoff notice.`);
        const [savedHandoff] = await db.insert(messages).values({
          conversationId: numericConvId,
          senderType: 'ai',
          senderName: 'فريق الدعم (Support)',
          content: CUSTOMER_HANDOFF_TEXT,
          messageType: 'text',
          isPrivate: false,
          status: 'delivered',
        }).returning();
        botReplyMsg = savedHandoff;
      } else {
        // Build conversation history (INTERNAL NOTES STRICTLY EXCLUDED)
        const pastMessages = await db.select({ senderType: messages.senderType, content: messages.content })
          .from(messages)
          .where(and(
            eq(messages.conversationId, numericConvId),
            eq(messages.isPrivate, false),
            ne(messages.messageType, 'internal_note')
          ))
          .orderBy(desc(messages.createdAt))
          .limit(10);

        const formattedHistory: Array<{ sender: string; text: string }> = pastMessages.reverse().map(m => ({
          sender: m.senderType === 'contact' ? 'العميل' : 'المساعد',
          text: m.content,
        }));

        const aiResult = await generateAiReplyDetailed({
          organizationId: orgId,
          customerName: visitorName,
          incomingText: cleanContent,
          conversationHistory: formattedHistory,
          forceGenerate: true,
        });

        // Re-check safety gate right before committing the reply
        const [recheckConv] = await db.select({ aiHandled: conversations.aiHandled })
          .from(conversations).where(eq(conversations.id, numericConvId)).limit(1);

        if (!recheckConv || recheckConv.aiHandled) {
          if (aiResult.success && aiResult.reply && aiResult.reply.trim()) {
            // Outbound content safety guard: ensure no internal supervisor text leaks
            let replyToSend = aiResult.reply.trim();
            if (isInternalNoteContent(replyToSend)) {
              console.error('[CRITICAL SECURITY] Blocked leaked internal note from AI reply. Falling back to handoff text.');
              replyToSend = CUSTOMER_HANDOFF_TEXT;
            }

            const [savedAiMsg] = await db.insert(messages).values({
              conversationId: numericConvId,
              senderType: 'ai',
              senderName: 'المساعد الذكي (ECOMATE)',
              content: replyToSend,
              messageType: 'text',
              isPrivate: false,
              status: 'delivered',
            }).returning();

            botReplyMsg = savedAiMsg;

            await db.update(conversations).set({
              lastMessage: replyToSend.substring(0, 200),
              lastMessageAt: new Date(),
              aiHandled: true,
              updatedAt: new Date(),
            }).where(eq(conversations.id, numericConvId));
          }
        } else {
          // If escalated during generation, send handoff message
          const [savedHandoff] = await db.insert(messages).values({
            conversationId: numericConvId,
            senderType: 'ai',
            senderName: 'فريق الدعم (Support)',
            content: CUSTOMER_HANDOFF_TEXT,
            messageType: 'text',
            isPrivate: false,
            status: 'delivered',
          }).returning();
          botReplyMsg = savedHandoff;
        }
      }
    } catch (aiErr) {
      console.warn('[Widget API] AI generation skipped or failed:', aiErr);
    }

    // Never return internal notes in response payload
    if (botReplyMsg && (botReplyMsg.isPrivate || botReplyMsg.messageType === 'internal_note' || isInternalNoteContent(botReplyMsg.content))) {
      botReplyMsg = null;
    }

    res.json({
      success: true,
      conversationId: numericConvId,
      userMessage: {
        id: userMsg.id,
        senderType: userMsg.senderType,
        senderName: userMsg.senderName,
        content: userMsg.content,
        createdAt: userMsg.createdAt,
      },
      aiMessage: botReplyMsg ? {
        id: botReplyMsg.id,
        senderType: botReplyMsg.senderType,
        senderName: botReplyMsg.senderName,
        content: botReplyMsg.content,
        createdAt: botReplyMsg.createdAt,
      } : null,
    });
  } catch (err: any) {
    console.error('[Widget API] Send message error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
