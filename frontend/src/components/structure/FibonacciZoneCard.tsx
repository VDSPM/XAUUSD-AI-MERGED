import type { FibonacciZone } from "@/types";
import { formatPrice } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";

export function FibonacciZoneCard({ zone }: { zone: FibonacciZone }) {
  const status = zone.priceInsideZone
    ? { label: "Price inside zone", textClass: "text-buy-bright", bgClass: "bg-buy-dim", borderClass: "border-buy/40", dotClass: "bg-buy" }
    : { label: "Awaiting zone fill", textClass: "text-wait-bright", bgClass: "bg-wait-dim", borderClass: "border-wait/40", dotClass: "bg-wait" };

  return (
    <div className="rounded-xl border border-line bg-base-850 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Fibonacci Golden Zone</p>
        <Badge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-ink-muted">0.618</p>
          <p className="numeric text-base font-semibold text-gold-bright">{formatPrice(zone.goldenZoneLow)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-ink-muted">0.786</p>
          <p className="numeric text-base font-semibold text-gold-bright">{formatPrice(zone.goldenZoneHigh)}</p>
        </div>
      </div>

      {/* Visual zone bar */}
      <div className="relative h-2.5 rounded-full bg-base-900 border border-line overflow-hidden">
        <div
          className="absolute top-0 bottom-0 bg-gold/25 border-x border-gold/50"
          style={{
            left: "35%",
            right: "35%",
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-ink-primary border-2 border-base-950 shadow"
          style={{
            left: `${zone.priceInsideZone ? 50 : 78}%`,
          }}
          title={`Current: ${formatPrice(zone.currentPrice)}`}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-muted">Swing Low {formatPrice(zone.swingLow)}</span>
        <span className="text-ink-muted">Swing High {formatPrice(zone.swingHigh)}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line-soft">
        <span className="text-xs text-ink-secondary">Current Price</span>
        <span className="numeric text-sm font-semibold text-ink-primary">{formatPrice(zone.currentPrice)}</span>
      </div>
    </div>
  );
}
