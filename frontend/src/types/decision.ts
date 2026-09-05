export type TradeDecision = "BUY" | "SELL" | "WAIT";

export interface QuantitativeScore {
  total: number; // 0-100, deterministic
  max: number;
  breakdown: { factor: string; points: number; maxPoints: number }[];
}

export interface AiReasoning {
  marketContext: string;
  evidenceInterpretation: string;
  conflictingEvidence: string | null;
  finalReasoning: string;
}

export interface DecisionEvidenceRef {
  id: string;
  label: string;
  supports: boolean; // true = supports decision, false = weighs against
  strength: "strong" | "moderate" | "weak" | "conflicting";
}

export interface AnalysisDecision {
  id: string;
  asOf: string;
  instrument: "XAUUSD";
  decision: TradeDecision;
  /** 0-100. Not a guaranteed win probability — pending backtest calibration. */
  confidence: number;
  confidenceCalibrated: boolean;
  quantitativeScore: QuantitativeScore;
  aiReasoning: AiReasoning;
  evidence: DecisionEvidenceRef[];
  invalidation: string;
  reason: string;
}
