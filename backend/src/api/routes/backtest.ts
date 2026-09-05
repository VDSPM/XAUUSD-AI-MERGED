import type { FastifyInstance } from "fastify";
import { backtestService } from "../../backtest/backtestService.js";

const bodySchema = {
  type: "object",
  required: ["startDate", "endDate"],
  properties: {
    startDate: { type: "string" },
    endDate: { type: "string" },
  },
} as const;

export async function backtestRoutes(app: FastifyInstance): Promise<void> {
  app.get("/backtest", async () => {
    const latest = await backtestService.getLatest();
    return { latest };
  });

  app.post("/backtest", { schema: { body: bodySchema } }, async (request) => {
    const { startDate, endDate } = request.body as { startDate: string; endDate: string };
    const run = await backtestService.run({ instrument: "XAUUSD", startDate, endDate });
    return run;
  });
}
