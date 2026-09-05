import type { FastifyInstance } from "fastify";
import { structureService } from "../../structure/structureService.js";
import { identifyHtfPullback, pullbackService } from "../../pullback/pullbackService.js";
import { computeFibonacciZone } from "../../fibonacci/fibonacciService.js";
import { marketService } from "../../market/marketService.js";

export async function structureRoutes(app: FastifyInstance): Promise<void> {
  app.get("/structure/xauusd", async () => {
    const alignment = await structureService.getDirectionAlignment();

    if (!alignment.canProceed) {
      return { alignment, pullback: null, fibonacci: null, lowerTimeframeAnalysis: [] };
    }

    const price = await marketService.getPriceSnapshot();
    const pullback = identifyHtfPullback(alignment, price.price);
    const fibonacci = computeFibonacciZone(pullback, price.price, alignment.htf.bias);
    const lowerTimeframeAnalysis = await pullbackService.getLowerTimeframeAnalysis(fibonacci);

    return { alignment, pullback, fibonacci, lowerTimeframeAnalysis };
  });
}
