import type { FastifyInstance } from "fastify";
import { marketService } from "../../market/marketService.js";
import { TIMEFRAMES } from "../../config/constants.js";

const querySchema = {
  type: "object",
  properties: {
    timeframe: { type: "string", enum: TIMEFRAMES as unknown as string[], default: "1H" },
    limit: { type: "integer", minimum: 1, maximum: 1000, default: 200 },
  },
} as const;

export async function marketRoutes(app: FastifyInstance): Promise<void> {
  app.get("/market/xauusd", { schema: { querystring: querySchema } }, async (request) => {
    const { timeframe, limit } = request.query as { timeframe: (typeof TIMEFRAMES)[number]; limit: number };

    const [price, dailyLevels, candles] = await Promise.all([
      marketService.getPriceSnapshot(),
      marketService.getDailyLevels(),
      marketService.getValidatedCandles({ timeframe, limit }),
    ]);

    return { price, dailyLevels, timeframe, candles };
  });
}
