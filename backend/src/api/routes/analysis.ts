import type { FastifyInstance } from "fastify";
import { decisionService } from "../../decision/decisionService.js";
import { riskService } from "../../risk/riskService.js";

export async function analysisRoutes(app: FastifyInstance): Promise<void> {
  app.get("/analysis/xauusd", async () => {
    const { pipeline, decision } = await decisionService.getFullAnalysis();
    const risk = riskService.assess(decision);

    if (!pipeline) {
      return {
        instrument: "XAUUSD",
        status: "insufficient-data",
        decision,
        risk,
      };
    }

    return {
      instrument: "XAUUSD",
      status: "completed",
      price: pipeline.price,
      dailyLevels: pipeline.dailyLevels,
      alignment: pipeline.alignment,
      pullback: pipeline.pullback,
      fibonacci: pipeline.fibonacci,
      lowerTimeframeAnalysis: pipeline.lowerTimeframeAnalysis,
      smcEvidence: pipeline.smcEvidence,
      setupEligible: pipeline.setupEligible,
      ineligibilityReason: pipeline.ineligibilityReason,
      decision,
      risk,
    };
  });
}
