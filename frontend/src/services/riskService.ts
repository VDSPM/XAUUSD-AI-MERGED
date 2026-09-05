import type { RiskAssessment } from "@/types";
import { mockRisk } from "@/mock/mockRisk";
import { simulateLatency } from "./apiClient";

/**
 * Backend contract:
 *   GET /api/risk/current -> RiskAssessment
 *   (Real-money execution is out of scope — this endpoint only validates
 *   and reports proposed risk parameters.)
 */
export const riskService = {
  getCurrentRisk(): Promise<RiskAssessment> {
    return simulateLatency(mockRisk);
  },
};
