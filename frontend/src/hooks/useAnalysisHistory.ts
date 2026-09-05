import { historyService } from "@/services/historyService";
import { useAsyncData } from "./useAsyncData";

export function useAnalysisHistory() {
  return useAsyncData(() => historyService.getHistory());
}
