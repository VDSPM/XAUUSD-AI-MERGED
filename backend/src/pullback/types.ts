import type { Timeframe } from "../config/constants.js";
import type { SwingPoint } from "../structure/types.js";

export type PullbackState = "forming" | "reached-zone" | "not-yet-reached" | "invalidated";

export interface HtfPullback {
  timeframe: Timeframe;
  originSwing: SwingPoint;
  targetSwing: SwingPoint;
  state: PullbackState;
  description: string;
}

export type LtfPullbackState = "awaiting-pullback" | "approaching-zone" | "filled-zone" | "overextended";

export interface LowerTimeframeAnalysis {
  timeframe: Timeframe;
  state: LtfPullbackState;
  note: string;
}
