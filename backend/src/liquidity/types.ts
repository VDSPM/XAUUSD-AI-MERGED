export type LiquiditySide = "buy-side" | "sell-side";

export interface LiquidityPool {
  side: LiquiditySide;
  price: number;
  time: string;
  swept: boolean;
}

export interface LiquiditySweepEvent {
  side: LiquiditySide;
  poolPrice: number;
  sweepTime: string;
  sweepWickPrice: number;
  reclaimed: boolean;
}
