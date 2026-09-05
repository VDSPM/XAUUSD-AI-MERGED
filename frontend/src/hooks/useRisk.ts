import { riskService } from "@/services/riskService";
import { useAsyncData } from "./useAsyncData";

export function useRisk() {
  return useAsyncData(() => riskService.getCurrentRisk());
}
