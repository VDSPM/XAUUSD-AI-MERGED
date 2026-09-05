import type { AiReasoning } from "@/types";
import { BrainCircuit, AlertTriangle } from "lucide-react";

export function AiReasoningPanel({ reasoning }: { reasoning: AiReasoning }) {
  return (
    <div className="space-y-4">
      <ReasoningBlock label="Market Context" text={reasoning.marketContext} />
      <ReasoningBlock label="Evidence Interpretation" text={reasoning.evidenceInterpretation} />
      {reasoning.conflictingEvidence && (
        <div className="rounded-lg border border-wait/30 bg-wait-dim px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-wait-bright" />
            <p className="eyebrow text-wait-bright">Conflicting Evidence</p>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed">{reasoning.conflictingEvidence}</p>
        </div>
      )}
      <div className="rounded-lg border border-gold/25 bg-gold/5 px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <BrainCircuit className="h-3.5 w-3.5 text-gold-bright" />
          <p className="eyebrow text-gold-bright">Final Reasoning</p>
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed">{reasoning.finalReasoning}</p>
      </div>
    </div>
  );
}

function ReasoningBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="eyebrow mb-1.5">{label}</p>
      <p className="text-sm text-ink-secondary leading-relaxed">{text}</p>
    </div>
  );
}
