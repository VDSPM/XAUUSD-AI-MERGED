import type { DirectionBias } from "../structure/types.js";

export interface FibonacciLevel {
  ratio: number;
  price: number;
}

export interface FibonacciZone {
  swingHigh: number;
  swingLow: number;
  direction: DirectionBias;
  /** 0.618 level, fixed by the strategy spec. */
  goldenZoneLow: number;
  /** 0.786 level, fixed by the strategy spec. */
  goldenZoneHigh: number;
  currentPrice: number;
  priceInsideZone: boolean;
  levels: FibonacciLevel[];
}
