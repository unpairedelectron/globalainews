import { AsyncLocalStorage } from "node:async_hooks";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

export const databaseRequestContext = new AsyncLocalStorage<{
  caller: string;
  route?: string;
  userAgent?: string;
}>();

export const pool = new Pool({
  ...(process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {}),
  min: 0,
  max: 2,
  idleTimeoutMillis: 10_000,
});

let databaseActivityCount = 0;
function logDatabaseActivity(event: string): void {
  if (process.env.DB_CONNECTION_DIAGNOSTICS !== "true") return;
  databaseActivityCount += 1;
  const context = databaseRequestContext.getStore();
  console.info(JSON.stringify({
    event: `database_pool_${event}`,
    timestamp: new Date().toISOString(),
    caller: context?.caller ?? "background",
    route: context?.route ?? null,
    userAgent: context?.userAgent ?? null,
    activityCount: databaseActivityCount,
  }));
}

pool.on("connect", () => logDatabaseActivity("connect"));
pool.on("acquire", () => logDatabaseActivity("acquire"));
pool.on("remove", () => logDatabaseActivity("remove"));
export const db = drizzle(pool, { schema });

export * from "./schema";
