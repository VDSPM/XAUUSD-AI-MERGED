import type {
  DirectionAlignment,
  FibonacciZone,
  HtfPullback,
  LowerTimeframeAnalysis,
  TimeframeStructure,
} from "@/types";

export const mock4hStructure: TimeframeStructure = {
  timeframe: "4H",
  bias: "bullish",
  swingPoints: [
    { type: "HL", price: 2384.2, time: new Date(Date.now() - 3600_000 * 40).toISOString() },
    { type: "HH", price: 2411.6, time: new Date(Date.now() - 3600_000 * 28).toISOString() },
    { type: "HL", price: 2398.75, time: new Date(Date.now() - 3600_000 * 16).toISOString() },
    { type: "HH", price: 2424.1, time: new Date(Date.now() - 3600_000 * 4).toISOString() },
  ],
  summary: "Sequence of higher highs and higher lows intact since the London open two sessions ago.",
};

export const mock1hStructure: TimeframeStructure = {
  timeframe: "1H",
  bias: "bullish",
  swingPoints: [
    { type: "HL", price: 2409.3, time: new Date(Date.now() - 3600_000 * 9).toISOString() },
    { type: "HH", price: 2419.85, time: new Date(Date.now() - 3600_000 * 5).toISOString() },
    { type: "HL", price: 2412.4, time: new Date(Date.now() - 3600_000 * 2).toISOString() },
  ],
  summary: "1H structure confirms 4H bias with a clean higher low reaction off session open.",
};

export const mockDirectionAlignment: DirectionAlignment = {
  htf: mock4hStructure,
  ltfConfirmation: mock1hStructure,
  state: "aligned-bullish",
  canProceed: true,
  ruleNote: "4H and 1H agree — analysis is permitted to continue. This rule cannot be overridden by AI.",
};

export const mockHtfPullback: HtfPullback = {
  timeframe: "4H",
  originSwing: { type: "HL", price: 2398.75, time: new Date(Date.now() - 3600_000 * 16).toISOString() },
  targetSwing: { type: "HH", price: 2424.1, time: new Date(Date.now() - 3600_000 * 4).toISOString() },
  state: "reached-zone",
  description: "Price pulled back into the 4H swing range following the latest higher high.",
};

export const mockFibonacciZone: FibonacciZone = {
  swingHigh: 2424.1,
  swingLow: 2398.75,
  direction: "bullish",
  goldenZoneLow: 2408.75,
  goldenZoneHigh: 2412.99,
  currentPrice: 2418.63,
  priceInsideZone: false,
  levels: [
    { ratio: 0, price: 2424.1 },
    { ratio: 0.382, price: 2414.42 },
    { ratio: 0.5, price: 2411.43 },
    { ratio: 0.618, price: 2408.75 },
    { ratio: 0.786, price: 2412.99 },
    { ratio: 1, price: 2398.75 },
  ],
};

export const mockLowerTimeframeAnalysis: LowerTimeframeAnalysis[] = [
  { timeframe: "15M", state: "approaching-zone", note: "Momentum slowing as price nears the 0.618 boundary." },
  { timeframe: "5M", state: "approaching-zone", note: "Minor lower highs forming, consistent with a corrective leg." },
  { timeframe: "3M", state: "awaiting-pullback", note: "No clear reaction yet inside the zone." },
  { timeframe: "1M", state: "awaiting-pullback", note: "Insufficient data to assess micro-structure reaction." },
];
