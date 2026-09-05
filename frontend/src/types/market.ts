/**
 * Market data types.
 * These describe the shape of live/historical XAUUSD data.
 * The backend is expected to implement endpoints/streams that satisfy these shapes.
 */

export type Instrument = "XAUUSD";

export type MarketSessionName = "Sydney" | "Tokyo" | "London" | "New York";

export type MarketStatus = "open" | "closed" | "pre-open" | "holiday" | "unknown";

export interface SessionInfo {
  name: MarketSessionName;
  active: boolean;
  opensInMinutes: number | null;
  closesInMinutes: number | null;
}

export interface PriceSnapshot {
  instrument: Instrument;
  price: number;
  changeAbs: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  bid: number;
  ask: number;
  spread: number;
  asOf: string; // ISO timestamp
  status: MarketStatus;
  activeSessions: SessionInfo[];
}

export type Timeframe = "1D" | "4H" | "1H" | "15M" | "5M" | "3M" | "1M";

export interface Candle {
  time: string; // ISO timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface DailyLevels {
  date: string; // ISO date of the reference day
  previousOpen: number;
  previousClose: number;
  previousHigh: number;
  previousLow: number;
  /** Contextual only — these levels never auto-trigger a trade. */
  note: string;
}
