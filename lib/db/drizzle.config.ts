import { defineConfig } from "drizzle-kit";
import path from "node:path";
import fs from "node:fs";

try {
  if (typeof process.loadEnvFile === 'function') {
    const candidates = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../../.env'),
      path.resolve(__dirname, '../../.env'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        process.loadEnvFile(p);
        break;
      }
    }
  }
} catch {}

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/support_platform';

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
    ssl: dbUrl.includes('localhost') ? undefined : { rejectUnauthorized: false },
  },
});
