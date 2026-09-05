import { useMemo, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { EvidenceGrid } from "@/components/smc/EvidenceGrid";
import { useSmcEvidence } from "@/hooks/useSmcEvidence";
import type { EvidenceDetection } from "@/types";

const FILTERS: { id: EvidenceDetection | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "detected", label: "Detected" },
  { id: "not-detected", label: "Not Detected" },
];

export default function SmcAnalysis() {
  const { data: smc, loading } = useSmcEvidence();
  const [filter, setFilter] = useState<EvidenceDetection | "all">("all");

  const filtered = useMemo(() => {
    if (!smc) return [];
    if (filter === "all") return smc.items;
    return smc.items.filter((item) => item.detection === filter);
  }, [smc, filter]);

  const detectedCount = smc?.items.filter((i) => i.detection === "detected").length ?? 0;

  return (
    <PageContainer
      title="SMC Analysis"
      subtitle="Liquidity, structure shifts, order blocks, imbalances and contextual evidence"
    >
      <Card
        eyebrow="Evidence Engine"
        title={`Smart Money Concepts Evidence${smc ? ` — ${detectedCount}/${smc.items.length} Detected` : ""}`}
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
        <p className="text-xs text-ink-muted mb-4 leading-relaxed">
          Evidence is not required to be fully confirmed before a decision is made. The AI evaluates relevance,
          strength, and conflict within these items — it cannot invent new evidence types outside this set.
        </p>
        {loading || !smc ? (
          <CardSkeleton lines={6} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No evidence matches this filter." />
        ) : (
          <EvidenceGrid items={filtered} />
        )}
      </Card>
    </PageContainer>
  );
}
