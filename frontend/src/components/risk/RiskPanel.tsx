import type { RiskAssessment } from "@/types";
import { formatCurrency, formatPrice } from "@/utils/format";
import { riskStatusStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function RiskPanel({ risk }: { risk: RiskAssessment }) {
  const { levels, limits } = risk;
  const limitStyle = riskStatusStyle(limits.status);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <RiskLevelBlock label="Entry" value={formatPrice(levels.entry)} accent="text-ink-primary" />
        <RiskLevelBlock label="Stop Loss" value={formatPrice(levels.stopLoss)} accent="text-sell-bright" />
        <RiskLevelBlock label="Take Profit" value={formatPrice(levels.takeProfit)} accent="text-buy-bright" />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-line-soft">
        <RiskLevelBlock label="R : R" value={`1 : ${levels.riskRewardRatio.toFixed(2)}`} accent="text-gold-bright" />
        <RiskLevelBlock label="Position Size" value={`${levels.positionSizeLots.toFixed(2)} lots`} accent="text-ink-primary" />
        <RiskLevelBlock
          label="Risk Amount"
          value={`${formatCurrency(levels.riskAmount)} (${levels.riskPercentOfAccount.toFixed(1)}%)`}
          accent="text-ink-primary"
        />
      </div>

      <div className="pt-3 border-t border-line-soft space-y-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Daily Risk Used</p>
          <span className="numeric text-xs text-ink-secondary">
            {limits.dailyRiskUsed.toFixed(1)}% / {limits.dailyRiskLimit.toFixed(1)}%
          </span>
        </div>
        <ProgressBar
          value={(limits.dailyRiskUsed / limits.dailyRiskLimit) * 100}
          colorClassName={limits.status === "within-limits" ? "bg-buy" : limits.status === "elevated" ? "bg-wait" : "bg-sell"}
        />

        <div className="flex items-center justify-between">
          <p className="eyebrow">Trades Today</p>
          <span className="numeric text-xs text-ink-secondary">
            {limits.tradesTakenToday} / {limits.dailyTradeLimit}
          </span>
        </div>
        <ProgressBar
          value={(limits.tradesTakenToday / limits.dailyTradeLimit) * 100}
          colorClassName="bg-base-500"
          trackClassName="bg-base-800"
        />

        <div className="flex items-center justify-between pt-1">
          <Badge status={limitStyle} />
          <span className="text-xs text-ink-muted">{limits.note}</span>
        </div>
      </div>

      <p className="text-[11px] text-ink-muted pt-2 border-t border-line-soft leading-relaxed">
        Mock values for frontend development. Real-money automatic execution is not part of this version.
      </p>
    </div>
  );
}

function RiskLevelBlock({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className={`numeric text-sm font-semibold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
