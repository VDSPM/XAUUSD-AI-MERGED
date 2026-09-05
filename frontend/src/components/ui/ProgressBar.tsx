interface ProgressBarProps {
  value: number; // 0-100
  colorClassName?: string;
  trackClassName?: string;
  height?: string;
}

export function ProgressBar({
  value,
  colorClassName = "bg-gold",
  trackClassName = "bg-base-700",
  height = "h-1.5",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full rounded-full overflow-hidden ${height} ${trackClassName}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
