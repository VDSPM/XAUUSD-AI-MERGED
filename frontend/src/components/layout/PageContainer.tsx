import type { PropsWithChildren, ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageContainer({ title, subtitle, action, children }: PropsWithChildren<PageContainerProps>) {
  return (
    <div className="px-4 lg:px-6 py-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-semibold text-ink-primary">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
