import type { QuantitativeScore, ScoreFactor } from "./types.js";
import type { StrategyPipelineResult } from "../strategy/types.js";

/**
 * Deterministic quantitative scoring.
 *
 * This is a skeleton scoring model, not a calibrated one. The relative
 * point weights below are reasonable starting defaults reflecting the
 * pipeline order (alignment and evidence confluence weighted heaviest),
 * but they have NOT been validated against historical performance. Per
 * the project spec, confidence must eventually be calibrated using
 * backtesting — until then this score should be treated as a relative
 * strength indicator only, never as a win probability. This module
 * performs the calculation; it does not decide BUY/SELL/WAIT — that is
 * the decision engine's responsibility, combining this score with AI
 * reasoning.
 */
export class ScoringService {
  score(pipeline: StrategyPipelineResult): QuantitativeScore {
    const breakdown: ScoreFactor[] = [];

    breakdown.push({
      factor: "Directional alignment (4H/1H)",
      points: pipeline.alignment.canProceed ? 20 : 0,
      maxPoints: 20,
    });

    const zonePoints = pipeline.fibonacci?.priceInsideZone ? 15 : pipeline.pullback?.state === "forming" ? 6 : 0;
    breakdown.push({ factor: "Golden zone proximity", points: zonePoints, maxPoints: 15 });

    const evidenceItems = pipeline.smcEvidence?.items ?? [];
    const strongCount = evidenceItems.filter((e) => e.strength === "strong").length;
    const moderateCount = evidenceItems.filter((e) => e.strength === "moderate").length;
    const conflictingCount = evidenceItems.filter((e) => e.strength === "conflicting").length;
    const evidenceRaw = strongCount * 6 + moderateCount * 3 - conflictingCount * 4;
    const evidencePoints = Math.max(0, Math.min(30, evidenceRaw));
    breakdown.push({ factor: "SMC evidence confluence", points: evidencePoints, maxPoints: 30 });

    const sessionEvidence = evidenceItems.find((e) => e.kind === "session");
    const sessionPoints = sessionEvidence?.strength === "strong" ? 10 : sessionEvidence?.strength === "moderate" ? 6 : 2;
    breakdown.push({ factor: "Session quality", points: sessionPoints, maxPoints: 10 });

    const volatilityEvidence = evidenceItems.find((e) => e.kind === "volatility");
    const volatilityPoints = volatilityEvidence?.strength === "conflicting" ? 3 : 12;
    breakdown.push({ factor: "Volatility conditions", points: volatilityPoints, maxPoints: 15 });

    const ltfFilled = pipeline.lowerTimeframeAnalysis.some((l) => l.state === "filled-zone");
    breakdown.push({ factor: "Lower-timeframe reaction", points: ltfFilled ? 10 : 0, maxPoints: 10 });

    const total = breakdown.reduce((sum, f) => sum + f.points, 0);
    const max = breakdown.reduce((sum, f) => sum + f.maxPoints, 0);

    return { total, max, breakdown };
  }
}

export const scoringService = new ScoringService();
