export type SmcEvidenceKind =
  | "liquidity"
  | "liquidity-sweep"
  | "bos"
  | "choch"
  | "order-block"
  | "fvg"
  | "displacement"
  | "premium-discount"
  | "volatility"
  | "session";

export type EvidenceDetection = "detected" | "not-detected";

export type EvidenceStrength = "strong" | "moderate" | "weak" | "conflicting";

export interface SmcEvidenceItem {
  id: string;
  kind: SmcEvidenceKind;
  label: string;
  detection: EvidenceDetection;
  strength: EvidenceStrength | null;
  timeframe: string;
  detail: string;
  /**
   * Relevance/weight assigned by the AI evidence-evaluation layer.
   * 0-1. Populated by backend AI service, not computed in the frontend.
   */
  aiRelevance: number | null;
}

export interface SmcEvidenceSet {
  asOf: string;
  items: SmcEvidenceItem[];
}
