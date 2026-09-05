export type BacktestRunStatus = "not-implemented";

export interface BacktestConfig {
  instrument: "XAUUSD";
  startDate: string;
  endDate: string;
}

export interface BacktestRun {
  id: string;
  status: BacktestRunStatus;
  config: BacktestConfig;
  message: string;
}
