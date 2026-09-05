import type { AiReasoning } from "./types.js";
import type { StrategyPipelineResult } from "../strategy/types.js";
import type { QuantitativeScore } from "../scoring/types.js";

/**
 * Abstraction for the AI reasoning layer.
 *
 * The "controlled-freedom AI" concept from the project spec means the AI
 * evaluates and explains evidence within boundaries set by fixed rules —
 * it never decides direction or overrides `setupEligible`. This interface
 * enforces that boundary at the type level: implementations receive the
 * already-computed pipeline + score and only produce explanatory text,
 * never a BUY/SELL/WAIT verdict (that remains the decision engine's job).
 *
 * No concrete AI backend is wired up in this foundation build — see
 * `providers/StubAiReasoningProvider.ts` for a deterministic, template-based
 * placeholder. Swap in a real provider (e.g. an LLM call) by implementing
 * this interface; no other module needs to change.
 */
export interface AiReasoningProvider {
  readonly id: string;
  generateReasoning(pipeline: StrategyPipelineResult, score: QuantitativeScore): Promise<AiReasoning>;
}
