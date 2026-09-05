import type { FastifyInstance } from "fastify";
import { analysisHistoryRepository } from "../../database/repositories/analysisRepository.js";
import { DatabaseError } from "../../types/errors.js";
import { logger } from "../../logging/logger.js";

const querySchema = {
  type: "object",
  properties: {
    limit: { type: "integer", minimum: 1, maximum: 200, default: 50 },
  },
} as const;

export async function historyRoutes(app: FastifyInstance): Promise<void> {
  app.get("/history", { schema: { querystring: querySchema } }, async (request) => {
    const { limit } = request.query as { limit: number };

    try {
      const entries = await analysisHistoryRepository.list(limit);
      return { entries };
    } catch (err) {
      // Database unavailable — degrade gracefully with an empty, clearly
      // labeled result rather than a hard 500, per the error-handling
      // requirement that provider/DB failures shouldn't take the API down.
      logger.warn({ err }, "History unavailable — database query failed");
      if (err instanceof DatabaseError) {
        return { entries: [], warning: "History is temporarily unavailable: database connection failed." };
      }
      throw err;
    }
  });
}
