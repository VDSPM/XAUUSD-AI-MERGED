import type { RiskAssessment } from "@/types";

export const mockRisk: RiskAssessment = {
  levels: {
    entry: 2410.5,
    stopLoss: 2397.8,
    takeProfit: 2436.2,
    riskRewardRatio: 2.02,
    positionSizeLots: 0.42,
    riskAmount: 254.0,
    riskPercentOfAccount: 1.0,
  },
  limits: {
    dailyRiskUsed: 1.0,
    dailyRiskLimit: 3.0,
    tradesTakenToday: 1,
    dailyTradeLimit: 3,
    status: "within-limits",
    note: "Daily risk and trade count are within configured limits.",
  },
  validated: false,
};
