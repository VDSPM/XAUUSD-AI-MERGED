export type RiskStatus = "within-limits" | "elevated" | "blocked";

export interface RiskLevels {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  positionSizeLots: number;
  riskAmount: number;
  riskPercentOfAccount: number;
}

export interface RiskLimits {
  dailyRiskUsed: number;
  dailyRiskLimit: number;
  tradesTakenToday: number;
  dailyTradeLimit: number;
  status: RiskStatus;
  note: string;
}

export interface RiskAssessment {
  levels: RiskLevels;
  limits: RiskLimits;
  /** True once risk validation would allow the trade to proceed (mock only, not executed). */
  validated: boolean;
}
