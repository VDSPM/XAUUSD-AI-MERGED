import type { AnalysisHistoryEntry } from "@/types";
import { mockHistory } from "@/mock/mockHistory";
import { simulateLatency } from "./apiClient";

/**
 * Backend contract:
 *   GET /api/history?limit=&offset= -> AnalysisHistoryEntry[]
 */
export const historyService = {
  getHistory(): Promise<AnalysisHistoryEntry[]> {
    return simulateLatency(mockHistory);
  },
};
