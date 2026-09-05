import type { SmcEvidenceItem } from "@/types";
import { EvidenceCard } from "./EvidenceCard";

export function EvidenceGrid({ items }: { items: SmcEvidenceItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((item) => (
        <EvidenceCard key={item.id} item={item} />
      ))}
    </div>
  );
}
