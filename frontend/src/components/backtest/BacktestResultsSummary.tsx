import type { BacktestSummary } from "@/types";
import { formatCurrency } from "@/utils/format";

export function BacktestResultsSummary({ summary }: { summary: BacktestSummary }) {
  const items: { label: string; value: string; accent?: string }[] = [
    { label: "Total Trades", value: `${summary.totalTrades}` },
    { label: "Win Rate", value: `${summary.winRatePct.toFixed(1)}%`, accent: "text-buy-bright" },
    { label: "Profit Factor", value: summary.profitFactor.toFixed(2) },
    { label: "Net Profit", value: `${formatCurrency(summary.netProfit)} (${summary.netProfitPct.toFixed(1)}%)`, accent: "text-buy-bright" },
    { label: "Max Drawdown", value: `${summary.maxDrawdownPct.toFixed(1)}%`, accent: "text-sell-bright" },
    { label: "Expectancy", value: summary.expectancy.toFixed(2) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-line bg-base-900/50 p-3">
          <p className="eyebrow">{item.label}</p>
          <p className={`numeric text-lg font-semibold mt-1 ${item.accent ?? "text-ink-primary"}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
