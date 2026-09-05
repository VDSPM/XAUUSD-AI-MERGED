import type { Candle } from "../market/types.js";
import { detectRawSwings, type RawSwing } from "./swingDetector.js";
import type { DirectionAlignment, DirectionBias, SwingPoint, TimeframeStructure } from "./types.js";
import { HTF_STRUCTURE_TIMEFRAME, LTF_CONFIRMATION_TIMEFRAME, type Timeframe } from "../config/constants.js";
import { marketService } from "../market/marketService.js";

/**
 * Classifies the last two swing highs and last two swing lows into
 * HH/LH and HL/LL respectively, then applies the CONFIRMED rule:
 *   HH + HL => bullish
 *   LH + LL => bearish
 *   anything else => undetermined
 */
export function classifyStructure(timeframe: Timeframe, candles: Candle[]): TimeframeStructure {
  const { highs, lows } = detectRawSwings(candles);

  if (highs.length < 2 || lows.length < 2) {
    return {
      timeframe,
      bias: "undetermined",
      swingPoints: [],
      summary: "Not enough confirmed swing points yet to classify structure.",
    };
  }

  const [prevHigh, lastHigh] = highs.slice(-2) as [RawSwing, RawSwing];
  const [prevLow, lastLow] = lows.slice(-2) as [RawSwing, RawSwing];

  const higherHigh = lastHigh.price > prevHigh.price;
  const higherLow = lastLow.price > prevLow.price;
  const lowerHigh = lastHigh.price < prevHigh.price;
  const lowerLow = lastLow.price < prevLow.price;

  let bias: DirectionBias = "undetermined";
  if (higherHigh && higherLow) bias = "bullish";
  else if (lowerHigh && lowerLow) bias = "bearish";

  const lastHighType: SwingPoint["type"] = higherHigh ? "HH" : "LH";
  const lastLowType: SwingPoint["type"] = higherLow ? "HL" : "LL";
  // The previous swing is labeled relative to what came before it; without a
  // third data point we label it opposite the last swing's direction as a
  // reasonable default for display purposes only — it does not affect the
  // bias classification above, which only compares prevHigh/lastHigh and
  // prevLow/lastLow price values directly.
  const prevHighType: SwingPoint["type"] = lastHighType === "HH" ? "LH" : "HH";
  const prevLowType: SwingPoint["type"] = lastLowType === "HL" ? "LL" : "HL";

  const swingPoints: SwingPoint[] = [
    { type: prevHighType, price: prevHigh.price, time: prevHigh.time, index: prevHigh.index },
    { type: lastHighType, price: lastHigh.price, time: lastHigh.time, index: lastHigh.index },
    { type: prevLowType, price: prevLow.price, time: prevLow.time, index: prevLow.index },
    { type: lastLowType, price: lastLow.price, time: lastLow.time, index: lastLow.index },
  ].sort((a, b) => a.index - b.index);

  const summary =
    bias === "bullish"
      ? `Sequence of higher highs and higher lows detected on ${timeframe}.`
      : bias === "bearish"
        ? `Sequence of lower highs and lower lows detected on ${timeframe}.`
        : `Swing sequence on ${timeframe} does not form a clean HH+HL or LH+LL pattern.`;

  return { timeframe, bias, swingPoints, summary };
}

export class StructureService {
  /**
   * Implements the CONFIRMED rule: 4H direction must be confirmed by 1H.
   * If they disagree, `canProceed` is false and the caller (decision
   * engine) MUST treat this as WAIT — no scoring or AI layer may override it.
   */
  async getDirectionAlignment(): Promise<DirectionAlignment> {
    const [htfCandles, ltfCandles] = await Promise.all([
      marketService.getValidatedCandles({ timeframe: HTF_STRUCTURE_TIMEFRAME, limit: 200 }),
      marketService.getValidatedCandles({ timeframe: LTF_CONFIRMATION_TIMEFRAME, limit: 200 }),
    ]);

    const htf = classifyStructure(HTF_STRUCTURE_TIMEFRAME, htfCandles);
    const ltfConfirmation = classifyStructure(LTF_CONFIRMATION_TIMEFRAME, ltfCandles);

    let state: DirectionAlignment["state"];
    let canProceed: boolean;
    let ruleNote: string;

    if (htf.bias === "undetermined" || ltfConfirmation.bias === "undetermined") {
      state = "undetermined";
      canProceed = false;
      ruleNote = "Structure is not yet clearly classified on one or both timeframes — treated as WAIT.";
    } else if (htf.bias === ltfConfirmation.bias) {
      state = htf.bias === "bullish" ? "aligned-bullish" : "aligned-bearish";
      canProceed = true;
      ruleNote = `${HTF_STRUCTURE_TIMEFRAME} and ${LTF_CONFIRMATION_TIMEFRAME} agree — analysis may continue. This rule cannot be overridden by AI.`;
    } else {
      state = "conflicting";
      canProceed = false;
      ruleNote = `${HTF_STRUCTURE_TIMEFRAME} and ${LTF_CONFIRMATION_TIMEFRAME} disagree — forced WAIT per fixed strategy rule. This rule cannot be overridden by AI.`;
    }

    return { htf, ltfConfirmation, state, canProceed, ruleNote };
  }
}

export const structureService = new StructureService();
