import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  valueClassName?: string;
  align?: "left" | "right";
}

export function Stat({ label, value, sub, valueClassName = "", align = "left" }: StatProps) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="eyebrow">{label}</p>
      <p className={`numeric text-lg font-semibold text-ink-primary mt-0.5 ${valueClassName}`}>{value}</p>
      {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
    </div>
  );
}
