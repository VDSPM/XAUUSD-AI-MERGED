import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { CardSkeleton, ErrorState } from "@/components/ui/States";
import { Badge } from "@/components/ui/Badge";
import { ChartContainer } from "@/components/chart/ChartContainer";
import { DecisionPanel } from "@/components/decision/DecisionPanel";
import { EvidenceSummaryList } from "@/components/smc/EvidenceSummaryList";
import { RiskPanel } from "@/components/risk/RiskPanel";
import { RecentAnalysisList } from "@/components/history/RecentAnalysisList";
import { FibonacciZoneCard } from "@/components/structure/FibonacciZoneCard";
import { AiReasoningPanel } from "@/components/decision/AiReasoningPanel";

import { usePriceSnapshot } from "@/hooks/usePriceSnapshot";
import { useDailyLevels } from "@/hooks/useDailyLevels";
import { useDirectionAlignment, useFibonacciZone } from "@/hooks/useMarketStructure";
import { useSmcEvidence } from "@/hooks/useSmcEvidence";
import { useDecision } from "@/hooks/useDecision";
import { useRisk } from "@/hooks/useRisk";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useCandles } from "@/hooks/useCandles";
import { useState } from "react";
import type { Timeframe } from "@/types";

import { biasStyle } from "@/utils/status";
import { formatPrice, formatSigned, formatPercent } from "@/utils/format";

export default function Dashboard() {
  const { data: price, loading: priceLoading } = usePriceSnapshot();
  const { data: dailyLevels, loading: levelsLoading } = useDailyLevels();
  const { data: alignment, loading: alignmentLoading } = useDirectionAlignment();
  const { data: fibZone, loading: fibLoading } = useFibonacciZone();
  const { data: smc, loading: smcLoading } = useSmcEvidence();
  const { data: decision, loading: decisionLoading, requesting, requestNewAnalysis } = useDecision();
  const { data: risk, loading: riskLoading } = useRisk();
  const { data: history, loading: historyLoading } = useAnalysisHistory();

  const [timeframe, setTimeframe] = useState<Timeframe>("1H");
  const { data: candles, loading: candlesLoading } = useCandles(timeframe);

  const positive = (price?.changeAbs ?? 0) >= 0;

  return (
    <PageContainer title="Dashboard" subtitle="XAUUSD live analysis overview">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Top stat row */}
        <div className="xl:col-span-3">
          <Card title="XAUUSD Price" eyebrow="Live Snapshot">
            {priceLoading || !price ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-3">
                <p className="numeric text-3xl font-bold text-ink-primary">{formatPrice(price.price)}</p>
                <p className={`numeric text-sm font-medium ${positive ? "text-buy-bright" : "text-sell-bright"}`}>
                  {formatSigned(price.changeAbs)} ({formatPercent(price.changePct)})
                </p>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line-soft">
                  <Stat label="Day High" value={formatPrice(price.dayHigh)} />
                  <Stat label="Day Low" value={formatPrice(price.dayLow)} align="right" />
                  <Stat label="Bid" value={formatPrice(price.bid)} />
                  <Stat label="Ask" value={formatPrice(price.ask)} align="right" />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          <Card title="Daily Reference Levels" eyebrow="Context Only">
            {levelsLoading || !dailyLevels ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Prev. Open" value={formatPrice(dailyLevels.previousOpen)} />
                  <Stat label="Prev. Close" value={formatPrice(dailyLevels.previousClose)} align="right" />
                  <Stat label="Prev. High" value={formatPrice(dailyLevels.previousHigh)} />
                  <Stat label="Prev. Low" value={formatPrice(dailyLevels.previousLow)} align="right" />
                </div>
                <p className="text-[11px] text-ink-muted pt-2 border-t border-line-soft leading-relaxed">
                  {dailyLevels.note}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          <Card title="4H / 1H Status" eyebrow="Market Direction">
            {alignmentLoading || !alignment ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-secondary">4H Bias</span>
                  <Badge status={biasStyle(alignment.htf.bias)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-secondary">1H Confirmation</span>
                  <Badge status={biasStyle(alignment.ltfConfirmation.bias)} />
                </div>
                <p className="text-[11px] text-ink-muted pt-2 border-t border-line-soft leading-relaxed">
                  {alignment.ruleNote}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {fibLoading || !fibZone ? (
            <Card title="Fibonacci Zone">
              <CardSkeleton />
            </Card>
          ) : (
            <FibonacciZoneCard zone={fibZone} />
          )}
        </div>

        {/* Chart */}
        <div className="xl:col-span-8">
          <ChartContainer
            candles={candles}
            loading={candlesLoading}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>

        {/* Decision panel */}
        <div className="xl:col-span-4">
          <Card title="Decision" eyebrow="AI Analysis Output">
            {decisionLoading || !decision ? (
              <CardSkeleton lines={5} />
            ) : (
              <DecisionPanel decision={decision} onRefresh={requestNewAnalysis} refreshing={requesting} />
            )}
          </Card>
        </div>

        {/* SMC evidence summary */}
        <div className="xl:col-span-4">
          <Card title="Setup Status" eyebrow="SMC Evidence">
            {smcLoading || !smc ? <CardSkeleton lines={6} /> : <EvidenceSummaryList items={smc.items} />}
          </Card>
        </div>

        {/* AI reasoning */}
        <div className="xl:col-span-4">
          <Card title="AI Explanation" eyebrow="Reasoning">
            {decisionLoading || !decision ? (
              <CardSkeleton lines={5} />
            ) : (
              <AiReasoningPanel reasoning={decision.aiReasoning} />
            )}
          </Card>
        </div>

        {/* Risk panel */}
        <div className="xl:col-span-4">
          <Card title="Risk / Reward" eyebrow="Mock Values">
            {riskLoading || !risk ? <CardSkeleton lines={5} /> : <RiskPanel risk={risk} />}
          </Card>
        </div>

        {/* Recent analysis */}
        <div className="xl:col-span-12">
          <Card title="Recent Analysis" eyebrow="History">
            {historyLoading || !history ? (
              <CardSkeleton lines={4} />
            ) : history.length === 0 ? (
              <ErrorState message="No analysis history yet." />
            ) : (
              <RecentAnalysisList entries={history} />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
