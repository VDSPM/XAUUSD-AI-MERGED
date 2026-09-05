import type { StatusStyle } from "@/utils/status";

interface BadgeProps {
  status: StatusStyle;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function Badge({ status, size = "sm", showDot = true, className = "" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-0.5 gap-1.5" : "text-xs px-2.5 py-1 gap-2";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${status.bgClass} ${status.borderClass} ${status.textClass} ${className}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />}
      {status.label}
    </span>
  );
}
