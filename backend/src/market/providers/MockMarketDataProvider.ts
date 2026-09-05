import type { MarketDataProvider } from "../MarketDataProvider.js";
import type { Candle, CandleQuery, PriceSnapshot } from "../types.js";
import type { Timeframe } from "../../config/constants.js";
import { ProviderError } from "../../types/errors.js";

const TIMEFRAME_MINUTES: Record<Timeframe, number> = {
  "1D": 1440,
  "4H": 240,
  "1H": 60,
  "15M": 15,
  "5M": 5,
  "3M": 3,
  "1M": 1,
};

/**
 * Deterministic synthetic-data provider.
 *
 * This exists so the rest of the system (structure, pullback, fibonacci,
 * smc, decision, API) can be built, run, and tested end-to-end today
 * without a real market data subscription. It implements the same
 * `MarketDataProvider` interface a live/historical provider would, so
 * swapping it out later requires no changes outside `market/providers/`
 * and the provider selection in `market/marketService.ts`.
 *
 * The generator is seeded per-timeframe so repeated calls within a process
 * lifetime return a stable, internally consistent series (e.g. the 4H
 * series and 1H series trend in the same general direction), which keeps
 * the structure/pullback/fibonacci pipeline coherent for manual testing.
 */
export class MockMarketDataProvider implements MarketDataProvider {
  readonly id = "mock";

  private readonly basePrice = 2400;
  private candleCache = new Map<Timeframe, Candle[]>();

  async getPriceSnapshot(): Promise<PriceSnapshot> {
    const candles = await this.getCandles({ timeframe: "1H", limit: 24 });
    const last = candles[candles.length - 1];
    if (!last) {
      throw new ProviderError("Mock provider failed to generate candles for price snapshot");
    }
    const dayHigh = Math.max(...candles.map((c) => c.high));
    const dayLow = Math.min(...candles.map((c) => c.low));
    const spread = 0.24;

    return {
      instrument: "XAUUSD",
      price: last.close,
      bid: Number((last.close - spread / 2).toFixed(2)),
      ask: Number((last.close + spread / 2).toFixed(2)),
      spread,
      dayHigh,
      dayLow,
      asOf: last.time,
      status: "open",
    };
  }

  async getCandles(query: CandleQuery): Promise<Candle[]> {
    const { timeframe, limit = 200 } = query;
    if (!(timeframe in TIMEFRAME_MINUTES)) {
      throw new ProviderError(`Mock provider does not support timeframe "${timeframe}"`);
    }

    let series = this.candleCache.get(timeframe);
    if (!series) {
      series = this.generateSeries(timeframe, Math.max(limit, 300));
      this.candleCache.set(timeframe, series);
    }

    let filtered = series;
    if (query.from) filtered = filtered.filter((c) => c.time >= query.from!);
    if (query.to) filtered = filtered.filter((c) => c.time <= query.to!);

    return filtered.slice(-limit);
  }

  private generateSeries(timeframe: Timeframe, count: number): Candle[] {
    const stepMinutes = TIMEFRAME_MINUTES[timeframe];
    const candles: Candle[] = [];
    let price = this.basePrice;
    const now = Date.now();

    // Simple deterministic pseudo-random generator so results are stable
    // across calls/tests within a process (not cryptographically random —
    // this is synthetic test data, not live market data).
    let seed = timeframe.charCodeAt(0) * 7919 + timeframe.length;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    for (let i = count; i >= 0; i--) {
      const open = price;
      const drift = Math.sin(i / 8) * 2.2 + (rand() - 0.48) * 2.4;
      const close = Number((open + drift).toFixed(2));
      const high = Number((Math.max(open, close) + rand() * 1.4).toFixed(2));
      const low = Number((Math.min(open, close) - rand() * 1.4).toFixed(2));
      const time = new Date(now - i * stepMinutes * 60_000).toISOString();

      candles.push({ time, open, high, low, close, volume: Math.round(500 + rand() * 1500) });
      price = close;
    }

    return candles;
  }
}
