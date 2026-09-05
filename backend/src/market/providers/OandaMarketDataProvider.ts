import type { MarketDataProvider } from "../MarketDataProvider.js";
import type { Candle, CandleQuery, PriceSnapshot } from "../types.js";
import type { Timeframe } from "../../config/constants.js";
import { env } from "../../config/env.js";
import { ProviderError } from "../../types/errors.js";

const GRANULARITY: Record<Timeframe, string> = {
  "1D": "D",
  "4H": "H4",
  "1H": "H1",
  "15M": "M15",
  "5M": "M5",
  "3M": "M3",
  "1M": "M1",
};

type OandaCandle = {
  time: string;
  complete: boolean;
  volume: number;
  mid?: {
    o: string;
    h: string;
    l: string;
    c: string;
  };
};

type OandaCandlesResponse = {
  candles?: OandaCandle[];
};

type OandaPrice = {
  instrument: string;
  time: string;
  bids?: Array<{ price: string }>;
  asks?: Array<{ price: string }>;
};

type OandaPricingResponse = {
  prices?: OandaPrice[];
};

export class OandaMarketDataProvider implements MarketDataProvider {
  readonly id = "oanda";

  private readonly baseUrl =
    env.oandaEnvironment === "live"
      ? "https://api-fxtrade.oanda.com"
      : "https://api-fxpractice.oanda.com";

  private readonly instrument = env.oandaInstrument;

  private async request<T>(path: string): Promise<T> {
    if (!env.oandaApiKey) {
      throw new ProviderError(
        "OANDA_API_KEY is missing. Add your OANDA personal access token to backend/.env"
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.oandaApiKey}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10_000),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new ProviderError(
          `OANDA API request failed (${response.status}): ${text.slice(0, 500)}`
        );
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        throw new ProviderError("OANDA returned an invalid JSON response");
      }
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);

      throw new ProviderError(`Unable to reach OANDA: ${message}`);
    }
  }

  async getPriceSnapshot(): Promise<PriceSnapshot> {
    const pricing = await this.request<OandaPricingResponse>(
      `/v3/accounts/${encodeURIComponent(env.oandaAccountId)}/pricing?instruments=${encodeURIComponent(
        this.instrument
      )}`
    );

    const price = pricing.prices?.[0];

    if (!price) {
      throw new ProviderError(
        `OANDA returned no price for ${this.instrument}`
      );
    }

    const bid = Number(price.bids?.[0]?.price);
    const ask = Number(price.asks?.[0]?.price);

    if (!Number.isFinite(bid) || !Number.isFinite(ask)) {
      throw new ProviderError(
        `OANDA returned invalid bid/ask for ${this.instrument}`
      );
    }

    const mid = (bid + ask) / 2;
    const spread = ask - bid;

    const daily = await this.getCandles({
      timeframe: "1D",
      limit: 1,
    });

    const dayCandle = daily[daily.length - 1];

    if (!dayCandle) {
      throw new ProviderError(
        `OANDA returned no daily candle for ${this.instrument}`
      );
    }

    return {
      instrument: "XAUUSD",
      price: Number(mid.toFixed(5)),
      bid: Number(bid.toFixed(5)),
      ask: Number(ask.toFixed(5)),
      spread: Number(spread.toFixed(5)),
      dayHigh: dayCandle.high,
      dayLow: dayCandle.low,
      asOf: price.time,
      status: "open",
    };
  }

  async getCandles(query: CandleQuery): Promise<Candle[]> {
    const granularity = GRANULARITY[query.timeframe];

    if (!granularity) {
      throw new ProviderError(
        `OANDA does not support timeframe "${query.timeframe}"`
      );
    }

    const params = new URLSearchParams();

    params.set("granularity", granularity);

    if (query.limit !== undefined) {
      params.set("count", String(Math.min(Math.max(query.limit, 1), 5000)));
    } else {
      params.set("count", "200");
    }

    if (query.from) {
      params.set("from", query.from);
    }

    if (query.to) {
      params.set("to", query.to);
    }

    params.set("price", "M");

    const data = await this.request<OandaCandlesResponse>(
      `/v3/instruments/${encodeURIComponent(
        this.instrument
      )}/candles?${params.toString()}`
    );

    const candles = (data.candles ?? [])
      .filter((c) => c.mid)
      .map((c): Candle => ({
        time: c.time,
        open: Number(c.mid!.o),
        high: Number(c.mid!.h),
        low: Number(c.mid!.l),
        close: Number(c.mid!.c),
        volume: c.volume,
      }))
      .sort((a, b) => a.time.localeCompare(b.time));

    if (candles.length === 0) {
      throw new ProviderError(
        `OANDA returned no candles for ${this.instrument} ${query.timeframe}`
      );
    }

    return candles;
  }
}