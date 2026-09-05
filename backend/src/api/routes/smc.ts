import type { FastifyInstance } from "fastify";
import { structureService } from "../../structure/structureService.js";
import { smcService } from "../../smc/smcService.js";

export async function smcRoutes(app: FastifyInstance): Promise<void> {
  app.get("/smc/xauusd", async () => {
    const alignment = await structureService.getDirectionAlignment();
    const evidence = await smcService.getEvidenceSet(alignment);
    return evidence;
  });
}
