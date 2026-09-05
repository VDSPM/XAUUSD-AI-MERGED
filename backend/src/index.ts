import { buildServer } from "./api/server.js";
import { env } from "./config/env.js";
import { logger } from "./logging/logger.js";
import { closePool } from "./database/pool.js";

async function main(): Promise<void> {
  const app = await buildServer();

  try {
    await app.listen({ port: env.port, host: env.host });
    logger.info(
      { port: env.port, host: env.host, strategyVersion: env.strategyVersion },
      "XAUUSD AI Analysis backend started"
    );
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down");
    await app.close();
    await closePool();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error({ err }, "Fatal error during startup");
  process.exit(1);
});
