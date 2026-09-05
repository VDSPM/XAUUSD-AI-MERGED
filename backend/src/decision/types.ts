import type { QuantitativeScore } from "../scoring/types.js";
import type { AiReasoning } from "../ai/types.js";

export type TradeDecision = "BUY" | "SELL" | "WAIT";

export interface DecisionEvidenceRef {
  id: string;
  label: string;
  supports: boolean;
  strength: "strong" | "moderate" | "weak" | "conflicting";
}

export interface AnalysisDecision {
  id: string;
  asOf: string;
  instrument: "XAUUSD";
  decision: TradeDecision;
  confidence: number;
  confidenceCalibrated: false;
  quantitativeScore: QuantitativeScore;
  aiReasoning: AiReasoning;
  evidence: DecisionEvidenceRef[];
  invalidation: string;
  reason: string;
  strategyVersion: string;
}
