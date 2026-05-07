import { createClient } from "@libsql/client";

const globalForDb = globalThis as unknown as { dbClient: ReturnType<typeof createClient> | undefined };

function createDbClient() {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  return createClient({ url });
}

export const db = globalForDb.dbClient || createDbClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbClient = db;
}
