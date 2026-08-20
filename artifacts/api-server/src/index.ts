import http from "node:http";
import { WebSocketServer } from "ws";
import app from "./app";
import { logger } from "./lib/logger";
import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';
import { restoreWhatsAppSessions } from "./services/whatsapp-web.js";
import { restoreMetaSubscriptions } from "./services/meta-messenger.js";
import { voiceService } from "./services/voice-service.js";

async function initDatabase() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS organization_members (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'agent' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        CONSTRAINT uq_org_user UNIQUE (organization_id, user_id)
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS voice_sessions (
        id SERIAL PRIMARY KEY,
        organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE SET NULL,
        contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
        channel_id INTEGER REFERENCES channels(id) ON DELETE SET NULL,
        agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        session_id VARCHAR(100) NOT NULL UNIQUE,
        provider_call_id VARCHAR(255),
        status VARCHAR(30) DEFAULT 'initiated' NOT NULL,
        direction VARCHAR(10) DEFAULT 'inbound' NOT NULL,
        caller_number VARCHAR(50),
        callee_number VARCHAR(50),
        provider VARCHAR(50) DEFAULT 'mock' NOT NULL,
        duration_seconds INTEGER DEFAULT 0,
        transcript TEXT,
        transcript_json TEXT,
        summary TEXT,
        metadata TEXT,
        error_reason TEXT,
        started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        answered_at TIMESTAMPTZ,
        ended_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_voice_sessions_org ON voice_sessions (organization_id);
      CREATE INDEX IF NOT EXISTS idx_voice_sessions_session_id ON voice_sessions (session_id);
      CREATE INDEX IF NOT EXISTS idx_voice_sessions_conv ON voice_sessions (conversation_id);
      CREATE INDEX IF NOT EXISTS idx_voice_sessions_contact ON voice_sessions (contact_id);
      CREATE INDEX IF NOT EXISTS idx_voice_sessions_status ON voice_sessions (status);
      CREATE INDEX IF NOT EXISTS idx_voice_sessions_created ON voice_sessions (created_at DESC);
    `);

    // Backfill existing user-organization relationships
    await db.execute(sql`
      INSERT INTO organization_members (organization_id, user_id, role)
      SELECT organization_id, id, role FROM users
      WHERE organization_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);
    logger.info("Database schema initialized with organization_members and indexed voice_sessions");
  } catch (err) {
    logger.warn({ err }, "Database schema init notice:");
  }
}

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = http.createServer(app);

// Setup WebSocket server for Realtime Voice audio streaming
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const fullUrl = req.url || "";
  if (fullUrl.startsWith("/api/voice/ws/")) {
    const [pathPart, queryPart] = fullUrl.split("?");
    const parts = pathPart.split("/");
    const sessionId = parts[parts.length - 1];

    if (!sessionId) {
      socket.destroy();
      return;
    }

    // Verify media ticket from query param ?ticket=...
    const urlParams = new URLSearchParams(queryPart || "");
    const ticket = urlParams.get("ticket");

    if (ticket && !voiceService.validateMediaTicket(ticket, sessionId)) {
      logger.warn({ sessionId }, "Rejected WebSocket upgrade: Invalid or expired media ticket");
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      voiceService.attachMediaWebSocket(sessionId, ws);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, "0.0.0.0", async () => {
  logger.info({ port }, "Server listening on 0.0.0.0");
  await initDatabase();
  restoreWhatsAppSessions();
  restoreMetaSubscriptions();
});

