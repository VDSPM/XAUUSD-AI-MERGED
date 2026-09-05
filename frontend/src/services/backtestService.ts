import type { BacktestConfig, BacktestRun } from "@/types";
import { mockBacktestRun } from "@/mock/mockBacktest";
import { simulateLatency } from "./apiClient";

/**
 * Backend contract:
 *   GET  /api/backtest/latest        -> BacktestRun
 *   POST /api/backtest/run  { BacktestConfig } -> BacktestRun
 *
 * The backend must reuse the same strategy modules used for live analysis,
 * and must guard against look-ahead bias, future-data leakage, and
 * unrealistic execution assumptions (see BacktestConfig).
 */
export const backtestService = {
  getLatestRun(): Promise<BacktestRun> {
    return simulateLatency(mockBacktestRun);
  },

  runBacktest(_config: BacktestConfig): Promise<BacktestRun> {
    return simulateLatency(mockBacktestRun, 1200);
  },
};
