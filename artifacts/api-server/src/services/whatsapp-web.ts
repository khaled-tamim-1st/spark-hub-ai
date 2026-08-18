import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import makeWASocket, {
  Browsers,
  DisconnectReason,
  downloadMediaMessage,
  useMultiFileAuthState,
  type WASocket,
  type WAMessage,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import { db } from '@workspace/db';
import { channels, contacts, conversations, messages } from '@workspace/db';
import { eq, and } from 'drizzle-orm';
import { generateAiReply } from './ai-service.js';

export type WhatsAppWebStatus =
  | 'idle'
  | 'connecting'
  | 'qr'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface WhatsAppWebSnapshot {
  status: WhatsAppWebStatus;
  qrCode?: string;
  phoneNumber?: string;
  error?: string;
  updatedAt: string;
}

interface SessionState {
  socket?: WASocket;
  snapshot: WhatsAppWebSnapshot;
  stopping?: boolean;
  reconnectAttempts?: number;
}

const sessions = new Map<number, SessionState>();
const sessionRoot = process.env.WHATSAPP_SESSION_DIR ?? path.resolve(process.cwd(), 'var/whatsapp');
const logger = pino({ level: 'silent' });

function createSnapshot(status: WhatsAppWebStatus, extra: Partial<WhatsAppWebSnapshot> = {}): WhatsAppWebSnapshot {
  return {
    status,
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}

export function getWhatsAppWebStatus(channelId: number): WhatsAppWebSnapshot {
  return sessions.get(channelId)?.snapshot ?? createSnapshot('idle');
}

// Where to store downloaded media files
const mediaRoot = path.join(process.cwd(), 'var', 'media');

function getRealMessage(m: any): any {
  if (!m) return null;
  if (m.ephemeralMessage?.message) return getRealMessage(m.ephemeralMessage.message);
  if (m.viewOnceMessage?.message) return getRealMessage(m.viewOnceMessage.message);
  if (m.viewOnceMessageV2?.message) return getRealMessage(m.viewOnceMessageV2.message);
  if (m.documentWithCaptionMessage?.message) return getRealMessage(m.documentWithCaptionMessage.message);
  return m;
}

/**
 * Download media (image/sticker/audio/video) from a WhatsApp message and
 * save it to disk.  Returns the public URL path, e.g. /api/media/abc123.jpg
 */
async function downloadAndSaveMedia(
  msg: WAMessage,
  socket: WASocket,
  mediaType: 'image' | 'sticker' | 'audio' | 'video' | 'document',
): Promise<string | null> {
  try {
    await mkdir(mediaRoot, { recursive: true });
    const buffer = await downloadMediaMessage(
      msg,
      'buffer',
      {},
      { logger, reuploadRequest: socket.updateMediaMessage },
    ) as Buffer;

    const extMap: Record<string, string> = {
      image: 'jpg',
      sticker: 'webp',
      audio: 'ogg',
      video: 'mp4',
      document: 'bin',
    };
    const ext = extMap[mediaType] ?? 'bin';
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(mediaRoot, filename);
    await writeFile(filePath, buffer);
    return `/api/media/${filename}`;
  } catch (err: any) {
    console.warn(`[WhatsApp Media] Failed to download ${mediaType}:`, err.message);
    return null;
  }
}

/**
 * Extract content and message type from WhatsApp message
 */
function extractMessageContent(msg: WAMessage): { text: string; messageType: string } {
  const m = getRealMessage(msg.message);
  if (!m) return { text: '', messageType: 'text' };

  if (m.conversation) {
    return { text: m.conversation, messageType: 'text' };
  }
  if (m.extendedTextMessage?.text) {
    return { text: m.extendedTextMessage.text, messageType: 'text' };
  }
  if (m.stickerMessage) {
    return { text: '🏷️ [Sticker / ملصق]', messageType: 'sticker' };
  }
  if (m.imageMessage) {
    return { text: m.imageMessage.caption || '📷 [Image / صورة]', messageType: 'image' };
  }
  if (m.audioMessage) {
    return { text: '🎵 [Voice Note / رسالة صوتية]', messageType: 'audio' };
  }
  if (m.videoMessage) {
    return { text: m.videoMessage.caption || '🎥 [Video / فيديو]', messageType: 'video' };
  }
  if (m.documentMessage) {
    const fn = m.documentMessage.fileName;
    return { text: fn ? `📄 [Document: ${fn}]` : '📄 [Document / مستند]', messageType: 'file' };
  }
  if (m.contactMessage) {
    return { text: `👤 [Contact: ${m.contactMessage.displayName || 'Card'}]`, messageType: 'contact' };
  }
  if (m.locationMessage) {
    return { text: '📍 [Location / موقع جغرافي]', messageType: 'location' };
  }
  if (m.reactionMessage) {
    return { text: `❤️ Reacted ${m.reactionMessage.text || ''}`, messageType: 'text' };
  }

  // Any other media or generic message
  const keys = Object.keys(m);
  if (keys.some(k => k.toLowerCase().includes('sticker'))) {
    return { text: '🏷️ [Sticker / ملصق]', messageType: 'sticker' };
  }
  if (keys.some(k => k.toLowerCase().includes('image'))) {
    return { text: '📷 [Image / صورة]', messageType: 'image' };
  }
  if (keys.some(k => k.toLowerCase().includes('audio'))) {
    return { text: '🎵 [Voice Note / رسالة صوتية]', messageType: 'audio' };
  }

  return { text: '💬 [Message / رسالة]', messageType: 'text' };
}

/**
 * Handle incoming/outgoing message from WhatsApp Web socket
 */
async function handleIncomingMessage(channelId: number, socket: WASocket, msg: WAMessage) {
  try {
    const remoteJid = msg.key.remoteJid;
    if (!remoteJid || remoteJid.includes('@broadcast') || remoteJid.includes('status@broadcast')) {
      return;
    }

    const { text, messageType } = extractMessageContent(msg);
    if (!text.trim()) return;

    const [channel] = await db.select().from(channels).where(eq(channels.id, channelId)).limit(1);
    if (!channel) return;

    const orgId = channel.organizationId;
    const isFromMe = Boolean(msg.key.fromMe);
    const rawNumber = remoteJid.replace(/@.*$/, '').replace(/[^0-9]/g, '');
    const senderDisplayPhone = remoteJid.includes('@lid') ? `LID:${rawNumber}` : `+${rawNumber}`;
    const pushName = isFromMe ? 'Agent (WhatsApp Mobile)' : (msg.pushName || senderDisplayPhone);
    const nameParts = pushName.trim().split(' ');
    const firstName = isFromMe ? 'Customer' : (nameParts[0] || 'Customer');
    const lastName = isFromMe ? '' : (nameParts.slice(1).join(' ') || '');

    // 1. Find or create Contact by exact remoteJid or senderDisplayPhone
    const orgContacts = await db.select().from(contacts)
      .where(eq(contacts.organizationId, orgId));

    let contact = orgContacts.find(c => c.phone === remoteJid || c.phone === senderDisplayPhone || c.phone === `+${rawNumber}`);

    if (!contact) {
      [contact] = await db.insert(contacts).values({
        organizationId: orgId,
        firstName,
        lastName,
        phone: remoteJid, // Store exact remoteJid for 100% reliable replies!
        lastActivityAt: new Date(),
      }).returning();
    } else {
      // Update phone to exact remoteJid if it was different
      await db.update(contacts).set({
        phone: remoteJid,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(contacts.id, contact.id));
    }

    // 2. Find or create Conversation
    let [conv] = await db.select().from(conversations)
      .where(and(
        eq(conversations.organizationId, orgId),
        eq(conversations.channelId, channelId),
        eq(conversations.contactId, contact.id)
      ))
      .limit(1);

    const subjectTitle = `WhatsApp • ${contact.firstName} ${contact.lastName}`.trim();

    if (!conv) {
      [conv] = await db.insert(conversations).values({
        organizationId: orgId,
        channelId: channel.id,
        contactId: contact.id,
        channelType: 'whatsapp',
        subject: subjectTitle,
        status: 'open',
        unreadCount: isFromMe ? 0 : 1,
        lastMessage: text.substring(0, 200),
        lastMessageAt: new Date(),
        aiHandled: false,
      }).returning();
    } else {
      await db.update(conversations).set({
        status: conv.status === 'closed' ? 'open' : conv.status,
        unreadCount: isFromMe ? 0 : (conv.unreadCount + 1),
        lastMessage: text.substring(0, 200),
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(conversations.id, conv.id));
    }

    // 3. Insert Message (with media download for images/stickers/audio/video)
    const messageExternalId = msg.key.id || String(Date.now());
    const [existingMsg] = await db.select({ id: messages.id }).from(messages)
      .where(and(eq(messages.conversationId, conv.id), eq(messages.externalId, messageExternalId)))
      .limit(1);

    if (!existingMsg) {
      // 1. Insert the message IMMEDIATELY so it appears in the inbox without delay
      const [insertedMsg] = await db.insert(messages).values({
        conversationId: conv.id,
        senderType: isFromMe ? 'agent' : 'contact',
        senderName: isFromMe ? 'Agent (WhatsApp Mobile)' : pushName,
        content: text,
        mediaUrl: null, // Will be updated after background download
        messageType: messageType,
        status: isFromMe ? 'sent' : 'received',
        externalId: messageExternalId,
      }).returning();

      // 2. Download media in the BACKGROUND (non-blocking) and update record
      const mediaTypeMap: Record<string, 'image' | 'sticker' | 'audio' | 'video' | 'document'> = {
        image: 'image',
        sticker: 'sticker',
        audio: 'audio',
        video: 'video',
        file: 'document',
      };
      if (mediaTypeMap[messageType] && insertedMsg) {
        const msgId = insertedMsg.id;
        const mtype = mediaTypeMap[messageType];
        downloadAndSaveMedia(msg, socket, mtype).then(async (mediaUrl) => {
          if (mediaUrl) {
            await db.update(messages).set({ mediaUrl }).where(eq(messages.id, msgId)).catch(() => {});
            console.log(`[WhatsApp Media] Saved ${messageType} -> ${mediaUrl} (msg #${msgId})`);
          }
        }).catch(() => {});
      }
    }

    console.log(`[WhatsApp ${isFromMe ? 'Mobile Outgoing' : 'Incoming'}] (${senderDisplayPhone}): "${text.substring(0, 50)}"`);

    // 4. Trigger AI Auto-Reply ONLY for incoming customer messages
    if (!isFromMe) {
      const aiReply = await generateAiReply({
        organizationId: orgId,
        customerName: pushName,
        incomingText: text,
      });

      if (aiReply) {
        console.log(`[WhatsApp AI] Sending auto-reply to ${remoteJid}...`);
        
        // Human-like behavior: Send "Typing..." presence for 1.2s before reply to prevent spam detection
        try {
          await socket.sendPresenceUpdate('composing', remoteJid);
          await new Promise(r => setTimeout(r, 1200));
          await socket.sendPresenceUpdate('paused', remoteJid);
        } catch {}

        await socket.sendMessage(remoteJid, { text: aiReply });

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
  } catch (err: any) {
    console.error('[WhatsApp] Error handling message:', err.message || err);
  }
}

export async function startWhatsAppWebSession(channelId: number, forceRestart = false): Promise<WhatsAppWebSnapshot> {
  const current = sessions.get(channelId);

  // If already connected and not forcing restart, return current
  if (!forceRestart && current?.snapshot.status === 'connected') {
    return current.snapshot;
  }

  // Clean previous socket if restarting
  if (current?.socket) {
    try {
      current.socket.end(undefined);
    } catch {}
  }

  const authDirectory = path.join(sessionRoot, String(channelId));
  await mkdir(authDirectory, { recursive: true });

  const state: SessionState = {
    snapshot: createSnapshot('connecting'),
    reconnectAttempts: 0,
  };
  sessions.set(channelId, state);

  const { state: authState, saveCreds } = await useMultiFileAuthState(authDirectory);

  const socket = makeWASocket({
    auth: authState,
    printQRInTerminal: false,
    logger,
    // Use a real WhatsApp Desktop fingerprint to avoid being flagged as a bot
    browser: Browsers.macOS('Desktop'),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: undefined, // Let it wait as long as needed
    keepAliveIntervalMs: 15000,       // More frequent keep-alive pings
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    fireInitQueries: true,
    generateHighQualityLinkPreview: false,
  });
  state.socket = socket;

  socket.ev.on('creds.update', saveCreds);

  // Listen for incoming messages
  socket.ev.on('messages.upsert', async ({ messages: incomingList, type }) => {
    if (type !== 'notify') return;
    for (const item of incomingList) {
      await handleIncomingMessage(channelId, socket, item);
    }
  });

  // Listen for message status updates (sent ✓ / delivered ✓✓ / read ✓✓ blue)
  socket.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
      if (!update.key.id || update.update.status === undefined) continue;

      // Map Baileys numeric status -> our DB status string
      // 1=PENDING, 2=SERVER_ACK(sent), 3=DELIVERY_ACK(delivered), 4=READ, 5=PLAYED
      const statusNum = update.update.status as number;
      let dbStatus: string | null = null;
      if (statusNum === 2) dbStatus = 'sent';
      else if (statusNum === 3) dbStatus = 'delivered';
      else if (statusNum === 4 || statusNum === 5) dbStatus = 'read';

      if (!dbStatus) continue;

      try {
        await db.update(messages)
          .set({ status: dbStatus })
          .where(eq(messages.externalId, update.key.id))
          .catch(() => {});
        console.log(`[WhatsApp Receipt] Msg ${update.key.id} -> ${dbStatus}`);
      } catch {}
    }
  });

  socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    const active = sessions.get(channelId);
    if (!active || active.stopping) return;

    if (qr) {
      console.log(`[WhatsApp] Channel ${channelId} QR code generated`);
      active.snapshot = createSnapshot('qr', {
        qrCode: await QRCode.toDataURL(qr, { width: 320, margin: 2 }),
      });
    }

    if (connection === 'open') {
      const rawPhone = socket.user?.id?.split(':')[0];
      const phoneNumber = rawPhone ? `+${rawPhone}` : undefined;
      active.reconnectAttempts = 0;
      active.snapshot = createSnapshot('connected', { phoneNumber });
      
      await db.update(channels).set({
        isActive: true,
        updatedAt: new Date(),
      }).where(eq(channels.id, channelId)).catch(console.error);

      console.log(`[WhatsApp] Channel ${channelId} CONNECTED! Phone: ${phoneNumber}`);
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)?.output?.statusCode;
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      // Reconnect on ANY close except explicit logout (401)
      const shouldReconnect = !isLoggedOut;

      console.log(`[WhatsApp] Channel ${channelId} disconnected. Code: ${statusCode}, isLoggedOut: ${isLoggedOut}`);

      if (isLoggedOut) {
        // Real logout - delete creds and stop
        active.snapshot = createSnapshot('disconnected', {
          error: 'Logged out from WhatsApp. Click Connect to generate a new QR Code.',
        });
        active.socket = undefined;
        await rm(authDirectory, { recursive: true, force: true }).catch(() => {});
        await db.update(channels).set({ isActive: false, updatedAt: new Date() })
          .where(eq(channels.id, channelId)).catch(() => {});
        console.log(`[WhatsApp] Channel ${channelId} LOGGED OUT - auth cleared.`);
      } else if (shouldReconnect && !active.stopping) {
        // Transient disconnect - exponential backoff reconnect, unlimited retries
        active.reconnectAttempts = (active.reconnectAttempts || 0) + 1;
        // Backoff: 2s, 4s, 8s, 16s, max 30s
        const delay = Math.min(2000 * Math.pow(2, active.reconnectAttempts - 1), 30000);
        active.snapshot = createSnapshot('connecting', {
          error: `Reconnecting (attempt ${active.reconnectAttempts}, in ${delay / 1000}s)...`,
        });
        console.log(`[WhatsApp] Auto-reconnecting channel ${channelId} in ${delay}ms (attempt ${active.reconnectAttempts})...`);
        setTimeout(() => {
          if (!active.stopping) {
            // IMPORTANT: forceRestart=false to preserve auth files!
            startWhatsAppWebSession(channelId, false).catch(console.error);
          }
        }, delay);
      }
    }
  });

  return state.snapshot;
}

