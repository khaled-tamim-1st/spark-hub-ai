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
import { dispatchSupervisorInspection, isInternalNoteContent, CUSTOMER_HANDOFF_TEXT } from './ai-supervisor/index.js';

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
  isStarting?: boolean;
  reconnectAttempts?: number;
  lastQrTimestamp?: number;
}

const sessions = new Map<number, SessionState>();
const startingPromises = new Map<number, Promise<WhatsAppWebSnapshot>>();
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
 * Download media (image/sticker/audio/video) from a WhatsApp message and save it to disk.
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

  return { text: '', messageType: 'text' };
}

/**
 * Handle incoming/outgoing message event from Baileys
 */
async function handleIncomingMessage(channelId: number, socket: WASocket, msg: WAMessage): Promise<void> {
  try {
    if (!msg.message) return;

    // Ignore broadcast/status updates
    const remoteJid = msg.key.remoteJid;
    if (!remoteJid || remoteJid.endsWith('@broadcast') || remoteJid.includes('status@broadcast')) {
      return;
    }

    const isFromMe = Boolean(msg.key.fromMe);
    const { text, messageType } = extractMessageContent(msg);

    if (!text && !messageType) return;

    // Retrieve channel to determine organizationId
    const [channel] = await db.select().from(channels).where(eq(channels.id, channelId)).limit(1);
    if (!channel) return;

    const orgId = channel.organizationId;
    const senderDisplayPhone = remoteJid.split('@')[0];
    const pushName = msg.pushName || senderDisplayPhone || 'عميل واتساب';

    // 1. Find or create Contact
    let [contact] = await db.select().from(contacts)
      .where(and(eq(contacts.organizationId, orgId), eq(contacts.phone, remoteJid)))
      .limit(1);

    if (!contact) {
      const [byShortPhone] = await db.select().from(contacts)
        .where(and(eq(contacts.organizationId, orgId), eq(contacts.phone, senderDisplayPhone)))
        .limit(1);
      contact = byShortPhone;
    }

    if (!contact) {
      const parts = pushName.split(' ');
      const firstName = parts[0] || senderDisplayPhone;
      const lastName = parts.slice(1).join(' ') || '';

      [contact] = await db.insert(contacts).values({
        organizationId: orgId,
        firstName,
        lastName,
        phone: remoteJid,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=25D366&color=fff`,
        lastActivityAt: new Date(),
      }).returning();
    } else if (contact.phone !== remoteJid) {
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

    // 3. Insert Message
    const messageExternalId = msg.key.id || String(Date.now());
    const [existingMsg] = await db.select({ id: messages.id }).from(messages)
      .where(and(eq(messages.conversationId, conv.id), eq(messages.externalId, messageExternalId)))
      .limit(1);

    if (!existingMsg) {
      const [insertedMsg] = await db.insert(messages).values({
        conversationId: conv.id,
        senderType: isFromMe ? 'agent' : 'contact',
        senderName: isFromMe ? 'الموظف (WhatsApp Mobile)' : pushName,
        content: text,
        mediaUrl: null,
        messageType: messageType,
        status: isFromMe ? 'sent' : 'received',
        externalId: messageExternalId,
      }).returning();

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

    // 4. Trigger AI Supervisor & Auto-Reply ONLY for incoming customer messages
    if (!isFromMe) {
      // ─── Dispatch AI Operations Supervisor (Non-blocking) ─────────────────
      dispatchSupervisorInspection({
        organizationId: orgId,
        conversationId: conv.id,
        contactId: conv.contactId,
        messageId: messageExternalId,
        channelType: 'whatsapp',
        incomingText: text,
        customerName: pushName,
      });

      // ─── Critical Safety Gate ─────────────────────────────────────────────
      const [currentConv] = await db.select({ aiHandled: conversations.aiHandled })
        .from(conversations).where(eq(conversations.id, conv.id)).limit(1);

      if (currentConv && !currentConv.aiHandled) {
        console.log(`[WhatsApp AI] Safety Gate: Conversation #${conv.id} is manual/escalated. Skipping AI auto-reply.`);
        return;
      }

      const aiReply = await generateAiReply({
        organizationId: orgId,
        customerName: pushName,
        incomingText: text,
      });

      // Re-check safety gate right before transmitting message to WhatsApp socket
      const [recheckConv] = await db.select({ aiHandled: conversations.aiHandled })
        .from(conversations).where(eq(conversations.id, conv.id)).limit(1);

      if (recheckConv && !recheckConv.aiHandled) {
        console.log(`[WhatsApp AI] Safety Gate: Conversation #${conv.id} switched to manual while generating. Aborting reply.`);
        return;
      }

      if (aiReply) {
        // Outbound content safety guard: ensure no internal supervisor text leaks
        if (isInternalNoteContent(aiReply)) {
          console.error('[CRITICAL SECURITY GUARD] Blocked attempt to send internal supervisor note to WhatsApp!');
          return;
        }

        console.log(`[WhatsApp AI] Sending auto-reply to ${remoteJid}...`);
        
        try {
          await socket.sendPresenceUpdate('composing', remoteJid);
          await new Promise(r => setTimeout(r, 1200));
          await socket.sendPresenceUpdate('paused', remoteJid);
        } catch {}

        await socket.sendMessage(remoteJid, { text: aiReply });

        await db.insert(messages).values({
          conversationId: conv.id,
          senderType: 'ai',
          senderName: 'سند AI',
          content: aiReply,
          messageType: 'text',
          isPrivate: false,
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

/**
 * Start or resume WhatsApp Web Baileys Session
 */
export async function startWhatsAppWebSession(channelId: number, forceRestart = false): Promise<WhatsAppWebSnapshot> {
  const current = sessions.get(channelId);

  // If already connected and not forcing restart, return current
  if (!forceRestart && current?.snapshot.status === 'connected') {
    return current.snapshot;
  }

  // If a start operation is already in progress, wait for it instead of spinning up duplicate sockets
  if (startingPromises.has(channelId)) {
    return startingPromises.get(channelId)!;
  }

  const startPromise = (async () => {
    try {
      // Clean previous socket if restarting
      if (current?.socket) {
        try {
          current.socket.ev.removeAllListeners('connection.update');
          current.socket.ev.removeAllListeners('creds.update');
          current.socket.ev.removeAllListeners('messages.upsert');
          current.socket.end(undefined);
        } catch {}
      }

      const authDirectory = path.join(sessionRoot, String(channelId));
      if (forceRestart) {
        await rm(authDirectory, { recursive: true, force: true }).catch(() => {});
      }
      await mkdir(authDirectory, { recursive: true });

      const state: SessionState = {
        snapshot: createSnapshot('connecting'),
        reconnectAttempts: 0,
        isStarting: true,
      };
      sessions.set(channelId, state);

      const { state: authState, saveCreds } = await useMultiFileAuthState(authDirectory);

      // Stable Baileys socket configuration (Ubuntu Chrome signature with extended timeouts)
      const socket = makeWASocket({
        auth: authState,
        printQRInTerminal: false,
        logger,
        // Standard compliant browser signature recognized by WhatsApp Web
        browser: ['Sanad AI', 'Chrome', '124.0.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        retryRequestDelayMs: 1000,
        maxMsgRetryCount: 5,
        fireInitQueries: true,
        generateHighQualityLinkPreview: false,
        qrTimeout: 60000, // Keep QR code valid for 60 seconds
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

      // Listen for message status updates
      socket.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
          if (!update.key.id || update.update.status === undefined) continue;
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
          } catch {}
        }
      });

      socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        const active = sessions.get(channelId);
        if (!active || active.stopping) return;

        if (qr) {
          console.log(`[WhatsApp] Channel ${channelId} fresh QR generated.`);
          active.lastQrTimestamp = Date.now();
          active.snapshot = createSnapshot('qr', {
            qrCode: await QRCode.toDataURL(qr, {
              width: 360,
              margin: 2,
              errorCorrectionLevel: 'M',
              color: { dark: '#000000', light: '#FFFFFF' }
            }),
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
          const shouldReconnect = !isLoggedOut;

          console.log(`[WhatsApp] Channel ${channelId} disconnected. Code: ${statusCode}, isLoggedOut: ${isLoggedOut}`);

          if (isLoggedOut) {
            active.snapshot = createSnapshot('disconnected', {
              error: 'تم تسجيل الخروج من واتساب. اضغط على إعادة الربط للمسح مجدداً.',
            });
            active.socket = undefined;
            await rm(authDirectory, { recursive: true, force: true }).catch(() => {});
            await db.update(channels).set({ isActive: false, updatedAt: new Date() })
              .where(eq(channels.id, channelId)).catch(() => {});
          } else if (shouldReconnect && !active.stopping) {
            active.reconnectAttempts = (active.reconnectAttempts || 0) + 1;
            const delay = Math.min(3000 * Math.pow(1.5, active.reconnectAttempts - 1), 25000);
            
            // If we already have a QR code generated recently, preserve it
            if (active.snapshot.status !== 'qr') {
              active.snapshot = createSnapshot('connecting', {
                error: `جاري إعادة الاتصال (محاولة ${active.reconnectAttempts})...`,
              });
            }

            setTimeout(() => {
              if (!active.stopping) {
                startWhatsAppWebSession(channelId, false).catch(console.error);
              }
            }, delay);
          }
        }
      });

      return state.snapshot;
    } finally {
      startingPromises.delete(channelId);
    }
  })();

  startingPromises.set(channelId, startPromise);
  return startPromise;
}

export async function stopWhatsAppWebSession(channelId: number): Promise<void> {
  const state = sessions.get(channelId);
  if (state) {
    state.stopping = true;
    try {
      state.socket?.ev.removeAllListeners('connection.update');
      state.socket?.ev.removeAllListeners('creds.update');
      state.socket?.ev.removeAllListeners('messages.upsert');
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
export async function sendWhatsAppMessage(
  channelId: number,
  toPhoneOrJid: string,
  text: string,
  options?: { isPrivate?: boolean; messageType?: string }
): Promise<boolean> {
  // ─── Central Outbound Safety Guard (Section 3) ───────────────────────────
  if (options?.isPrivate || options?.messageType === 'internal_note' || isInternalNoteContent(text)) {
    console.error('[CRITICAL SECURITY GUARD] Blocked attempt to send internal note to WhatsApp:', text.substring(0, 80));
    throw new Error('Internal notes cannot be sent externally to WhatsApp');
  }

  let session = sessions.get(channelId);

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

  let remoteJid = toPhoneOrJid.trim();
  if (!remoteJid.includes('@')) {
    const cleanNumber = remoteJid.replace(/[^0-9]/g, '');
    remoteJid = `${cleanNumber}@s.whatsapp.net`;
  }

  try {
    await session.socket.sendMessage(remoteJid, { text });
    console.log(`[WhatsApp Outgoing Sent] -> ${remoteJid}: "${text.substring(0, 50)}"`);
    return true;
  } catch (err: any) {
    console.error(`[WhatsApp Outgoing Failed] -> ${remoteJid}:`, err.message || err);
    return false;
  }
}

/**
 * Restore WhatsApp sessions on server boot
 */
export async function restoreWhatsAppSessions(): Promise<void> {
  try {
    const activeChannels = await db.select().from(channels)
      .where(and(eq(channels.provider, 'whatsapp_web'), eq(channels.isActive, true)));

    console.log(`[WhatsApp] Restoring ${activeChannels.length} active WhatsApp Web channels...`);
    for (const ch of activeChannels) {
      startWhatsAppWebSession(ch.id, false).catch((err) => {
        console.warn(`[WhatsApp] Failed to restore channel ${ch.id}:`, err.message);
      });
    }
  } catch (err: any) {
    console.warn('[WhatsApp] Restore sessions error:', err.message);
  }
}
