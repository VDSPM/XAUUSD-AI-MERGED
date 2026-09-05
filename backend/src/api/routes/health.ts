import type { FastifyInstance } from "fastify";
import { checkDatabaseConnection } from "../../database/pool.js";
import { marketService } from "../../market/marketService.js";
import { env } from "../../config/env.js";

const responseSchema = {
  200: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["ok", "degraded"] },
      timestamp: { type: "string" },
      strategyVersion: { type: "string" },
      dataSource: { type: "string" },
      database: { type: "boolean" },
    },
  },
} as const;

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", { schema: { response: responseSchema } }, async () => {
    const databaseOk = await checkDatabaseConnection();

    return {
      status: databaseOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      strategyVersion: env.strategyVersion,
      dataSource: marketService.providerId,
      database: databaseOk,
    };
  });
}
