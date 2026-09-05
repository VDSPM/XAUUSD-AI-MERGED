/**
 * Fixed strategy constants.
 *
 * These represent the CONFIRMED rules from the project specification.
 * They are constants, not AI-tunable parameters, and no module in this
 * codebase should allow the AI reasoning layer to override them.
 */

export const INSTRUMENT = "XAUUSD" as const;

export const TIMEFRAMES = ["1D", "4H", "1H", "15M", "5M", "3M", "1M"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const HTF_STRUCTURE_TIMEFRAME: Timeframe = "4H";
export const LTF_CONFIRMATION_TIMEFRAME: Timeframe = "1H";
export const LOWER_TIMEFRAMES: Timeframe[] = ["15M", "5M", "3M", "1M"];

/** Golden zone — fixed by the strategy spec, not configurable. */
export const FIBONACCI_GOLDEN_ZONE = {
  low: 0.618,
  high: 0.786,
} as const;

export const FIBONACCI_REFERENCE_RATIOS = [0, 0.382, 0.5, 0.618, 0.786, 1] as const;
