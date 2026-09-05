import { logger } from "./logger.js";
import type { TradeDecision } from "../decision/types.js";
import type { Timeframe } from "../config/constants.js";

export type AnalysisStatus = "completed" | "insufficient-data" | "provider-error" | "aborted";

export interface AnalysisLogEntry {
  timestamp: string;
  market: string;
  timeframe: Timeframe;
  strategyVersion: string;
  dataSource: string;
  status: AnalysisStatus;
  decision: TradeDecision | null;
  analysisId?: string;
  detail?: string;
}

/**
 * Every analysis run — successful or not — must be traceable. This logger
 * is the single place that emits the structured record described in the
 * spec (timestamp, market, timeframe, strategy version, data source,
 * status, decision). Call sites should not log this information ad hoc
 * elsewhere.
 */
export function logAnalysisRun(entry: Omit<AnalysisLogEntry, "timestamp">): AnalysisLogEntry {
  const full: AnalysisLogEntry = { timestamp: new Date().toISOString(), ...entry };
  logger.info({ analysisLog: full }, `analysis run: ${full.status}`);
  return full;
}
