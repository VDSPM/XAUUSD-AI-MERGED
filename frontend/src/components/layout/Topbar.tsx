import { Menu, Wifi, WifiOff } from "lucide-react";
import { usePriceSnapshot } from "@/hooks/usePriceSnapshot";
import { formatPrice, formatSigned, formatPercent } from "@/utils/format";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { data: price } = usePriceSnapshot();
  const positive = (price?.changeAbs ?? 0) >= 0;

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-base-900/80 backdrop-blur px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-secondary hover:text-ink-primary"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg font-semibold text-ink-primary">XAU/USD</span>
          {price && (
            <>
              <span className="numeric text-lg font-semibold text-ink-primary">
                {formatPrice(price.price)}
              </span>
              <span className={`numeric text-sm font-medium ${positive ? "text-buy-bright" : "text-sell-bright"}`}>
                {formatSigned(price.changeAbs)} ({formatPercent(price.changePct)})
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-ink-secondary">
          {price?.status === "open" ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-buy" />
              <span>Market Open</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-ink-muted" />
              <span>Market Closed</span>
            </>
          )}
        </div>
        <div className="h-8 w-8 rounded-full bg-base-700 border border-line flex items-center justify-center text-xs font-semibold text-ink-secondary">
          T
        </div>
      </div>
    </header>
  );
}
