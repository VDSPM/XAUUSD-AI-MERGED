import type { Timeframe } from "./market";

export type DirectionBias = "bullish" | "bearish" | "undetermined";

export type SwingPointType = "HH" | "HL" | "LH" | "LL";

export interface SwingPoint {
  type: SwingPointType;
  price: number;
  time: string; // ISO timestamp
}

export interface TimeframeStructure {
  timeframe: Timeframe;
  bias: DirectionBias;
  swingPoints: SwingPoint[];
  summary: string;
}

export type AlignmentState = "aligned-bullish" | "aligned-bearish" | "conflicting";

export interface DirectionAlignment {
  htf: TimeframeStructure; // 4H
  ltfConfirmation: TimeframeStructure; // 1H
  state: AlignmentState;
  /** True only when 4H and 1H agree — fixed rule, not AI-adjustable. */
  canProceed: boolean;
  ruleNote: string;
}

export type PullbackState = "forming" | "reached-zone" | "not-yet-reached" | "invalidated";

export interface HtfPullback {
  timeframe: Timeframe;
  originSwing: SwingPoint;
  targetSwing: SwingPoint;
  state: PullbackState;
  description: string;
}

export interface FibonacciZone {
  swingHigh: number;
  swingLow: number;
  direction: DirectionBias;
  goldenZoneLow: number; // 0.618
  goldenZoneHigh: number; // 0.786
  currentPrice: number;
  priceInsideZone: boolean;
  levels: { ratio: number; price: number }[];
}

export type LtfPullbackState =
  | "awaiting-pullback"
  | "approaching-zone"
  | "filled-zone"
  | "overextended";

export interface LowerTimeframeAnalysis {
  timeframe: Timeframe;
  state: LtfPullbackState;
  note: string;
}
