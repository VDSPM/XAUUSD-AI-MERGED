import type { SmcEvidenceItem, SmcEvidenceSet } from "./types.js";
import type { Candle } from "../market/types.js";
import type { DirectionAlignment } from "../structure/types.js";
import { liquidityService } from "../liquidity/liquidityService.js";
import { marketService } from "../market/marketService.js";

/**
 * SMC Evidence Engine.
 *
 * The project spec lists the evidence *categories* the system must be able
 * to analyze (liquidity, sweeps, BOS, CHoCH, order blocks, FVG,
 * displacement, premium/discount, volatility, session) but does not define
 * exact detection thresholds for each — those were flagged as
 * "UNDEFINED — USER DECISION REQUIRED" during project scoping.
 *
 * Rather than leave these modules empty, this engine implements common,
 * textbook-standard default definitions for each category so the pipeline
 * is runnable end-to-end. Every threshold below is a clearly-labeled
 * engineering default, not a confirmed trading rule, and should be
 * reviewed/tuned by the user (ideally via backtesting) before being relied
 * upon. No entry, stop-loss, or take-profit logic is derived from this
 * module — it only reports evidence for the decision engine to weigh.
 */
export class SmcService {
  async getEvidenceSet(alignment: DirectionAlignment): Promise<SmcEvidenceSet> {
    const [htfCandles, ltfCandles] = await Promise.all([
      marketService.getValidatedCandles({ timeframe: "4H", limit: 200 }),
      marketService.getValidatedCandles({ timeframe: "15M", limit: 100 }),
    ]);

    const items: SmcEvidenceItem[] = [
      this.liquidityEvidence(htfCandles),
      this.sweepEvidence(htfCandles),
      this.bosEvidence(ltfCandles, alignment),
      this.chochEvidence(ltfCandles, alignment),
      this.orderBlockEvidence(ltfCandles, alignment),
      this.fvgEvidence(ltfCandles),
      this.displacementEvidence(ltfCandles),
      this.premiumDiscountEvidence(htfCandles),
      this.volatilityEvidence(htfCandles),
      this.sessionEvidence(),
    ];

    return { asOf: new Date().toISOString(), items };
  }

  private liquidityEvidence(candles: Candle[]): SmcEvidenceItem {
    const pools = liquidityService.identifyPools(candles).filter((p) => !p.swept);
    const detected = pools.length > 0;
    return {
      id: "liquidity",
      kind: "liquidity",
      label: "Liquidity Pool",
      detection: detected ? "detected" : "not-detected",
      strength: detected ? "strong" : null,
      timeframe: "4H",
      detail: detected
        ? `${pools.length} unmitigated liquidity pool(s) resting above/below recent swing points.`
        : "No unmitigated liquidity pools identified.",
    };
  }

  private sweepEvidence(candles: Candle[]): SmcEvidenceItem {
    const sweeps = liquidityService.detectSweeps(candles);
    const recent = sweeps[sweeps.length - 1];
    const detected = !!recent;
    return {
      id: "liquidity-sweep",
      kind: "liquidity-sweep",
      label: "Liquidity Sweep",
      detection: detected ? "detected" : "not-detected",
      strength: detected ? (recent!.reclaimed ? "strong" : "moderate") : null,
      timeframe: "4H",
      detail: detected
        ? `${recent!.side} liquidity swept at ${recent!.poolPrice}${recent!.reclaimed ? " and reclaimed" : ""}.`
        : "No recent liquidity sweep detected.",
    };
  }

  private bosEvidence(candles: Candle[], alignment: DirectionAlignment): SmcEvidenceItem {
    const lastSwing = alignment.htf.swingPoints[alignment.htf.swingPoints.length - 1];
    if (!lastSwing) {
      return this.notDetected("bos", "Break of Structure", "1H", "No reference swing available.");
    }
    const last = candles[candles.length - 1]!;
    const bullish = alignment.state === "aligned-bullish";
    const detected = bullish ? last.close > lastSwing.price : last.close < lastSwing.price;
    return {
      id: "bos",
      kind: "bos",
      label: "Break of Structure",
      detection: detected ? "detected" : "not-detected",
      strength: detected ? "strong" : null,
      timeframe: "1H",
      detail: detected
        ? `Close confirmed beyond the prior structural swing at ${lastSwing.price}, continuing the ${bullish ? "bullish" : "bearish"} direction.`
        : "No confirmed break of structure in the trend direction yet.",
    };
  }

  private chochEvidence(candles: Candle[], alignment: DirectionAlignment): SmcEvidenceItem {
    const lastSwing = alignment.htf.swingPoints[alignment.htf.swingPoints.length - 1];
    if (!lastSwing) {
      return this.notDetected("choch", "Change of Character", "15M", "No reference swing available.");
    }
    const last = candles[candles.length - 1]!;
    const bullish = alignment.state === "aligned-bullish";
    // CHoCH = a close AGAINST the prevailing trend direction beyond the last swing.
    const detected = bullish ? last.close < lastSwing.price : last.close > lastSwing.price;
    return {
      id: "choch",
      kind: "choch",
      label: "Change of Character",
      detection: detected ? "detected" : "not-detected",
      strength: detected ? "conflicting" : null,
      timeframe: "15M",
      detail: detected
        ? "Price closed against the prevailing higher-timeframe direction — treat with caution."
        : "No character shift observed against the prevailing trend.",
    };
  }

