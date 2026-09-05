import type { DirectionAlignment } from "../structure/types.js";
import type { HtfPullback, LowerTimeframeAnalysis } from "../pullback/types.js";
import type { FibonacciZone } from "../fibonacci/types.js";
import type { SmcEvidenceSet } from "../smc/types.js";
import type { DailyLevels, PriceSnapshot } from "../market/types.js";

/**
 * Aggregated output of the fixed-rule strategy pipeline. This is the
 * shared input that scoring, AI reasoning, and the decision engine all
 * consume — none of them re-derive structure/pullback/fibonacci
 * themselves.
 */
export interface StrategyPipelineResult {
  price: PriceSnapshot;
  dailyLevels: DailyLevels;
  alignment: DirectionAlignment;
  pullback: HtfPullback | null;
  fibonacci: FibonacciZone | null;
  lowerTimeframeAnalysis: LowerTimeframeAnalysis[];
  smcEvidence: SmcEvidenceSet | null;
  /**
   * True only when every fixed rule that gates progression has been
   * satisfied: 4H/1H alignment AND the LTF pullback has reached the HTF
   * golden zone. When false, the decision engine MUST return WAIT.
   */
  setupEligible: boolean;
  ineligibilityReason: string | null;
}
