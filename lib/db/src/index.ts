import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema/index.js";

function loadEnv() {
  const rootDir = 'c:/Users/Dell/Desktop/Support-Hub-AI';
  const envPaths = [
    path.join(rootDir, '.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(process.cwd(), '../../.env'),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          process.env[key] = val;
        }
      }
      break;
    }
  }
}

loadEnv();

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/support_platform';
const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

export const pool = new Pool({
  connectionString: dbUrl,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
});
export const db = drizzle(pool, { schema });

export * from "./schema/index.js";
