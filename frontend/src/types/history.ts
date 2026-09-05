import type { TradeDecision } from "./decision";

export type HistoryOutcome = "win" | "loss" | "breakeven" | "pending" | "no-trade";

export interface AnalysisHistoryEntry {
  id: string;
  asOf: string;
  decision: TradeDecision;
  confidence: number;
  entry: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  outcome: HistoryOutcome;
  rMultiple: number | null;
  reasonSummary: string;
}
