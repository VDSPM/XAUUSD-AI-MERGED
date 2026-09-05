import type { Candle } from "../market/types.js";
import { env } from "../config/env.js";

export interface RawSwing {
  price: number;
  time: string;
  index: number;
}

/**
 * Detects raw swing highs/lows using a simple N-bar fractal: a candle is a
 * swing high if its high is greater than the high of every candle within
 * `lookback` bars on both sides (and symmetrically for swing lows).
 *
 * IMPORTANT: the project spec confirms *what counts as bullish/bearish
 * structure* (HH+HL vs LH+LL) but does not specify a swing-detection
 * algorithm — that is a necessary engineering mechanism, not a trading
 * rule. This fractal method with a configurable lookback
 * (`STRUCTURE_SWING_LOOKBACK`, default 2) is a reasonable, standard default
 * so the confirmed rules have something to operate on. It should be
 * revisited/confirmed with the user before this system is used for
 * anything beyond development, and can be swapped without touching any
 * other module — everything downstream only depends on the `RawSwing[]`
 * shape, with HH/HL/LH/LL classification done separately in structureService.
 */
export function detectRawSwings(
  candles: Candle[],
  lookback: number = env.structureSwingLookback
): { highs: RawSwing[]; lows: RawSwing[] } {
  const highs: RawSwing[] = [];
  const lows: RawSwing[] = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    const window = candles.slice(i - lookback, i + lookback + 1);
    const current = candles[i]!;

    const isSwingHigh = window.every((c) => c.high <= current.high);
    const isSwingLow = window.every((c) => c.low >= current.low);

    if (isSwingHigh) highs.push({ price: current.high, time: current.time, index: i });
    if (isSwingLow) lows.push({ price: current.low, time: current.time, index: i });
  }

  return { highs, lows };
}
