import type { ServiceStatus } from "@/types";
import { healthStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/utils/format";

export function ServiceStatusRow({ service }: { service: ServiceStatus }) {
  const style = healthStyle(service.health);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-line bg-base-900/50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-primary">{service.name}</p>
        <p className="text-xs text-ink-muted mt-0.5 truncate">{service.detail}</p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {service.latencyMs !== null && (
          <span className="numeric text-xs text-ink-muted hidden sm:inline">{service.latencyMs}ms</span>
        )}
        <span className="text-[11px] text-ink-muted hidden md:inline">{formatRelativeTime(service.lastChecked)}</span>
        <Badge status={style} />
      </div>
    </div>
  );
}
