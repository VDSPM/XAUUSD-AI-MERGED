import type { SmcEvidenceItem } from "@/types";
import { strengthStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function EvidenceCard({ item }: { item: SmcEvidenceItem }) {
  const style = strengthStyle(item.detection === "detected" ? item.strength : null);
  const detected = item.detection === "detected";

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${detected ? "border-line bg-base-850" : "border-line-soft bg-base-900/40"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink-primary">{item.label}</p>
          <p className="text-[11px] text-ink-muted mt-0.5">{item.timeframe}</p>
        </div>
        <Badge status={style} />
      </div>
      <p className="text-xs text-ink-secondary leading-relaxed">{item.detail}</p>
      {detected && item.aiRelevance !== null && (
        <div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
            <span>AI relevance</span>
            <span className="numeric">{Math.round(item.aiRelevance * 100)}%</span>
          </div>
          <ProgressBar value={item.aiRelevance * 100} colorClassName="bg-gold" height="h-1" />
        </div>
      )}
    </div>
  );
}
