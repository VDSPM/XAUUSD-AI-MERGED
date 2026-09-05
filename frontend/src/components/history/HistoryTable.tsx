import type { AnalysisHistoryEntry } from "@/types";
import { decisionStyle, outcomeStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime, formatPrice } from "@/utils/format";

export function HistoryTable({ entries }: { entries: AnalysisHistoryEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-line">
            {["Time", "Decision", "Confidence", "Entry", "SL", "TP", "Outcome", "R", "Summary"].map((h) => (
              <th key={h} className="eyebrow py-2 pr-4 whitespace-nowrap font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {entries.map((entry) => {
            const dStyle = decisionStyle(entry.decision);
            const oStyle = outcomeStyle(entry.outcome);
            return (
              <tr key={entry.id} className="hover:bg-base-800/50 transition-colors">
                <td className="py-3 pr-4 text-ink-muted whitespace-nowrap text-xs">{formatDateTime(entry.asOf)}</td>
                <td className="py-3 pr-4">
                  <Badge status={dStyle} />
                </td>
                <td className="py-3 pr-4 numeric text-ink-secondary">{entry.confidence}</td>
                <td className="py-3 pr-4 numeric text-ink-secondary">{entry.entry ? formatPrice(entry.entry) : "—"}</td>
                <td className="py-3 pr-4 numeric text-sell-bright">{entry.stopLoss ? formatPrice(entry.stopLoss) : "—"}</td>
                <td className="py-3 pr-4 numeric text-buy-bright">{entry.takeProfit ? formatPrice(entry.takeProfit) : "—"}</td>
                <td className="py-3 pr-4">
                  <Badge status={oStyle} />
                </td>
                <td className="py-3 pr-4 numeric text-ink-secondary">
                  {entry.rMultiple !== null ? entry.rMultiple.toFixed(2) : "—"}
                </td>
                <td className="py-3 pr-4 text-ink-muted text-xs max-w-xs truncate">{entry.reasonSummary}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
