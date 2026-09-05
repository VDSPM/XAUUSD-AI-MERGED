import type { TradeDecision } from "@/types";
import { decisionStyle } from "@/utils/status";
import { ArrowUpRight, ArrowDownRight, Pause } from "lucide-react";

const ICONS = {
  BUY: ArrowUpRight,
  SELL: ArrowDownRight,
  WAIT: Pause,
} as const;

export function DecisionBadge({ decision, size = "lg" }: { decision: TradeDecision; size?: "md" | "lg" }) {
  const style = decisionStyle(decision);
  const Icon = ICONS[decision];
  const dims = size === "lg" ? "h-16 w-16 text-2xl" : "h-11 w-11 text-base";

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border-2 font-display font-bold ${dims} ${style.borderClass} ${style.bgClass} ${style.textClass}`}
    >
      <Icon className={size === "lg" ? "h-7 w-7" : "h-5 w-5"} strokeWidth={2.5} />
      <span className="sr-only">{decision}</span>
    </div>
  );
}
