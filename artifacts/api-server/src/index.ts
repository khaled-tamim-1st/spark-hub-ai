import app from "./app";
import { logger } from "./lib/logger";
import { restoreWhatsAppSessions } from "./services/whatsapp-web.js";

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening on 0.0.0.0");
  restoreWhatsAppSessions();
});
