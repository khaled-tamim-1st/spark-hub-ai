import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type WASocket,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';

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

export async function startWhatsAppWebSession(channelId: number): Promise<WhatsAppWebSnapshot> {
  const current = sessions.get(channelId);
  if (current?.snapshot.status === 'connecting' || current?.snapshot.status === 'qr' || current?.snapshot.status === 'connected') {
    return current.snapshot;
  }

  const state: SessionState = {
    snapshot: createSnapshot('connecting'),
  };
  sessions.set(channelId, state);

  const authDirectory = path.join(sessionRoot, String(channelId));
  await mkdir(authDirectory, { recursive: true });
  const { state: authState, saveCreds } = await useMultiFileAuthState(authDirectory);

  const socket = makeWASocket({
    auth: authState,
    printQRInTerminal: false,
    logger,
    browser: ['SupportAI', 'Chrome', '1.0.0'],
  });
  state.socket = socket;

  socket.ev.on('creds.update', saveCreds);
  socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    const active = sessions.get(channelId);
    if (!active || active.stopping) return;

    if (qr) {
      active.snapshot = createSnapshot('qr', {
        qrCode: await QRCode.toDataURL(qr, { width: 320, margin: 2 }),
      });
    }

    if (connection === 'open') {
      const rawPhone = socket.user?.id?.split(':')[0];
      active.snapshot = createSnapshot('connected', {
        phoneNumber: rawPhone ? `+${rawPhone}` : undefined,
      });
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      active.snapshot = createSnapshot(loggedOut ? 'disconnected' : 'error', {
        error: loggedOut ? undefined : 'WhatsApp Web connection closed. Start a new session to retry.',
      });
      active.socket = undefined;
    }
  });

  return state.snapshot;
}

export async function stopWhatsAppWebSession(channelId: number): Promise<void> {
  const state = sessions.get(channelId);
  if (!state) return;
  state.stopping = true;
  try {
    await state.socket?.logout();
  } catch {
    // The browser session may already be disconnected.
  }
  sessions.delete(channelId);
}