export async function stopWhatsAppWebSession(channelId: number): Promise<void> {
  const state = sessions.get(channelId);
  if (state) {
    state.stopping = true;
    try {
      await state.socket?.logout();
    } catch {}
    sessions.delete(channelId);
  }
  const authDirectory = path.join(sessionRoot, String(channelId));
  await rm(authDirectory, { recursive: true, force: true }).catch(() => {});
}

/**
 * Send an outgoing message via WhatsApp socket
 */
export async function sendWhatsAppMessage(channelId: number, toPhoneOrJid: string, text: string): Promise<boolean> {
  // 1. Try specified channel
  let session = sessions.get(channelId);

  // 2. Fallback to any currently connected WhatsApp channel
  if (!session?.socket || session.snapshot.status !== 'connected') {
    for (const [_, s] of sessions.entries()) {
      if (s.socket && s.snapshot.status === 'connected') {
        session = s;
        break;
      }
    }
  }

  if (!session?.socket || session.snapshot.status !== 'connected') {
    console.warn(`[WhatsApp Outgoing] Cannot send message: WhatsApp channel ${channelId} is not connected.`);
    return false;
  }

  try {
    let raw = toPhoneOrJid.trim();
    let jid = raw;

    if (!jid.includes('@')) {
      const digitsOnly = raw.replace(/[^0-9]/g, '');
      if (digitsOnly.length >= 14) {
        jid = `${digitsOnly}@lid`;
      } else {
        jid = `${digitsOnly}@s.whatsapp.net`;
      }
    }

    try {
      await session.socket.sendMessage(jid, { text });
      console.log(`[WhatsApp Outgoing] Successfully sent message to ${jid}: "${text.substring(0, 50)}"`);
      return true;
    } catch (primaryErr) {
      // If failed with @lid, retry with @s.whatsapp.net or vice versa
      const altJid = jid.includes('@lid') 
        ? jid.replace('@lid', '@s.whatsapp.net')
        : jid.replace('@s.whatsapp.net', '@lid');
      
      console.log(`[WhatsApp Outgoing] Retrying with alternative JID ${altJid}...`);
      await session.socket.sendMessage(altJid, { text });
      console.log(`[WhatsApp Outgoing] Successfully sent message on retry to ${altJid}`);
      return true;
    }
  } catch (err: any) {
    console.error(`[WhatsApp Outgoing] Error sending message to ${toPhoneOrJid}:`, err.message || err);
    return false;
  }
}

