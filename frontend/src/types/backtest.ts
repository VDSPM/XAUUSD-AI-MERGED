export type BacktestRunStatus = "idle" | "queued" | "running" | "completed" | "failed";

export interface BacktestConfig {
  instrument: "XAUUSD";
  startDate: string;
  endDate: string;
  timeframeSet: string[];
  initialBalance: number;
  riskPerTradePct: number;
  /** Guards surfaced to the user; enforced server-side. */
  preventLookaheadBias: true;
  preventFutureDataLeakage: true;
  realisticExecutionAssumptions: true;
}

export interface EquityPoint {
  time: string;
  balance: number;
}

export interface BacktestSummary {
  totalTrades: number;
  wins: number;
  losses: number;
  winRatePct: number;
  profitFactor: number;
  netProfit: number;
  netProfitPct: number;
  maxDrawdownPct: number;
  averageR: number;
  expectancy: number;
}

export interface BacktestRun {
  id: string;
  status: BacktestRunStatus;
  config: BacktestConfig;
  summary: BacktestSummary | null;
  equityCurve: EquityPoint[];
  startedAt: string | null;
  completedAt: string | null;
}
