import type { LowerTimeframeAnalysis } from "@/types";

const STATE_LABEL: Record<LowerTimeframeAnalysis["state"], string> = {
  "awaiting-pullback": "Awaiting Pullback",
  "approaching-zone": "Approaching Zone",
  "filled-zone": "Filled Zone",
  overextended: "Overextended",
};

const STATE_COLOR: Record<LowerTimeframeAnalysis["state"], string> = {
  "awaiting-pullback": "text-ink-muted",
  "approaching-zone": "text-wait-bright",
  "filled-zone": "text-buy-bright",
  overextended: "text-sell-bright",
};

export function LowerTimeframeList({ items }: { items: LowerTimeframeAnalysis[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div
          key={item.timeframe}
          className="flex items-center justify-between gap-3 rounded-lg border border-line bg-base-900/60 px-3 py-2.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="numeric text-xs font-semibold text-ink-primary w-10 shrink-0">{item.timeframe}</span>
            <p className="text-xs text-ink-secondary truncate">{item.note}</p>
          </div>
          <span className={`shrink-0 text-[11px] font-medium ${STATE_COLOR[item.state]}`}>
            {STATE_LABEL[item.state]}
          </span>
        </div>
      ))}
    </div>
  );
}
