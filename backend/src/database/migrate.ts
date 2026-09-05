import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool, closePool } from "./pool.js";
import { logger } from "../logging/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "migrations");

/**
 * Minimal, dependency-free migration runner: applies every .sql file in
 * migrations/ in filename order, tracked in a `_migrations` table so it's
 * safe to run repeatedly. Good enough for this foundation build; swap for
 * a proper migration tool (node-pg-migrate, Prisma, etc.) as the schema grows.
 */
async function migrate(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const { rows } = await pool.query("SELECT 1 FROM _migrations WHERE name = $1", [file]);
    if (rows.length > 0) {
      logger.info({ file }, "migration already applied, skipping");
      continue;
    }

    const sql = await readFile(join(MIGRATIONS_DIR, file), "utf-8");
    logger.info({ file }, "applying migration");
    await pool.query("BEGIN");
    try {
      await pool.query(sql);
      await pool.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      await pool.query("COMMIT");
      logger.info({ file }, "migration applied");
    } catch (err) {
      await pool.query("ROLLBACK");
      throw err;
    }
  }

  await closePool();
}

migrate()
  .then(() => {
    logger.info("all migrations applied");
    process.exit(0);
  })
  .catch((err) => {
    logger.error({ err }, "migration failed");
    process.exit(1);
  });
