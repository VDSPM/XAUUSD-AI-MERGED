import type { PropsWithChildren, ReactNode } from "react";

interface CardProps {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function Card({
  title,
  eyebrow,
  action,
  className = "",
  bodyClassName = "",
  noPadding = false,
  children,
}: PropsWithChildren<CardProps>) {
  return (
    <section className={`panel flex flex-col ${className}`}>
      {(title || action || eyebrow) && (
        <header className="panel-header">
          <div>
            {eyebrow && <p className="eyebrow mb-0.5">{eyebrow}</p>}
            {title && <h2 className="font-display text-sm font-semibold text-ink-primary">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      <div className={`${noPadding ? "" : "p-4"} flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
