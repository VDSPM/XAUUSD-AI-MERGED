import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/States";
import { DirectionCard } from "@/components/structure/DirectionCard";
import { AlignmentBanner } from "@/components/structure/AlignmentBanner";
import { PullbackCard } from "@/components/structure/PullbackCard";
import { FibonacciZoneCard } from "@/components/structure/FibonacciZoneCard";
import { LowerTimeframeList } from "@/components/structure/LowerTimeframeList";

import { useDirectionAlignment, useHtfPullback, useFibonacciZone, useLowerTimeframeAnalysis } from "@/hooks/useMarketStructure";

export default function MarketStructure() {
  const { data: alignment, loading: alignmentLoading } = useDirectionAlignment();
  const { data: pullback, loading: pullbackLoading } = useHtfPullback();
  const { data: fibZone, loading: fibLoading } = useFibonacciZone();
  const { data: ltf, loading: ltfLoading } = useLowerTimeframeAnalysis();

  return (
    <PageContainer title="Market Structure" subtitle="4H direction, 1H confirmation, pullback and Fibonacci mapping">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-12">
          <Card title="Direction Alignment Rule" eyebrow="Fixed Rule">
            {alignmentLoading || !alignment ? <CardSkeleton /> : <AlignmentBanner alignment={alignment} />}
          </Card>
        </div>

        <div className="xl:col-span-6">
          {alignmentLoading || !alignment ? (
            <Card title="4H Structure">
              <CardSkeleton lines={4} />
            </Card>
          ) : (
            <DirectionCard structure={alignment.htf} />
          )}
        </div>

        <div className="xl:col-span-6">
          {alignmentLoading || !alignment ? (
            <Card title="1H Structure">
              <CardSkeleton lines={4} />
            </Card>
          ) : (
            <DirectionCard structure={alignment.ltfConfirmation} />
          )}
        </div>

        <div className="xl:col-span-6">
          <Card title="Higher-Timeframe Pullback" eyebrow="After Alignment">
            {pullbackLoading || !pullback ? <CardSkeleton /> : <PullbackCard pullback={pullback} />}
          </Card>
        </div>

        <div className="xl:col-span-6">
          {fibLoading || !fibZone ? (
            <Card title="Fibonacci 0.618–0.786">
              <CardSkeleton />
            </Card>
          ) : (
            <FibonacciZoneCard zone={fibZone} />
          )}
        </div>

        <div className="xl:col-span-12">
          <Card title="Lower-Timeframe Pullback" eyebrow="15M · 5M · 3M · 1M">
            {ltfLoading || !ltf ? <CardSkeleton lines={4} /> : <LowerTimeframeList items={ltf} />}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
