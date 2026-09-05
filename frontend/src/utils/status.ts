import type {
  AlignmentState,
  BacktestRunStatus,
  DirectionBias,
  EvidenceStrength,
  HistoryOutcome,
  RiskStatus,
  ServiceHealth,
  TradeDecision,
} from "@/types";

export interface StatusStyle {
  label: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  dotClass: string;
}

export function decisionStyle(decision: TradeDecision): StatusStyle {
  switch (decision) {
    case "BUY":
      return {
        label: "BUY",
        textClass: "text-buy-bright",
        bgClass: "bg-buy-dim",
        borderClass: "border-buy/40",
        dotClass: "bg-buy",
      };
    case "SELL":
      return {
        label: "SELL",
        textClass: "text-sell-bright",
        bgClass: "bg-sell-dim",
        borderClass: "border-sell/40",
        dotClass: "bg-sell",
      };
    case "WAIT":
    default:
      return {
        label: "WAIT",
        textClass: "text-wait-bright",
        bgClass: "bg-wait-dim",
        borderClass: "border-wait/40",
        dotClass: "bg-wait",
      };
  }
}

export function biasStyle(bias: DirectionBias): StatusStyle {
  if (bias === "bullish") {
    return { label: "Bullish", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" };
  }
  if (bias === "bearish") {
    return { label: "Bearish", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
  }
  return { label: "Undetermined", textClass: "text-ink-muted", bgClass: "bg-base-700", borderClass: "border-line", dotClass: "bg-ink-muted" };
}

export function alignmentStyle(state: AlignmentState): StatusStyle {
  if (state === "aligned-bullish") return { ...biasStyle("bullish"), label: "Aligned — Bullish" };
  if (state === "aligned-bearish") return { ...biasStyle("bearish"), label: "Aligned — Bearish" };
  return { label: "Conflicting", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
}

export function strengthStyle(strength: EvidenceStrength | null): StatusStyle {
  switch (strength) {
    case "strong":
      return { label: "Strong", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" };
    case "moderate":
      return { label: "Moderate", textClass: "text-gold-bright", bgClass: "bg-base-700", borderClass: "border-gold/30", dotClass: "bg-gold" };
    case "weak":
      return { label: "Weak", textClass: "text-ink-muted", bgClass: "bg-base-700", borderClass: "border-line", dotClass: "bg-ink-muted" };
    case "conflicting":
      return { label: "Conflicting", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
    default:
      return { label: "Not detected", textClass: "text-ink-muted", bgClass: "bg-base-800", borderClass: "border-line", dotClass: "bg-base-600" };
  }
}

export function healthStyle(health: ServiceHealth): StatusStyle {
  switch (health) {
    case "operational":
      return { label: "Operational", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" };
    case "degraded":
      return { label: "Degraded", textClass: "text-wait-bright", bgClass: "bg-wait-dim", borderClass: "border-wait/40", dotClass: "bg-wait" };
    case "down":
      return { label: "Down", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
    default:
      return { label: "Unknown", textClass: "text-ink-muted", bgClass: "bg-base-800", borderClass: "border-line", dotClass: "bg-base-600" };
  }
}

export function riskStatusStyle(status: RiskStatus): StatusStyle {
  switch (status) {
    case "within-limits":
      return { label: "Within limits", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" };
    case "elevated":
      return { label: "Elevated", textClass: "text-wait-bright", bgClass: "bg-wait-dim", borderClass: "border-wait/40", dotClass: "bg-wait" };
    case "blocked":
      return { label: "Blocked", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
  }
}

export function outcomeStyle(outcome: HistoryOutcome): StatusStyle {
  switch (outcome) {
    case "win":
      return { label: "Win", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" };
    case "loss":
      return { label: "Loss", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
    case "breakeven":
      return { label: "Breakeven", textClass: "text-gold-bright", bgClass: "bg-base-700", borderClass: "border-gold/30", dotClass: "bg-gold" };
    case "pending":
      return { label: "Pending", textClass: "text-info", bgClass: "bg-base-700", borderClass: "border-info/40", dotClass: "bg-info" };
    default:
      return { label: "No trade", textClass: "text-ink-muted", bgClass: "bg-base-800", borderClass: "border-line", dotClass: "bg-base-600" };
  }
}

export function backtestStatusStyle(status: BacktestRunStatus): StatusStyle {
  switch (status) {
    case "completed":
      return { label: "Completed", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" };
    case "running":
      return { label: "Running", textClass: "text-info", bgClass: "bg-base-700", borderClass: "border-info/40", dotClass: "bg-info" };
    case "queued":
      return { label: "Queued", textClass: "text-gold-bright", bgClass: "bg-base-700", borderClass: "border-gold/30", dotClass: "bg-gold" };
    case "failed":
      return { label: "Failed", textClass: "text-sell-bright", bgClass: "bg-sell-dim", borderClass: "border-sell/40", dotClass: "bg-sell" };
    default:
      return { label: "Idle", textClass: "text-ink-muted", bgClass: "bg-base-800", borderClass: "border-line", dotClass: "bg-base-600" };
  }
}
