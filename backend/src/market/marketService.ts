import type { MarketDataProvider } from "./MarketDataProvider.js";
import { MockMarketDataProvider } from "./providers/MockMarketDataProvider.js";
import { OandaMarketDataProvider } from "./providers/OandaMarketDataProvider.js";
import type { Candle, CandleQuery, DailyLevels, PriceSnapshot } from "./types.js";
import { env } from "../config/env.js";
import { InvalidDataError, StaleDataError } from "../types/errors.js";
import type { Timeframe } from "../config/constants.js";

/** Maximum acceptable age of the most recent candle before data is considered stale, per timeframe. */
const STALENESS_THRESHOLD_MINUTES: Record<Timeframe, number> = {
  "1D": 60 * 30,
  "4H": 60 * 6,
  "1H": 90,
  "15M": 30,
  "5M": 15,
  "3M": 10,
  "1M": 5,
};

function selectProvider(providerId: string): MarketDataProvider {
  switch (providerId) {
    case "mock":
      return new MockMarketDataProvider();

    case "oanda":
      return new OandaMarketDataProvider();

    default:
      throw new Error(
        `Unknown market data provider "${providerId}". Only "mock" is implemented in this foundation build. ` +
          `Implement MarketDataProvider and register it here to add a real provider.`
      );
  }
}

export class MarketService {
  constructor(private readonly provider: MarketDataProvider = selectProvider(env.marketDataProvider)) {}

  get providerId(): string {
    return this.provider.id;
  }

  async getPriceSnapshot(): Promise<PriceSnapshot> {
    return this.provider.getPriceSnapshot();
  }

  async getCandles(query: CandleQuery): Promise<Candle[]> {
    const candles = await this.provider.getCandles(query);
    this.validateCandles(candles, query.timeframe);
    return candles;
  }

  /**
   * Fetches candles and validates them are present, well-formed, and fresh.
   * Throws InvalidDataError / StaleDataError rather than returning bad data —
   * callers (the strategy pipeline) are expected to catch these and fall
   * back to a WAIT / insufficient-data decision, never to proceed on bad data.
   */
  async getValidatedCandles(query: CandleQuery): Promise<Candle[]> {
    return this.getCandles(query);
  }

  async getDailyLevels(): Promise<DailyLevels> {
    const dailyCandles = await this.getValidatedCandles({ timeframe: "1D", limit: 3 });
    if (dailyCandles.length < 2) {
      throw new InvalidDataError("Not enough daily candles to derive previous day's Open/Close");
    }
    const previous = dailyCandles[dailyCandles.length - 2]!;
    return {
      date: previous.time.slice(0, 10),
      previousOpen: previous.open,
      previousClose: previous.close,
      previousHigh: previous.high,
      previousLow: previous.low,
    };
  }

  private validateCandles(candles: Candle[], timeframe: Timeframe): void {
    if (!candles || candles.length === 0) {
      throw new InvalidDataError(`No candle data returned for timeframe ${timeframe}`);
    }

    for (const c of candles) {
      const values = [c.open, c.high, c.low, c.close];
      if (values.some((v) => typeof v !== "number" || Number.isNaN(v))) {
        throw new InvalidDataError(`Malformed candle at ${c.time} on timeframe ${timeframe}`);
      }
      if (c.high < c.low) {
        throw new InvalidDataError(`Candle at ${c.time} on timeframe ${timeframe} has high < low`);
      }
    }

    const last = candles[candles.length - 1]!;
    const ageMinutes = (Date.now() - new Date(last.time).getTime()) / 60_000;
    const threshold = STALENESS_THRESHOLD_MINUTES[timeframe];
    if (ageMinutes > threshold) {
      throw new StaleDataError(
        `Most recent ${timeframe} candle is ${Math.round(ageMinutes)} minutes old, exceeding the ${threshold} minute freshness threshold`
      );
    }
  }
}

export const marketService = new MarketService();
