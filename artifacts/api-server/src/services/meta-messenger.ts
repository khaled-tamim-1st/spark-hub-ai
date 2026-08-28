import { db } from '@workspace/db';
import { channels, contacts, conversations, messages } from '@workspace/db';
import { eq, and, or } from 'drizzle-orm';
import { generateAiReply } from './ai-service.js';
import { isInternalNoteContent } from './ai-supervisor/index.js';

export interface MetaConfig {
  pageId?: string;
  accessToken?: string;
  appSecret?: string;
  instagramAccountId?: string;
}

/**
 * Auto-subscribe a Facebook Page to the App's Webhooks via Graph API
 */
export async function subscribePageToWebhooks(pageId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/subscribed_apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscribed_fields: ['messages', 'messaging_postbacks', 'message_deliveries', 'message_reads', 'message_echoes'],
        access_token: accessToken,
      }),
    });
    const data = await res.json() as any;
    console.log(`[Meta Webhook] Subscribed page ${pageId} to webhooks:`, data);
    return data.success === true;
  } catch (err: any) {
    console.error(`[Meta Webhook] Failed to subscribe page ${pageId}:`, err.message || err);
    return false;
  }
}

export async function restoreMetaSubscriptions() {
  try {
    const metaChannels = await db.select().from(channels)
      .where(and(eq(channels.provider, 'meta_graph'), eq(channels.isActive, true)));
    for (const ch of metaChannels) {
      if (ch.config) {
        const parsed = (typeof ch.config === 'string' ? JSON.parse(ch.config) : ch.config) as MetaConfig;
        if (parsed.pageId && parsed.accessToken) {
          console.log(`[Meta Startup] Auto-subscribing Page ${parsed.pageId} (${ch.name}) to webhooks...`);
          await subscribePageToWebhooks(parsed.pageId, parsed.accessToken);
        }
      }
    }
  } catch (err: any) {
    console.error('[Meta Startup] Failed to restore subscriptions:', err.message || err);
  }
}

/**
 * Send a message to Facebook Messenger or Instagram user via Meta Graph API
 */
export async function sendMetaMessage(
  channelId: number,
  recipientId: string,
  text: string,
  options?: { isPrivate?: boolean; messageType?: string }
): Promise<boolean> {
  // ─── Central Outbound Safety Guard (Section 3) ───────────────────────────
  if (options?.isPrivate || options?.messageType === 'internal_note' || isInternalNoteContent(text)) {
    console.error('[CRITICAL SECURITY GUARD] Blocked attempt to send internal note to Meta:', text.substring(0, 80));
    throw new Error('Internal notes cannot be sent externally to Meta');
  }

  try {
    const [channel] = await db.select().from(channels).where(eq(channels.id, channelId)).limit(1);
    if (!channel || !channel.config) {
      console.warn(`[Meta Outgoing] Cannot send message: Channel ${channelId} config not found.`);
      return false;
    }

    const config = (typeof channel.config === 'string' ? JSON.parse(channel.config) : channel.config) as MetaConfig;
    const accessToken = config.accessToken;

    if (!accessToken) {
      console.warn(`[Meta Outgoing] Missing accessToken for channel ${channelId}`);
      return false;
    }

    console.log(`[Meta Outgoing] Sending message to recipient ${recipientId} via Page ${config.pageId}...`);

    const res = await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
        messaging_type: 'RESPONSE',
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error(`[Meta Outgoing] Failed to send message via Graph API (HTTP ${res.status}):`, JSON.stringify(errData));
      return false;
    }

    console.log(`[Meta Outgoing] Message sent successfully to recipient ${recipientId}`);
    return true;
  } catch (err: any) {
    console.error(`[Meta Outgoing] Error:`, err.message || err);
    return false;
  }
}

/**
 * Handle incoming Meta Webhook Event (Messenger & Instagram)
 */
