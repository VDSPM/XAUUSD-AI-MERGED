import pg from "pg";
import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";
import { DatabaseError } from "../types/errors.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected PostgreSQL pool error");
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  try {
    return await pool.query<T>(text, params);
  } catch (err) {
    logger.error({ err, query: text }, "Database query failed");
    throw new DatabaseError(err instanceof Error ? err.message : "Unknown database error");
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    logger.error({ err }, "Database connectivity check failed");
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
