import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/States";
import { ChartContainer } from "@/components/chart/ChartContainer";
import { AlignmentBanner } from "@/components/structure/AlignmentBanner";
import { PullbackCard } from "@/components/structure/PullbackCard";
import { FibonacciZoneCard } from "@/components/structure/FibonacciZoneCard";
import { LowerTimeframeList } from "@/components/structure/LowerTimeframeList";
import { EvidenceGrid } from "@/components/smc/EvidenceGrid";
import { DecisionPanel } from "@/components/decision/DecisionPanel";

import { useCandles } from "@/hooks/useCandles";
import { useDirectionAlignment, useHtfPullback, useFibonacciZone, useLowerTimeframeAnalysis } from "@/hooks/useMarketStructure";
import { useSmcEvidence } from "@/hooks/useSmcEvidence";
import { useDecision } from "@/hooks/useDecision";
import type { Timeframe } from "@/types";

const STEPS = [
  "Daily Context",
  "4H Direction",
  "1H Confirmation",
  "HTF Pullback",
  "Fibonacci Zone",
  "LTF Pullback",
  "SMC Evidence",
  "Decision",
];

export default function LiveAnalysis() {
  const [timeframe, setTimeframe] = useState<Timeframe>("15M");
  const { data: candles, loading: candlesLoading } = useCandles(timeframe);
  const { data: alignment, loading: alignmentLoading } = useDirectionAlignment();
  const { data: pullback, loading: pullbackLoading } = useHtfPullback();
  const { data: fibZone, loading: fibLoading } = useFibonacciZone();
  const { data: ltf, loading: ltfLoading } = useLowerTimeframeAnalysis();
  const { data: smc, loading: smcLoading } = useSmcEvidence();
  const { data: decision, loading: decisionLoading, requesting, requestNewAnalysis } = useDecision();

  return (
    <PageContainer
      title="Live Analysis"
      subtitle="Step-by-step walkthrough of the current XAUUSD analysis pipeline"
    >
      {/* Pipeline stepper */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-base-850 px-3 py-1.5 text-xs text-ink-secondary">
              <span className="numeric text-gold-bright font-semibold">{i + 1}</span>
              {step}
            </span>
            {i < STEPS.length - 1 && <span className="text-ink-muted text-xs">→</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8">
          <ChartContainer candles={candles} loading={candlesLoading} timeframe={timeframe} onTimeframeChange={setTimeframe} />
        </div>

        <div className="xl:col-span-4">
          <Card title="Decision" eyebrow="Live Output">
            {decisionLoading || !decision ? (
              <CardSkeleton lines={5} />
            ) : (
              <DecisionPanel decision={decision} onRefresh={requestNewAnalysis} refreshing={requesting} />
            )}
          </Card>
        </div>

        <div className="xl:col-span-6">
          <Card title="Direction Alignment" eyebrow="4H → 1H">
            {alignmentLoading || !alignment ? <CardSkeleton /> : <AlignmentBanner alignment={alignment} />}
          </Card>
        </div>

        <div className="xl:col-span-6">
          <Card title="Higher-Timeframe Pullback" eyebrow="Structure">
            {pullbackLoading || !pullback ? <CardSkeleton /> : <PullbackCard pullback={pullback} />}
          </Card>
        </div>

        <div className="xl:col-span-4">
          {fibLoading || !fibZone ? (
            <Card title="Fibonacci Zone">
              <CardSkeleton />
            </Card>
          ) : (
            <FibonacciZoneCard zone={fibZone} />
          )}
        </div>

        <div className="xl:col-span-8">
          <Card title="Lower-Timeframe Pullback" eyebrow="15M · 5M · 3M · 1M">
            {ltfLoading || !ltf ? <CardSkeleton lines={4} /> : <LowerTimeframeList items={ltf} />}
          </Card>
        </div>

        <div className="xl:col-span-12">
          <Card title="SMC Evidence" eyebrow="Detected Confluence">
            {smcLoading || !smc ? <CardSkeleton lines={6} /> : <EvidenceGrid items={smc.items} />}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
