import { useCallback, useState } from "react";
import type { BacktestConfig, BacktestRun } from "@/types";
import { backtestService } from "@/services/backtestService";
import { useAsyncData } from "./useAsyncData";

export function useBacktest() {
  const { data, loading, error, refresh } = useAsyncData(() => backtestService.getLatestRun());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BacktestRun | null>(null);

  const runBacktest = useCallback(async (config: BacktestConfig) => {
    setRunning(true);
    try {
      const run = await backtestService.runBacktest(config);
      setResult(run);
      return run;
    } finally {
      setRunning(false);
    }
  }, []);

  return { data: result ?? data, loading, error, refresh, running, runBacktest };
}
