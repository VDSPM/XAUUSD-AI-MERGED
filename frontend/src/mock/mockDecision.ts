import type { AnalysisDecision } from "@/types";

export const mockDecision: AnalysisDecision = {
  id: "an_2026_08_27_0930",
  asOf: new Date().toISOString(),
  instrument: "XAUUSD",
  decision: "WAIT",
  confidence: 58,
  confidenceCalibrated: false,
  quantitativeScore: {
    total: 64,
    max: 100,
    breakdown: [
      { factor: "Directional alignment (4H/1H)", points: 20, maxPoints: 20 },
      { factor: "Golden zone proximity", points: 8, maxPoints: 15 },
      { factor: "SMC evidence confluence", points: 22, maxPoints: 30 },
      { factor: "Session quality", points: 10, maxPoints: 10 },
      { factor: "Volatility conditions", points: 4, maxPoints: 15 },
      { factor: "Lower-timeframe reaction", points: 0, maxPoints: 10 },
    ],
  },
  aiReasoning: {
    marketContext:
      "XAUUSD is trading within an established bullish 4H structure, confirmed on the 1H timeframe. Price has pulled back from the recent high but has not yet tapped the 0.618–0.786 golden zone.",
    evidenceInterpretation:
      "Break of structure and displacement on the 1H timeframe are strong bullish signals, reinforced by a bullish order block sitting inside the golden zone. Liquidity above the prior high provides a logical draw on price.",
    conflictingEvidence:
      "Volatility is elevated ahead of the US CPI release, which raises the risk of a false reaction inside the zone. Lower timeframes have not yet shown a confirmed reaction.",
    finalReasoning:
      "The higher-timeframe setup is well-formed, but price has not reached the golden zone and no lower-timeframe confirmation exists yet. Entering now would be premature under the defined strategy rules. Standing aside until the zone is tapped and a reaction is confirmed keeps risk aligned with the plan.",
  },
  evidence: [
    { id: "ev-bos", label: "Break of Structure (1H)", supports: true, strength: "strong" },
    { id: "ev-displacement", label: "Displacement (1H)", supports: true, strength: "strong" },
    { id: "ev-ob", label: "Order Block in golden zone", supports: true, strength: "moderate" },
    { id: "ev-liquidity", label: "Liquidity pool above high", supports: true, strength: "strong" },
    { id: "ev-volatility", label: "Elevated volatility (CPI risk)", supports: false, strength: "conflicting" },
  ],
  invalidation: "A confirmed close below 2398.75 (origin of the current 4H higher low) invalidates the bullish setup.",
  reason: "Price has not yet reached the 0.618–0.786 golden zone and no lower-timeframe pullback confirmation exists.",
};
