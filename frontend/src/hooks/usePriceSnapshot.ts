import { marketService } from "@/services/marketService";
import { useAsyncData } from "./useAsyncData";

export function usePriceSnapshot(pollIntervalMs = 15000) {
  return useAsyncData(() => marketService.getPriceSnapshot(), { pollIntervalMs });
}
