import type { SystemHealthSnapshot } from "@/types";
import { healthStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { formatRelativeTime } from "@/utils/format";

export function SystemOverviewCard({ health }: { health: SystemHealthSnapshot }) {
  const style = healthStyle(health.overall);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-line bg-base-850 p-4 flex flex-col justify-between">
        <p className="eyebrow mb-2">Overall Status</p>
        <Badge status={style} size="md" />
      </div>
      <Stat
        label="Data Feed"
        value={health.dataFeedConnected ? "Connected" : "Disconnected"}
        valueClassName={health.dataFeedConnected ? "text-buy-bright" : "text-sell-bright"}
      />
      <Stat label="Last Analysis Run" value={health.lastAnalysisRunAt ? formatRelativeTime(health.lastAnalysisRunAt) : "—"} />
      <Stat label="30d Uptime" value={`${health.uptimePct30d.toFixed(2)}%`} valueClassName="text-gold-bright" />
    </div>
  );
}
