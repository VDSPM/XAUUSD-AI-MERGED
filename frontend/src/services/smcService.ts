import type { SmcEvidenceSet } from "@/types";
import { apiFetch } from "./apiClient";

export const smcService = {
  getEvidence(): Promise<SmcEvidenceSet> {
    return apiFetch<SmcEvidenceSet>("/smc/xauusd");
  },
};
