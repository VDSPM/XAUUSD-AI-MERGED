import type { Candle } from "../market/types.js";
import type { LiquidityPool, LiquiditySweepEvent } from "./types.js";
import { detectRawSwings } from "../structure/swingDetector.js";

/**
 * Default liquidity model (engineering default, not a confirmed rule):
 * the most recent unmitigated swing high/low is treated as resting
 * buy-side/sell-side liquidity respectively. A pool is "swept" if a later
 * candle's wick trades through it. This is a standard, common definition
 * but the exact thresholds are not part of the confirmed strategy spec and
 * should be validated by the user.
 */
export class LiquidityService {
  identifyPools(candles: Candle[]): LiquidityPool[] {
    const { highs, lows } = detectRawSwings(candles);
    const pools: LiquidityPool[] = [];

    for (const h of highs) {
      const swept = candles.slice(h.index + 1).some((c) => c.high > h.price);
      pools.push({ side: "buy-side", price: h.price, time: h.time, swept });
    }
    for (const l of lows) {
      const swept = candles.slice(l.index + 1).some((c) => c.low < l.price);
      pools.push({ side: "sell-side", price: l.price, time: l.time, swept });
    }

    return pools.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }

  detectSweeps(candles: Candle[]): LiquiditySweepEvent[] {
    const pools = this.identifyPools(candles).filter((p) => p.swept);
    const events: LiquiditySweepEvent[] = [];

    for (const pool of pools) {
      const poolIndex = candles.findIndex((c) => c.time === pool.time);
      const after = candles.slice(poolIndex + 1);
      const sweepCandle = after.find((c) =>
        pool.side === "buy-side" ? c.high > pool.price : c.low < pool.price
      );
      if (!sweepCandle) continue;

      const reclaimed =
        pool.side === "buy-side" ? sweepCandle.close < pool.price : sweepCandle.close > pool.price;

      events.push({
        side: pool.side,
        poolPrice: pool.price,
        sweepTime: sweepCandle.time,
        sweepWickPrice: pool.side === "buy-side" ? sweepCandle.high : sweepCandle.low,
        reclaimed,
      });
    }

    return events;
  }
}

export const liquidityService = new LiquidityService();
