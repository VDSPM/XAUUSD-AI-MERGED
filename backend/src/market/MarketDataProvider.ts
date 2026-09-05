import type { Candle, CandleQuery, PriceSnapshot } from "./types.js";

/**
 * Abstraction every market data source must implement.
 *
 * The rest of the system (structure, pullback, fibonacci, smc, decision,
 * backtest) depends only on this interface — never on a concrete provider.
 * This is what lets the system support live XAUUSD data, historical
 * XAUUSD data, and multiple providers/timeframes without touching any
 * strategy code, per the project's architecture requirement.
 *
 * Implementations MUST:
 *  - Return candles sorted ascending by `time`.
 *  - Never return partially-formed candles (all OHLC fields present).
 *  - Throw a `ProviderError` (see src/types/errors.ts) on upstream failure,
 *    rather than returning empty/garbage data silently.
 */
export interface MarketDataProvider {
  readonly id: string;

  getPriceSnapshot(): Promise<PriceSnapshot>;

  getCandles(query: CandleQuery): Promise<Candle[]>;
}
