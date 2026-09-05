import type { HtfPullback, LowerTimeframeAnalysis, LtfPullbackState, PullbackState } from "./types.js";
import type { DirectionAlignment } from "../structure/types.js";
import { HTF_STRUCTURE_TIMEFRAME, LOWER_TIMEFRAMES } from "../config/constants.js";
import { marketService } from "../market/marketService.js";
import { InvalidDataError } from "../types/errors.js";
import type { FibonacciZone } from "../fibonacci/types.js";

/**
 * Identifies the higher-timeframe impulse leg whose retracement forms the
 * Fibonacci golden zone.
 *
 * ASSUMPTION (engineering default, flagged for user confirmation): the
 * relevant leg is the most recent HTF swing-low-to-swing-high (or
 * swing-high-to-swing-low, for bearish) segment from the already-classified
 * 4H structure — i.e. the leg that produced the latest HH (bullish) or LL
 * (bearish). The project spec confirms a HTF pullback step exists but does
 * not specify which swing anchors it; this default was marked
 * "UNDEFINED — USER DECISION REQUIRED" during project scoping and should be
 * confirmed before this logic is relied upon beyond development.
 */
export function identifyHtfPullback(alignment: DirectionAlignment, currentPrice: number): HtfPullback {
  const { htf } = alignment;
  const highs = htf.swingPoints.filter((s) => s.type === "HH" || s.type === "LH");
  const lows = htf.swingPoints.filter((s) => s.type === "HL" || s.type === "LL");
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];

  if (!lastHigh || !lastLow) {
    throw new InvalidDataError("Cannot identify HTF pullback without classified swing points");
  }

  const bullish = alignment.state === "aligned-bullish";
  const originSwing = bullish ? lastLow : lastHigh;
  const targetSwing = bullish ? lastHigh : lastLow;

  const legLow = Math.min(originSwing.price, targetSwing.price);
  const legHigh = Math.max(originSwing.price, targetSwing.price);
  const zoneLow = legLow + (legHigh - legLow) * (1 - 0.786);
  const zoneHigh = legLow + (legHigh - legLow) * (1 - 0.618);

  let state: PullbackState;
  if (currentPrice >= zoneLow && currentPrice <= zoneHigh) {
    state = "reached-zone";
  } else if ((bullish && currentPrice > zoneHigh) || (!bullish && currentPrice < zoneLow)) {
    state = "forming";
  } else {
    state = "not-yet-reached";
  }

  return {
    timeframe: HTF_STRUCTURE_TIMEFRAME,
    originSwing,
    targetSwing,
    state,
    description:
      state === "reached-zone"
        ? `Price has pulled back into the ${HTF_STRUCTURE_TIMEFRAME} golden zone of the latest impulse leg.`
        : state === "forming"
          ? `Price is retracing from the latest ${HTF_STRUCTURE_TIMEFRAME} extreme but has not yet reached the golden zone.`
          : `No qualifying pullback into the golden zone detected yet on ${HTF_STRUCTURE_TIMEFRAME}.`,
  };
}

/**
 * CONFIRMED RULE: the lower-timeframe pullback must reach/fill the HTF
 * Fibonacci 0.618–0.786 zone before the setup proceeds. This function only
 * reports whether that condition holds per configured lower timeframe — it
 * does not invent any additional entry-trigger logic beyond that.
 */
export class PullbackService {
  async getLowerTimeframeAnalysis(fib: FibonacciZone): Promise<LowerTimeframeAnalysis[]> {
    const results: LowerTimeframeAnalysis[] = [];

    for (const timeframe of LOWER_TIMEFRAMES) {
      const candles = await marketService.getValidatedCandles({ timeframe, limit: 30 });
      const last = candles[candles.length - 1]!;

      let state: LtfPullbackState;
      let note: string;

      if (last.low <= fib.goldenZoneHigh && last.high >= fib.goldenZoneLow) {
        state = "filled-zone";
        note = `${timeframe} price action has traded into the HTF golden zone.`;
      } else if (
        (fib.direction === "bullish" && last.close > fib.goldenZoneHigh) ||
        (fib.direction === "bearish" && last.close < fib.goldenZoneLow)
      ) {
        state = "approaching-zone";
        note = `${timeframe} is retracing toward the golden zone but has not reached it yet.`;
      } else if (
        (fib.direction === "bullish" && last.close < fib.goldenZoneLow) ||
        (fib.direction === "bearish" && last.close > fib.goldenZoneHigh)
      ) {
        state = "overextended";
        note = `${timeframe} has traded through the golden zone without a confirmed reaction.`;
      } else {
        state = "awaiting-pullback";
        note = `${timeframe} has not yet shown a pullback toward the golden zone.`;
      }

      results.push({ timeframe, state, note });
    }

    return results;
  }
}

export const pullbackService = new PullbackService();
