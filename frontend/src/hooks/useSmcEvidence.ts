import { smcService } from "@/services/smcService";
import { useAsyncData } from "./useAsyncData";

export function useSmcEvidence() {
  return useAsyncData(() => smcService.getEvidence());
}
