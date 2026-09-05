import type { FastifyInstance } from "fastify";
import { decisionService } from "../../decision/decisionService.js";
import { riskService } from "../../risk/riskService.js";

export async function decisionRoutes(app: FastifyInstance): Promise<void> {
  app.get("/decision/xauusd", async () => {
    const decision = await decisionService.getLatestDecision();
    const risk = riskService.assess(decision);
    return { decision, risk };
  });
}
