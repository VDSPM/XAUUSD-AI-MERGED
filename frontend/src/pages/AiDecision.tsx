import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/States";
import { DecisionPanel } from "@/components/decision/DecisionPanel";
import { ScoreBreakdown } from "@/components/decision/ScoreBreakdown";
import { AiReasoningPanel } from "@/components/decision/AiReasoningPanel";
import { RiskPanel } from "@/components/risk/RiskPanel";

import { useDecision } from "@/hooks/useDecision";
import { useRisk } from "@/hooks/useRisk";

export default function AiDecision() {
  const { data: decision, loading, requesting, requestNewAnalysis } = useDecision();
  const { data: risk, loading: riskLoading } = useRisk();

  return (
    <PageContainer title="AI Decision" subtitle="Combined quantitative scoring and AI reasoning behind the current call">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-5">
          <Card title="Decision" eyebrow="BUY / SELL / WAIT">
            {loading || !decision ? (
              <CardSkeleton lines={6} />
            ) : (
              <DecisionPanel decision={decision} onRefresh={requestNewAnalysis} refreshing={requesting} />
            )}
          </Card>
        </div>

        <div className="xl:col-span-4">
          <Card title="Quantitative Score" eyebrow="Deterministic">
            {loading || !decision ? <CardSkeleton lines={6} /> : <ScoreBreakdown score={decision.quantitativeScore} />}
          </Card>
        </div>

        <div className="xl:col-span-3">
          <Card title="Risk / Reward" eyebrow="Mock Values">
            {riskLoading || !risk ? <CardSkeleton lines={5} /> : <RiskPanel risk={risk} />}
          </Card>
        </div>

        <div className="xl:col-span-12">
          <Card title="AI Reasoning" eyebrow="Context · Evidence · Conflicts · Conclusion">
            {loading || !decision ? <CardSkeleton lines={6} /> : <AiReasoningPanel reasoning={decision.aiReasoning} />}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
