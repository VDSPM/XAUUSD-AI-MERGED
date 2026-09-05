import type { AnalysisHistoryEntry } from "@/types";
import { decisionStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/utils/format";

export function RecentAnalysisList({ entries }: { entries: AnalysisHistoryEntry[] }) {
  return (
    <ul className="divide-y divide-line-soft">
      {entries.slice(0, 5).map((entry) => {
        const style = decisionStyle(entry.decision);
        return (
          <li key={entry.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
            <Badge status={style} />
            <p className="flex-1 min-w-0 text-xs text-ink-secondary truncate">{entry.reasonSummary}</p>
            <span className="text-[11px] text-ink-muted shrink-0">{formatRelativeTime(entry.asOf)}</span>
          </li>
        );
      })}
    </ul>
  );
}
