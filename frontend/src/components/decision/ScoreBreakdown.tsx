import type { QuantitativeScore } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ScoreBreakdown({ score }: { score: QuantitativeScore }) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <p className="eyebrow">Quantitative Score</p>
        <p className="numeric text-2xl font-bold text-gold-bright">
          {score.total}
          <span className="text-sm text-ink-muted font-normal">/{score.max}</span>
        </p>
      </div>
      <ProgressBar value={(score.total / score.max) * 100} colorClassName="bg-gold" height="h-2" />

      <ul className="space-y-3 pt-1">
        {score.breakdown.map((item) => (
          <li key={item.factor}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-ink-secondary">{item.factor}</span>
              <span className="numeric text-ink-muted">
                {item.points}/{item.maxPoints}
              </span>
            </div>
            <ProgressBar
              value={(item.points / item.maxPoints) * 100}
              colorClassName="bg-base-500"
              trackClassName="bg-base-800"
              height="h-1"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
