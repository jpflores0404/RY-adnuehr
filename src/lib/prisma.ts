import { PrismaClient } from "@/generated/prisma";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const globalForPrismaMeta = globalThis as unknown as { prismaLogPrinted?: boolean };

function buildPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const isProduction = process.env.NODE_ENV === "production";
  const useTurso = isProduction && !!tursoUrl && !!tursoToken;

  // One-time startup hint so we can quickly see which DB backend is active.
  if (!globalForPrismaMeta.prismaLogPrinted) {
    console.log(`[prisma] datasource=${useTurso ? "turso" : "sqlite"} env=${process.env.NODE_ENV ?? "development"}`);
    globalForPrismaMeta.prismaLogPrinted = true;
  }

  // Use Turso only in production when credentials are available.
  // Local development should always use DATABASE_URL (SQLite file).
  if (useTurso) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  // Local development — use the SQLite file
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? buildPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
