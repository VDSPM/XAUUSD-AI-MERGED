import type { AnalysisDecision } from "@/types";
import { DecisionBadge } from "./DecisionBadge";
import { ConfidenceGauge } from "@/components/ui/ConfidenceGauge";
import { EvidenceList } from "./EvidenceList";
import { decisionStyle } from "@/utils/status";
import { formatRelativeTime } from "@/utils/format";
import { ShieldAlert, RefreshCcw } from "lucide-react";

const GAUGE_COLOR: Record<AnalysisDecision["decision"], string> = {
  BUY: "text-buy",
  SELL: "text-sell",
  WAIT: "text-wait",
};

interface DecisionPanelProps {
  decision: AnalysisDecision;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DecisionPanel({ decision, onRefresh, refreshing }: DecisionPanelProps) {
  const style = decisionStyle(decision.decision);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <DecisionBadge decision={decision.decision} />
          <div>
            <p className={`font-display text-2xl font-bold ${style.textClass}`}>{style.label}</p>
            <p className="text-xs text-ink-muted mt-0.5">Updated {formatRelativeTime(decision.asOf)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConfidenceGauge value={decision.confidence} colorClassName={GAUGE_COLOR[decision.decision]} size={92} />
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink-primary hover:border-gold/30 disabled:opacity-50 transition-colors"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Re-run
            </button>
          )}
        </div>
      </div>

      {!decision.confidenceCalibrated && (
        <div className="flex items-start gap-2 rounded-lg border border-wait/30 bg-wait-dim px-3 py-2 text-xs text-wait-bright">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Confidence is not yet calibrated against historical backtest results. Treat this score as a relative
            strength indicator, not a win probability.
          </span>
        </div>
      )}

      <div>
        <p className="eyebrow mb-1.5">Reason</p>
        <p className="text-sm text-ink-secondary leading-relaxed">{decision.reason}</p>
      </div>

      <div>
        <p className="eyebrow mb-2">Evidence</p>
        <EvidenceList evidence={decision.evidence} />
      </div>

      <div className="rounded-lg border border-line-soft bg-base-900/40 px-3 py-2.5">
        <p className="eyebrow mb-1">Invalidation</p>
        <p className="text-sm text-ink-secondary leading-relaxed">{decision.invalidation}</p>
      </div>
    </div>
  );
}
