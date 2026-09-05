import type { FibonacciZone } from "./types.js";
import type { HtfPullback } from "../pullback/types.js";
import type { DirectionBias } from "../structure/types.js";
import { FIBONACCI_GOLDEN_ZONE, FIBONACCI_REFERENCE_RATIOS } from "../config/constants.js";

/**
 * Computes the Fibonacci retracement of the HTF impulse leg identified by
 * the pullback module. Ratios and the golden zone (0.618–0.786) are fixed
 * by the confirmed strategy spec — nothing here is configurable or
 * AI-adjustable.
 */
export function computeFibonacciZone(pullback: HtfPullback, currentPrice: number, direction: DirectionBias): FibonacciZone {
  const bullish = direction === "bullish";
  const swingLow = bullish ? pullback.originSwing.price : pullback.targetSwing.price;
  const swingHigh = bullish ? pullback.targetSwing.price : pullback.originSwing.price;
  const range = swingHigh - swingLow;

  // Retracement is measured back from the impulse leg's terminal point.
  const priceAt = (ratio: number) => (bullish ? swingHigh - range * ratio : swingLow + range * ratio);

  const levels = FIBONACCI_REFERENCE_RATIOS.map((ratio) => ({
    ratio,
    price: Number(priceAt(ratio).toFixed(2)),
  }));

  const goldenZoneLow = Number(
    Math.min(priceAt(FIBONACCI_GOLDEN_ZONE.low), priceAt(FIBONACCI_GOLDEN_ZONE.high)).toFixed(2)
  );
  const goldenZoneHigh = Number(
    Math.max(priceAt(FIBONACCI_GOLDEN_ZONE.low), priceAt(FIBONACCI_GOLDEN_ZONE.high)).toFixed(2)
  );

  return {
    swingHigh,
    swingLow,
    direction,
    goldenZoneLow,
    goldenZoneHigh,
    currentPrice,
    priceInsideZone: currentPrice >= goldenZoneLow && currentPrice <= goldenZoneHigh,
    levels,
  };
}