  private orderBlockEvidence(candles: Candle[], alignment: DirectionAlignment): SmcEvidenceItem {
    const bullish = alignment.state === "aligned-bullish";
    // Default: last opposite-color candle before the largest recent same-direction move.
    let obIndex = -1;
    for (let i = candles.length - 2; i > 0; i--) {
      const c = candles[i]!;
      const isOpposite = bullish ? c.close < c.open : c.close > c.open;
      const nextMoveStrong = Math.abs(candles[i + 1]!.close - candles[i + 1]!.open) > this.averageBody(candles);
      if (isOpposite && nextMoveStrong) {
        obIndex = i;
        break;
      }
    }
    const detected = obIndex !== -1;
    const ob = detected ? candles[obIndex]! : null;
    return {
      id: "order-block",
      kind: "order-block",
      label: "Order Block",
      detection: detected ? "detected" : "not-detected",
      strength: detected ? "moderate" : null,
      timeframe: "1H",
      detail: detected
        ? `${bullish ? "Bullish" : "Bearish"} order block identified between ${Math.min(ob!.open, ob!.close)} – ${Math.max(ob!.open, ob!.close)}.`
        : "No qualifying order block identified in the recent range.",
    };
  }

  private fvgEvidence(candles: Candle[]): SmcEvidenceItem {
    for (let i = candles.length - 3; i >= 0; i--) {
      const c1 = candles[i]!;
      const c3 = candles[i + 2]!;
      if (c1.high < c3.low) {
        return {
          id: "fvg",
          kind: "fvg",
          label: "Fair Value Gap",
          detection: "detected",
          strength: "weak",
          timeframe: "15M",
          detail: `Bullish imbalance between ${c1.high} – ${c3.low}.`,
        };
      }
      if (c1.low > c3.high) {
        return {
          id: "fvg",
          kind: "fvg",
          label: "Fair Value Gap",
          detection: "detected",
          strength: "weak",
          timeframe: "15M",
          detail: `Bearish imbalance between ${c3.high} – ${c1.low}.`,
        };
      }
    }
    return this.notDetected("fvg", "Fair Value Gap", "15M", "No unfilled 3-candle imbalance detected.");
  }

  private displacementEvidence(candles: Candle[]): SmcEvidenceItem {
    const avgBody = this.averageBody(candles);
    const last = candles[candles.length - 1]!;
    const body = Math.abs(last.close - last.open);
    const detected = body > avgBody * 1.8;
    return {
      id: "displacement",
      kind: "displacement",
      label: "Displacement",
      detection: detected ? "detected" : "not-detected",
      strength: detected ? "strong" : null,
      timeframe: "1H",
      detail: detected
        ? "Large-bodied candle relative to recent average — indicates aggressive one-directional pressure."
        : "No candle significantly larger than the recent average body size.",
    };
  }

  private premiumDiscountEvidence(candles: Candle[]): SmcEvidenceItem {
    const recent = candles.slice(-50);
    const high = Math.max(...recent.map((c) => c.high));
    const low = Math.min(...recent.map((c) => c.low));
    const mid = (high + low) / 2;
    const last = candles[candles.length - 1]!;
    const inDiscount = last.close < mid;
    return {
      id: "premium-discount",
      kind: "premium-discount",
      label: "Premium / Discount",
      detection: "detected",
      strength: "moderate",
      timeframe: "4H",
      detail: `Current price sits in the ${inDiscount ? "discount" : "premium"} half of the recent dealing range.`,
    };
  }

  private volatilityEvidence(candles: Candle[]): SmcEvidenceItem {
    const recent = candles.slice(-20);
    const ranges = recent.map((c) => c.high - c.low);
    const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;
    const lastRange = ranges[ranges.length - 1] ?? 0;
    const elevated = lastRange > avgRange * 1.5;
    return {
      id: "volatility",
      kind: "volatility",
      label: "Volatility",
      detection: "detected",
      strength: elevated ? "conflicting" : "moderate",
      timeframe: "1D",
      detail: elevated
        ? "Recent range is significantly above average — increases execution/whipsaw risk."
        : "Recent volatility is within a normal range.",
    };
  }

  private sessionEvidence(): SmcEvidenceItem {
    const hourUtc = new Date().getUTCHours();
    const london = hourUtc >= 7 && hourUtc < 16;
    const newYork = hourUtc >= 12 && hourUtc < 21;
    const overlap = london && newYork;
    const label = overlap ? "London/New York overlap" : london ? "London session" : newYork ? "New York session" : "Low-liquidity session (Asian/off-hours)";
    return {
      id: "session",
      kind: "session",
      label: "Trading Session",
      detection: "detected",
      strength: overlap ? "strong" : london || newYork ? "moderate" : "weak",
      timeframe: "1D",
      detail: `${label}, based on default UTC session windows (engineering default, not a confirmed rule).`,
    };
  }

  private notDetected(id: string, label: string, timeframe: string, detail: string): SmcEvidenceItem {
    return {
      id,
      kind: id as SmcEvidenceItem["kind"],
      label,
      detection: "not-detected",
      strength: null,
      timeframe,
      detail,
    };
  }

  private averageBody(candles: Candle[]): number {
    const bodies = candles.slice(-20).map((c) => Math.abs(c.close - c.open));
    return bodies.reduce((a, b) => a + b, 0) / (bodies.length || 1);
  }
}

export const smcService = new SmcService();
