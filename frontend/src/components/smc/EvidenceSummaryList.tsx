import type { SmcEvidenceItem } from "@/types";
import { strengthStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";

export function EvidenceSummaryList({ items }: { items: SmcEvidenceItem[] }) {
  return (
    <ul className="divide-y divide-line-soft">
      {items.map((item) => {
        const style = strengthStyle(item.detection === "detected" ? item.strength : null);
        return (
          <li key={item.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <span className="text-sm text-ink-secondary">{item.label}</span>
            <Badge status={style} />
          </li>
        );
      })}
    </ul>
  );
}
