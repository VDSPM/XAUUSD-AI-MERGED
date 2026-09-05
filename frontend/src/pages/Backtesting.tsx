import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { Badge } from "@/components/ui/Badge";
import { BacktestConfigForm } from "@/components/backtest/BacktestConfigForm";
import { BacktestResultsSummary } from "@/components/backtest/BacktestResultsSummary";
import { BacktestEquityChart } from "@/components/backtest/BacktestEquityChart";

import { useBacktest } from "@/hooks/useBacktest";
import { backtestStatusStyle } from "@/utils/status";
import { formatDateTime } from "@/utils/format";

export default function Backtesting() {
  const { data: run, loading, running, runBacktest } = useBacktest();

  return (
    <PageContainer
      title="Backtesting"
      subtitle="Historical XAUUSD backtesting using the same strategy modules as live analysis"
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-4">
          <Card title="Configure Run" eyebrow="Backtest Parameters">
            <BacktestConfigForm onRun={runBacktest} running={running} />
          </Card>
        </div>

        <div className="xl:col-span-8 space-y-4">
          <Card
            title="Results Summary"
            eyebrow="Latest Run"
            action={run ? <Badge status={backtestStatusStyle(running ? "running" : run.status)} /> : undefined}
          >
            {loading || !run ? (
              <CardSkeleton lines={4} />
            ) : running ? (
              <EmptyState message="Backtest in progress — this will use the same deterministic modules as live analysis." />
            ) : run.summary ? (
              <div className="space-y-4">
                <BacktestResultsSummary summary={run.summary} />
                {run.completedAt && (
                  <p className="text-[11px] text-ink-muted">
                    Completed {formatDateTime(run.completedAt)} · {run.config.startDate} → {run.config.endDate}
                  </p>
                )}
              </div>
            ) : (
              <EmptyState message="No completed backtest yet. Configure and run one to see results here." />
            )}
          </Card>

          <Card title="Equity Curve" eyebrow="Balance Over Time">
            {loading || !run ? <CardSkeleton lines={4} /> : <BacktestEquityChart data={run.equityCurve} />}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
