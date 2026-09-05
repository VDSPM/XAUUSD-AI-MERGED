import { systemService } from "@/services/systemService";
import { useAsyncData } from "./useAsyncData";

export function useSystemHealth(pollIntervalMs = 20000) {
  return useAsyncData(() => systemService.getHealth(), { pollIntervalMs });
}
