import { useState, type ReactNode } from "react";
import type { Candle, Timeframe } from "@/types";
import { CardSkeleton } from "@/components/ui/States";

const TIMEFRAMES: Timeframe[] = ["1D", "4H", "1H", "15M", "5M", "3M", "1M"];

const OVERLAY_TOGGLES = [
  "Daily Open",
  "Daily Close",
  "Swing High/Low",
  "Fibonacci",
  "Liquidity",
  "BOS",
  "CHoCH",
  "FVG",
  "Order Block",
];

interface ChartContainerProps {
  candles: Candle[] | null;
  loading: boolean;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  headerExtra?: ReactNode;
}

/**
 * Chart rendering surface.
 *
 * This renders a lightweight mock candle visualization built from plain SVG
 * so the page is fully functional today. It is deliberately isolated behind
 * this component boundary: when a real charting library (e.g. a
 * TradingView-style widget) is integrated, only the internals of this file
 * need to change — `candles`, `timeframe`, and the overlay toggle state are
 * already the shape a real chart integration would consume.
 */
export function ChartContainer({ candles, loading, timeframe, onTimeframeChange, headerExtra }: ChartContainerProps) {
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set(["Fibonacci", "Order Block"]));

  const toggleOverlay = (name: string) => {
    setActiveOverlays((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="panel flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-line">
        <div className="flex items-center gap-1 rounded-lg border border-line bg-base-900 p-0.5">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                tf === timeframe
                  ? "bg-gold/15 text-gold-bright"
                  : "text-ink-muted hover:text-ink-secondary"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        {headerExtra}
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-line-soft">
        {OVERLAY_TOGGLES.map((name) => {
          const active = activeOverlays.has(name);
          return (
            <button
              key={name}
              onClick={() => toggleOverlay(name)}
              className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                active
                  ? "border-gold/40 bg-gold/10 text-gold-bright"
                  : "border-line text-ink-muted hover:text-ink-secondary hover:border-line"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {loading || !candles ? (
          <CardSkeleton lines={1} />
        ) : (
          <MockCandleChart candles={candles} overlays={activeOverlays} />
        )}
      </div>

      <div className="px-4 pb-3 -mt-1">
        <p className="text-[11px] text-ink-muted">
          Preview chart rendered from mock data. Ready for integration with a live charting library — candles,
          swing points, Fibonacci and SMC overlays already have a defined data contract.
        </p>
      </div>
    </div>
  );
}

function MockCandleChart({ candles, overlays }: { candles: Candle[]; overlays: Set<string> }) {
  const width = 900;
  const height = 320;
  const padding = 24;
  const visible = candles.slice(-70);

  const highs = visible.map((c) => c.high);
  const lows = visible.map((c) => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  const candleWidth = (width - padding * 2) / visible.length;

  const yFor = (price: number) => padding + (1 - (price - min) / range) * (height - padding * 2);

  const fibLevels = overlays.has("Fibonacci")
    ? [
        { ratio: 0.618, price: min + range * 0.42 },
        { ratio: 0.786, price: min + range * 0.3 },
      ]
    : [];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[320px]" preserveAspectRatio="none">
      <rect x={0} y={0} width={width} height={height} fill="transparent" />
      {/* grid lines */}
      {Array.from({ length: 5 }).map((_, i) => {
        const y = padding + (i * (height - padding * 2)) / 4;
        return <line key={i} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#1D2229" strokeWidth={1} />;
      })}

      {/* fibonacci overlay */}
      {fibLevels.map((lvl) => (
        <g key={lvl.ratio}>
          <line
            x1={padding}
            x2={width - padding}
            y1={yFor(lvl.price)}
            y2={yFor(lvl.price)}
            stroke="#C9A227"
            strokeDasharray="4 4"
            strokeWidth={1}
            opacity={0.6}
          />
          <text x={width - padding} y={yFor(lvl.price) - 4} textAnchor="end" fontSize={10} fill="#C9A227">
            {lvl.ratio}
          </text>
        </g>
      ))}

      {/* candles */}
      {visible.map((c, i) => {
        const x = padding + i * candleWidth + candleWidth / 2;
        const bullish = c.close >= c.open;
        const color = bullish ? "#2FBF71" : "#E0554C";
        const bodyTop = yFor(Math.max(c.open, c.close));
        const bodyBottom = yFor(Math.min(c.open, c.close));
        return (
          <g key={c.time + i}>
            <line x1={x} x2={x} y1={yFor(c.high)} y2={yFor(c.low)} stroke={color} strokeWidth={1} />
            <rect
              x={x - candleWidth * 0.32}
              y={bodyTop}
              width={candleWidth * 0.64}
              height={Math.max(1, bodyBottom - bodyTop)}
              fill={color}
            />
          </g>
        );
      })}
    </svg>
  );
}
