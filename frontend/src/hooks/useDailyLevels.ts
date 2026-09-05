import { marketService } from "@/services/marketService";
import { useAsyncData } from "./useAsyncData";

export function useDailyLevels() {
  return useAsyncData(() => marketService.getDailyLevels());
}
