import type { StrategyPipelineResult } from "./types.js";
import { marketService } from "../market/marketService.js";
import { structureService } from "../structure/structureService.js";
import { identifyHtfPullback, pullbackService } from "../pullback/pullbackService.js";
import { computeFibonacciZone } from "../fibonacci/fibonacciService.js";
import { smcService } from "../smc/smcService.js";
import { logger } from "../logging/logger.js";

/**
 * Runs the confirmed strategy pipeline in the exact order specified:
 *   Daily Context -> 4H Direction -> 1H Confirmation -> Direction Alignment
 *   -> HTF Pullback -> Fibonacci -> LTF Pullback -> SMC Evidence
 *
 * Each fixed rule is enforced here, not left to the caller: if 4H/1H
 * disagree, the pipeline stops after alignment and reports the setup as
 * ineligible rather than continuing to compute a pullback/fibonacci that
 * wouldn't be actionable anyway.
 */
export async function runStrategyPipeline(): Promise<StrategyPipelineResult> {
  const [price, dailyLevels] = await Promise.all([
    marketService.getPriceSnapshot(),
    marketService.getDailyLevels(),
  ]);

  const alignment = await structureService.getDirectionAlignment();

  if (!alignment.canProceed) {
    logger.info({ alignment: alignment.state }, "strategy pipeline stopped: direction alignment failed");
    return {
      price,
      dailyLevels,
      alignment,
      pullback: null,
      fibonacci: null,
      lowerTimeframeAnalysis: [],
      smcEvidence: null,
      setupEligible: false,
      ineligibilityReason: alignment.ruleNote,
    };
  }

  const pullback = identifyHtfPullback(alignment, price.price);
  const fibonacci = computeFibonacciZone(pullback, price.price, alignment.htf.bias);
  const lowerTimeframeAnalysis = await pullbackService.getLowerTimeframeAnalysis(fibonacci);
  const smcEvidence = await smcService.getEvidenceSet(alignment);

  const zoneFilled = lowerTimeframeAnalysis.some((l) => l.state === "filled-zone") || fibonacci.priceInsideZone;

  return {
    price,
    dailyLevels,
    alignment,
    pullback,
    fibonacci,
    lowerTimeframeAnalysis,
    smcEvidence,
    setupEligible: zoneFilled,
    ineligibilityReason: zoneFilled
      ? null
      : "Lower-timeframe pullback has not yet reached/filled the HTF Fibonacci 0.618–0.786 zone.",
  };
}
