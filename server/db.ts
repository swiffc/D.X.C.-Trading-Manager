import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let _pool: Pool | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

if (process.env.DATABASE_URL) {
  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // @ts-ignore drizzle neon-serverless type
  _db = drizzle({ client: _pool, schema });
  // eslint-disable-next-line no-console
  console.log('Using Neon/Postgres database connection');
} else {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL not set. Falling back to in-memory storage.');
}

export const pool = _pool as any;
export const db = _db as any;