/**
 * Restore active WhatsApp sessions on application startup
 */
export async function restoreWhatsAppSessions() {
  try {
    const activeChannels = await db.select().from(channels)
      .where(and(eq(channels.provider, 'whatsapp_web'), eq(channels.isActive, true)));

    if (activeChannels.length === 0) {
      console.log('[WhatsApp] No active WhatsApp Web channels to restore.');
      return;
    }

    for (const ch of activeChannels) {
      // Check if auth files exist before attempting restore
      const authDir = path.join(sessionRoot, String(ch.id));
      let hasAuth = false;
      try {
        const files = await import('fs/promises').then(m => m.readdir(authDir));
        hasAuth = files.length > 0;
      } catch {}

      if (hasAuth) {
        console.log(`[WhatsApp] Auth files found - restoring session for channel ${ch.id} (${ch.name})...`);
        try {
          await startWhatsAppWebSession(ch.id, false);
          console.log(`[WhatsApp] Session restore initiated for channel ${ch.id}`);
        } catch (err: any) {
          console.warn(`[WhatsApp] Failed to restore channel ${ch.id}:`, err.message);
        }
      } else {
        console.log(`[WhatsApp] No auth files for channel ${ch.id} (${ch.name}) - needs QR scan.`);
      }
    }
  } catch (err: any) {
    console.warn('[WhatsApp] Could not restore sessions at startup:', err.message);
  }
}
