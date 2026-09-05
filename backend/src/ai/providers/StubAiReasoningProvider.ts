import type { AiReasoningProvider } from "../AiReasoningProvider.js";
import type { AiReasoning } from "../types.js";
import type { StrategyPipelineResult } from "../../strategy/types.js";
import type { QuantitativeScore } from "../../scoring/types.js";

/**
 * Deterministic, template-based placeholder for the AI reasoning layer.
 *
 * This does NOT call any external AI model — it exists so the
 * decision/API pipeline is runnable end-to-end today, and so the exact
 * shape a real provider must produce (`AiReasoning`) is established. It
 * only summarizes evidence that was already computed deterministically
 * elsewhere; it never invents evidence or a decision.
 */
export class StubAiReasoningProvider implements AiReasoningProvider {
  readonly id = "stub";

  async generateReasoning(pipeline: StrategyPipelineResult, score: QuantitativeScore): Promise<AiReasoning> {
    const bias = pipeline.alignment.htf.bias;
    const evidence = pipeline.smcEvidence?.items ?? [];
    const strong = evidence.filter((e) => e.detection === "detected" && e.strength === "strong");
    const conflicting = evidence.filter((e) => e.detection === "detected" && e.strength === "conflicting");

    const marketContext = pipeline.setupEligible
      ? `XAUUSD structure is ${bias} on 4H, confirmed on 1H, and price has interacted with the ${bias === "bullish" ? "0.618–0.786" : "0.618–0.786"} golden zone of the latest impulse leg.`
      : pipeline.alignment.canProceed
        ? `4H and 1H are aligned ${bias}, but the lower-timeframe pullback has not yet reached the HTF golden zone.`
        : `4H and 1H directional bias currently disagree, so no continuation setup is being evaluated.`;

    const evidenceInterpretation =
      strong.length > 0
        ? `${strong.length} piece(s) of evidence show strong confluence: ${strong.map((e) => e.label).join(", ")}.`
        : "No strong-confidence evidence is currently present.";

    const conflictingEvidence =
      conflicting.length > 0
        ? `${conflicting.map((e) => e.label).join(", ")} conflict with a clean continuation read and should temper conviction.`
        : null;

    const finalReasoning = !pipeline.alignment.canProceed
      ? "Per the fixed alignment rule, 4H and 1H disagreement forces WAIT regardless of any other evidence."
      : !pipeline.setupEligible
        ? "The higher-timeframe setup is intact, but entering before the lower-timeframe pullback reaches the golden zone would be premature under the defined strategy rules."
        : score.total >= score.max * 0.6
          ? `Structure, zone interaction, and evidence confluence together support continuing in the ${bias} direction, subject to the invalidation level.`
          : "Structure and zone conditions are met, but overall evidence confluence is not yet strong enough to justify entry — standing aside preserves risk discipline.";

    return { marketContext, evidenceInterpretation, conflictingEvidence, finalReasoning };
  }
}
