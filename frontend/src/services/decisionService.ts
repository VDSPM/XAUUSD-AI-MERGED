import type { AnalysisDecision } from "@/types";
import { apiFetch } from "./apiClient";

interface DecisionResponse {
  decision: AnalysisDecision;
  risk: unknown;
}

export const decisionService = {
  async getLatestDecision(): Promise<AnalysisDecision> {
    const data = await apiFetch<DecisionResponse>("/decision/xauusd");
    return data.decision;
  },

  async requestNewAnalysis(): Promise<AnalysisDecision> {
    const data = await apiFetch<{ decision: AnalysisDecision }>("/analysis/xauusd");
    return data.decision;
  },
};
