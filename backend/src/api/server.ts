import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRoutes } from "./routes/health.js";
import { marketRoutes } from "./routes/market.js";
import { analysisRoutes } from "./routes/analysis.js";
import { structureRoutes } from "./routes/structure.js";
import { smcRoutes } from "./routes/smc.js";
import { decisionRoutes } from "./routes/decision.js";
import { historyRoutes } from "./routes/history.js";
import { backtestRoutes } from "./routes/backtest.js";

export async function buildServer() {
  const app = Fastify({ loggerInstance: logger });

  await app.register(cors, {
    origin: env.corsOrigins,
  });

  app.setErrorHandler(errorHandler);

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: { code: "NOT_FOUND", message: `Route ${request.method} ${request.url} not found` },
    });
  });

  await app.register(healthRoutes);
  await app.register(marketRoutes);
  await app.register(analysisRoutes);
  await app.register(structureRoutes);
  await app.register(smcRoutes);
  await app.register(decisionRoutes);
  await app.register(historyRoutes);
  await app.register(backtestRoutes);

  return app;
}
