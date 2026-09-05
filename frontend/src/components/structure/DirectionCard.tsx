import type { TimeframeStructure } from "@/types";
import { biasStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatTime } from "@/utils/format";

export function DirectionCard({ structure }: { structure: TimeframeStructure }) {
  const style = biasStyle(structure.bias);

  return (
    <div className="rounded-xl border border-line bg-base-850 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{structure.timeframe} Structure</p>
        <Badge status={style} />
      </div>
      <p className="text-sm text-ink-secondary leading-relaxed">{structure.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {structure.swingPoints.map((sp, i) => (
          <span
            key={i}
            className="numeric text-[11px] rounded-md border border-line bg-base-900 px-2 py-1 text-ink-secondary"
            title={formatTime(sp.time)}
          >
            <span className="text-gold-bright font-semibold">{sp.type}</span> {formatPrice(sp.price)}
          </span>
        ))}
      </div>
    </div>
  );
}
