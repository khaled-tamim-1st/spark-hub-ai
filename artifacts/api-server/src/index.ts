import app from "./app";
import { logger } from "./lib/logger";
import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';
import { restoreWhatsAppSessions } from "./services/whatsapp-web.js";
import { restoreMetaSubscriptions } from "./services/meta-messenger.js";

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
    // Backfill existing user-organization relationships
    await db.execute(sql`
      INSERT INTO organization_members (organization_id, user_id, role)
      SELECT organization_id, id, role FROM users
      WHERE organization_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);
    logger.info("Database schema initialized with organization_members");
  } catch (err) {
    logger.warn({ err }, "Database schema init notice:");
  }
}

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, "0.0.0.0", async () => {
  logger.info({ port }, "Server listening on 0.0.0.0");
  await initDatabase();
  restoreWhatsAppSessions();
  restoreMetaSubscriptions();
});
