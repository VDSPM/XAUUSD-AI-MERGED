import { useMemo } from "react";
import type { Timeframe } from "@/types";
import { marketService } from "@/services/marketService";
import { useAsyncData } from "./useAsyncData";

export function useCandles(timeframe: Timeframe) {
  const fetcher = useMemo(() => () => marketService.getCandles(timeframe), [timeframe]);
  return useAsyncData(fetcher);
}
