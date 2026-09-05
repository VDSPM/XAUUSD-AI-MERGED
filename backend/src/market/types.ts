import type { Timeframe } from "../config/constants.js";

export interface Candle {
  time: string; // ISO timestamp, candle open time
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

export type MarketStatus = "open" | "closed" | "pre-open" | "holiday" | "unknown";

export interface PriceSnapshot {
  instrument: "XAUUSD";
  price: number;
  bid: number;
  ask: number;
  spread: number;
  dayHigh: number;
  dayLow: number;
  asOf: string; // ISO timestamp
  status: MarketStatus;
}

export interface CandleQuery {
  timeframe: Timeframe;
  /** Number of most recent candles to return. */
  limit?: number;
  /** Restrict to candles at/after this ISO timestamp. */
  from?: string;
  /** Restrict to candles at/before this ISO timestamp. */
  to?: string;
}

export interface DailyLevels {
  date: string; // ISO date of the reference day
  previousOpen: number;
  previousClose: number;
  previousHigh: number;
  previousLow: number;
}
