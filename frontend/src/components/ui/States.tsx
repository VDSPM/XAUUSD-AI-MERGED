import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-base-700/70 ${className}`} />;
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-ink-muted">
      <AlertTriangle className="h-5 w-5 text-sell" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-ink-muted">
      {icon ?? <Inbox className="h-5 w-5" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}
