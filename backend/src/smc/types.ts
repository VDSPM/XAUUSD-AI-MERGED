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
}

export interface SmcEvidenceSet {
  asOf: string;
  items: SmcEvidenceItem[];
}