export async function handleMetaWebhookEvent(entry: any) {
  try {
    const pageId = String(entry.id || '');
    console.log(`[Meta Webhook] Processing entry for ID: ${pageId}`);

    // Extract messaging events from entry.messaging OR entry.changes
    const messagingEvents: any[] = [];
    if (Array.isArray(entry.messaging)) {
      messagingEvents.push(...entry.messaging);
    }
    if (Array.isArray(entry.changes)) {
      for (const change of entry.changes) {
        if (change.value) {
          if (Array.isArray(change.value.messages)) {
            messagingEvents.push(...change.value.messages.map((m: any) => ({ ...change.value, message: m })));
          } else if (change.value.message || change.value.postback) {
            messagingEvents.push(change.value);
          }
        }
      }
    }

    if (messagingEvents.length === 0) {
      console.log(`[Meta Webhook] No messaging events found in entry.`);
      return;
    }

    // Find channel matched by pageId, instagramAccountId, or fallback to any active meta channel
    const allChannels = await db.select().from(channels)
      .where(
        or(
          eq(channels.provider, 'meta_graph'),
          eq(channels.channelType, 'messenger'),
          eq(channels.channelType, 'instagram')
        )
      );

    let channel = allChannels.find((ch) => {
      if (!ch.config || !ch.isActive) return false;
      const parsed = (typeof ch.config === 'string' ? JSON.parse(ch.config) : ch.config) as MetaConfig;
      return (
        String(parsed.pageId) === pageId ||
        String(parsed.instagramAccountId) === pageId
      );
    });

    // Fallback: If only 1 active Meta channel exists in DB, use it
    if (!channel) {
      const activeMetaChannels = allChannels.filter(c => c.isActive && (c.provider === 'meta_graph' || c.channelType === 'messenger'));
      if (activeMetaChannels.length === 1) {
        channel = activeMetaChannels[0];
        console.log(`[Meta Webhook] Matched entry ID ${pageId} to single active Meta channel #${channel.id} (${channel.name})`);
      }
    }

    if (!channel) {
      console.warn(`[Meta Webhook] No matching active channel found for Page ID ${pageId}. Available channels:`, allChannels.map(c => ({ id: c.id, name: c.name, type: c.channelType, active: c.isActive })));
      return;
    }

    const orgId = channel.organizationId;
    const config = (typeof channel.config === 'string' ? JSON.parse(channel.config) : channel.config) as MetaConfig;

    for (const event of messagingEvents) {
      const isEcho = Boolean(event.message?.is_echo);
      
      // Determine sender & customer IDs
      // In echo events, sender is page and recipient is the customer
      const senderId = isEcho 
        ? String(event.recipient?.id || event.to?.id || '')
        : String(event.sender?.id || event.from?.id || '');
      
      if (!senderId) {
        console.warn('[Meta Webhook] Missing sender/customer ID in event:', JSON.stringify(event));
        continue;
      }

      // Extract message text and media
      let text = event.message?.text || event.postback?.title || '';
      let mediaUrl: string | null = null;
      let messageType = 'text';

      const attachments = event.message?.attachments;
      if (Array.isArray(attachments) && attachments.length > 0) {
        const att = attachments[0];
        messageType = att.type || 'image';
        mediaUrl = att.payload?.url || null;
        if (!text) {
          text = messageType === 'image' ? '📷 [Image / صورة]' 
               : messageType === 'audio' ? '🎵 [Voice Note / رسالة صوتية]'
               : messageType === 'video' ? '🎥 [Video / فيديو]'
               : messageType === 'file'  ? '📄 [Document / مستند]'
               : `[${messageType}]`;
        }
      }

      if (event.message?.sticker_id) {
        messageType = 'sticker';
        if (!text) text = '🏷️ [Sticker / ملصق]';
      }

      if (!text.trim()) continue;

      const messageExternalId = event.message?.mid || event.id || `meta_${Date.now()}`;

      // 1. Find or create Contact by senderId (customer ID)
      let [contact] = await db.select().from(contacts)
        .where(and(eq(contacts.organizationId, orgId), eq(contacts.phone, senderId)))
        .limit(1);

      let contactName = 'Messenger User';

      if (!contact) {
        let firstName = 'Messenger';
        let lastName = 'User';
        let avatarUrl: string | undefined = undefined;

        if (config.accessToken && !isEcho) {
          try {
            const userRes = await fetch(`https://graph.facebook.com/v19.0/${senderId}?fields=first_name,last_name,profile_pic&access_token=${config.accessToken}`);
            if (userRes.ok) {
              const userData = await userRes.json() as any;
              firstName = userData.first_name || firstName;
              lastName = userData.last_name || lastName;
              avatarUrl = userData.profile_pic || undefined;
            }
          } catch {}
        }

        contactName = `${firstName} ${lastName}`.trim();

        [contact] = await db.insert(contacts).values({
          organizationId: orgId,
          firstName,
          lastName,
          phone: senderId,
          avatarUrl,
          lastActivityAt: new Date(),
        }).returning();
      } else {
        contactName = `${contact.firstName} ${contact.lastName}`.trim();
        await db.update(contacts).set({
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(contacts.id, contact.id));
      }

      // 2. Find or create Conversation
      let [conv] = await db.select().from(conversations)
        .where(and(
          eq(conversations.organizationId, orgId),
          eq(conversations.channelId, channel.id),
          eq(conversations.contactId, contact.id)
        ))
        .limit(1);

      if (!conv) {
        [conv] = await db.insert(conversations).values({
          organizationId: orgId,
          channelId: channel.id,
          contactId: contact.id,
          channelType: channel.channelType || 'messenger',
          subject: `${channel.channelType === 'instagram' ? 'Instagram' : 'Messenger'} • ${contactName}`,
          status: 'open',
          unreadCount: isEcho ? 0 : 1,
          lastMessage: text.substring(0, 200),
          lastMessageAt: new Date(),
          aiHandled: false,
        }).returning();
      } else {
        await db.update(conversations).set({
          status: conv.status === 'closed' ? 'open' : conv.status,
          unreadCount: isEcho ? 0 : (conv.unreadCount + 1),
          lastMessage: text.substring(0, 200),
          lastMessageAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(conversations.id, conv.id));
      }

      // 3. Insert Message
      const [existingMsg] = await db.select({ id: messages.id }).from(messages)
        .where(and(eq(messages.conversationId, conv.id), eq(messages.externalId, messageExternalId)))
        .limit(1);

      if (!existingMsg) {
        await db.insert(messages).values({
          conversationId: conv.id,
          senderType: isEcho ? 'agent' : 'contact',
          senderName: isEcho ? 'Agent (Facebook Page)' : contactName,
          content: text,
          mediaUrl,
          messageType,
          status: isEcho ? 'sent' : 'received',
          externalId: messageExternalId,
        });
      }

      console.log(`[Meta Webhook] Ingested ${isEcho ? 'Page Echo (Agent)' : 'Customer'} message from ${contactName} (${senderId}): "${text.substring(0, 50)}"`);

      // 4. Trigger AI Auto-reply ONLY on customer incoming messages
      if (!isEcho) {
        const aiReply = await generateAiReply({
          organizationId: orgId,
          customerName: contactName,
          incomingText: text,
        });

        if (aiReply) {
          console.log(`[Meta AI] Sending auto-reply to ${senderId}...`);
          const sent = await sendMetaMessage(channel.id, senderId, aiReply);

          if (sent) {
            await db.insert(messages).values({
              conversationId: conv.id,
              senderType: 'ai',
              senderName: 'AI Assistant',
              content: aiReply,
              messageType: 'text',
              status: 'sent',
            });

            await db.update(conversations).set({
              lastMessage: aiReply.substring(0, 200),
              lastMessageAt: new Date(),
              aiHandled: true,
              updatedAt: new Date(),
            }).where(eq(conversations.id, conv.id));
          }
        }
      }
    }
  } catch (err: any) {
    console.error('[Meta Webhook] Error processing entry:', err.message || err);
  }
}
