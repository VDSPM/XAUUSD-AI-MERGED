import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/States";
import { SystemOverviewCard } from "@/components/system/SystemOverviewCard";
import { ServiceStatusRow } from "@/components/system/ServiceStatusRow";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import { RefreshCcw } from "lucide-react";

export default function SystemStatus() {
  const { data: health, loading, refresh } = useSystemHealth();

  return (
    <PageContainer
      title="System Status"
      subtitle="Health of the data feed, deterministic engines, and AI reasoning service"
      action={
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink-primary hover:border-gold/30 transition-colors"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refresh
        </button>
      }
    >
      <div className="space-y-4">
        {loading || !health ? (
          <Card>
            <CardSkeleton lines={2} />
          </Card>
        ) : (
          <SystemOverviewCard health={health} />
        )}

        <Card title="Services" eyebrow="Component Health">
          {loading || !health ? (
            <CardSkeleton lines={8} />
          ) : (
            <div className="space-y-2">
              {health.services.map((service) => (
                <ServiceStatusRow key={service.id} service={service} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
