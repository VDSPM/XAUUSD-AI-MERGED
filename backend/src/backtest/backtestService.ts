import { randomUUID } from "node:crypto";
import type { BacktestConfig, BacktestRun } from "./types.js";

/**
 * Backtesting scaffold.
 *
 * Per the project's development philosophy, backtesting is a later build
 * stage that must reuse the exact same strategy modules used for live
 * analysis (structure, pullback, fibonacci, smc, scoring, decision) and
 * must guard against look-ahead bias, future-data leakage, and unrealistic
 * execution assumptions.
 *
 * This foundation build only establishes the module boundary and response
 * shape so the API route exists and the frontend has a stable contract to
 * build against. The actual historical replay engine (candle-by-candle
 * pipeline execution with no access to future bars) is intentionally not
 * implemented yet — building it correctly requires the live pipeline above
 * to be finalized first, per the incremental development plan.
 */
export class BacktestService {
  async run(config: BacktestConfig): Promise<BacktestRun> {
    return {
      id: randomUUID(),
      status: "not-implemented",
      config,
      message:
        "Backtesting engine is not implemented in this foundation build. It will reuse the live " +
        "structure/pullback/fibonacci/smc/scoring/decision modules once they are finalized, with " +
        "explicit look-ahead-bias and data-leakage guards.",
    };
  }

  async getLatest(): Promise<BacktestRun | null> {
    return null;
  }
}

export const backtestService = new BacktestService();
