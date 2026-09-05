import type { HtfPullback } from "@/types";
import { formatPrice } from "@/utils/format";

const STATE_LABEL: Record<HtfPullback["state"], string> = {
  forming: "Forming",
  "reached-zone": "Reached Zone",
  "not-yet-reached": "Not Yet Reached",
  invalidated: "Invalidated",
};

const STATE_COLOR: Record<HtfPullback["state"], string> = {
  forming: "text-wait-bright",
  "reached-zone": "text-buy-bright",
  "not-yet-reached": "text-ink-muted",
  invalidated: "text-sell-bright",
};

export function PullbackCard({ pullback }: { pullback: HtfPullback }) {
  return (
    <div className="rounded-xl border border-line bg-base-850 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{pullback.timeframe} Pullback</p>
        <span className={`text-xs font-semibold ${STATE_COLOR[pullback.state]}`}>{STATE_LABEL[pullback.state]}</span>
      </div>
      <p className="text-sm text-ink-secondary leading-relaxed">{pullback.description}</p>
      <div className="flex items-center justify-between text-xs pt-2 border-t border-line-soft">
        <span className="text-ink-muted">
          Origin <span className="numeric text-ink-secondary">{formatPrice(pullback.originSwing.price)}</span>
        </span>
        <span className="text-ink-muted">
          Target <span className="numeric text-ink-secondary">{formatPrice(pullback.targetSwing.price)}</span>
        </span>
      </div>
    </div>
  );
}
