interface ConfidenceGaugeProps {
  value: number; // 0-100
  colorClassName?: string; // stroke color as tailwind text-* class (uses currentColor)
  size?: number;
  label?: string;
}

export function ConfidenceGauge({ value, colorClassName = "text-gold", size = 120, label }: ConfidenceGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-base-700"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none transition-all duration-700 ease-out ${colorClassName}`}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="numeric text-2xl font-bold text-ink-primary">{Math.round(clamped)}</span>
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">{label ?? "Confidence"}</span>
      </div>
    </div>
  );
}
