import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

/**
 * Push the schema.sql to the remote Turso database.
 * Usage: npx tsx scripts/push-turso-schema.ts
 */
async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN env vars");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  // Read the schema SQL
  const schemaPath = path.join(__dirname, "..", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  // Split into individual statements and execute each
  const statements = schemaSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Pushing ${statements.length} statements to Turso...`);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log(`✓ ${stmt.substring(0, 60)}...`);
    } catch (err: any) {
      // Ignore "already exists" errors
      if (err.message?.includes("already exists")) {
        console.log(`⊘ Already exists: ${stmt.substring(0, 60)}...`);
      } else {
        console.error(`✗ Error: ${err.message}`);
        console.error(`  Statement: ${stmt.substring(0, 100)}`);
      }
    }
  }

  // Also create tables that might be in the Prisma schema but not in schema.sql
  // Ensure PhysicianOrder and CarePlan and IntakeOutputSummary tables exist
  const extraTables = [
    `CREATE TABLE IF NOT EXISTS "PhysicianOrder" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "date" TEXT NOT NULL,
      "notes" TEXT NOT NULL,
      "maternalPatientId" TEXT,
      "newbornRecordId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PhysicianOrder_maternalPatientId_fkey" FOREIGN KEY ("maternalPatientId") REFERENCES "MaternalPatient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "PhysicianOrder_newbornRecordId_fkey" FOREIGN KEY ("newbornRecordId") REFERENCES "NewbornRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "CarePlan" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "maternalPatientId" TEXT NOT NULL,
      "diagnosis" TEXT,
      "planning" TEXT,
      "intervention" TEXT,
      "evaluation" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CarePlan_maternalPatientId_fkey" FOREIGN KEY ("maternalPatientId") REFERENCES "MaternalPatient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "IntakeOutputSummary" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "maternalPatientId" TEXT NOT NULL,
      "oralIntakeMl" TEXT,
      "ivIntakeMl" TEXT,
      "urineOutputMl" TEXT,
      "stoolCount" TEXT,
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "IntakeOutputSummary_maternalPatientId_fkey" FOREIGN KEY ("maternalPatientId") REFERENCES "MaternalPatient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`,
  ];

  for (const stmt of extraTables) {
    try {
      await client.execute(stmt);
      console.log(`✓ Ensured table exists`);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        console.log(`⊘ Already exists`);
      } else {
        console.error(`✗ Error: ${err.message}`);
      }
    }
  }

  console.log("\n✅ Schema push to Turso complete!");
  client.close();
}

main().catch(console.error);
