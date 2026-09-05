import type { Timeframe } from "../config/constants.js";

export type SwingPointType = "HH" | "HL" | "LH" | "LL";

export interface SwingPoint {
  type: SwingPointType;
  price: number;
  time: string;
  /** Index into the candle array this swing point was detected from. */
  index: number;
}

export type DirectionBias = "bullish" | "bearish" | "undetermined";

export interface TimeframeStructure {
  timeframe: Timeframe;
  bias: DirectionBias;
  swingPoints: SwingPoint[];
  summary: string;
}

export type AlignmentState = "aligned-bullish" | "aligned-bearish" | "conflicting" | "undetermined";

export interface DirectionAlignment {
  htf: TimeframeStructure;
  ltfConfirmation: TimeframeStructure;
  state: AlignmentState;
  /**
   * Fixed rule output: true only when 4H and 1H agree on direction.
   * No AI or scoring layer may override this to true when it is false.
   */
  canProceed: boolean;
  ruleNote: string;
}
