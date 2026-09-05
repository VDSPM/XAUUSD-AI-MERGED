import type { DecisionEvidenceRef } from "@/types";
import { Check, X } from "lucide-react";
import { strengthStyle } from "@/utils/status";

export function EvidenceList({ evidence }: { evidence: DecisionEvidenceRef[] }) {
  return (
    <ul className="space-y-2">
      {evidence.map((item) => {
        const style = strengthStyle(item.strength);
        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-base-900/60 px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              {item.supports ? (
                <Check className="h-3.5 w-3.5 text-buy shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 text-sell shrink-0" />
              )}
              <span className="text-sm text-ink-secondary truncate">{item.label}</span>
            </div>
            <span className={`shrink-0 text-[11px] font-medium ${style.textClass}`}>{style.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
