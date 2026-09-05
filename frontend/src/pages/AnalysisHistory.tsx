import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { HistoryTable } from "@/components/history/HistoryTable";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import type { TradeDecision } from "@/types";

const FILTERS: { id: TradeDecision | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "BUY", label: "Buy" },
  { id: "SELL", label: "Sell" },
  { id: "WAIT", label: "Wait" },
];

export default function AnalysisHistory() {
  const { data: history, loading } = useAnalysisHistory();
  const [filter, setFilter] = useState<TradeDecision | "all">("all");

  const filtered = useMemo(() => {
    if (!history) return [];
    if (filter === "all") return history;
    return history.filter((e) => e.decision === filter);
  }, [history, filter]);

  return (
    <PageContainer title="Analysis History" subtitle="Every decision the system has produced, with outcomes once available">
      <Card
        eyebrow="Log"
        title="Past Analysis Runs"
        action={
          <div className="flex items-center gap-1 rounded-lg border border-line bg-base-900 p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter === f.id ? "bg-gold/15 text-gold-bright" : "text-ink-muted hover:text-ink-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      >
        {loading || !history ? (
          <CardSkeleton lines={6} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No analysis entries match this filter." />
        ) : (
          <HistoryTable entries={filtered} />
        )}
      </Card>
    </PageContainer>
  );
}
