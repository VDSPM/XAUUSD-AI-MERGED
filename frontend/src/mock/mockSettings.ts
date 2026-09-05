import type { AppSettings } from "@/types";

export const mockSettings: AppSettings = {
  risk: {
    accountBalance: 25000,
    riskPerTradePct: 1,
    dailyRiskLimitPct: 3,
    dailyTradeLimit: 3,
  },
  analysis: {
    autoRefreshEnabled: true,
    autoRefreshIntervalSec: 30,
    minConfidenceToDisplay: 40,
    requireGoldenZoneFill: true,
  },
  notifications: {
    notifyOnBuySell: true,
    notifyOnWait: false,
    notifyOnRiskBreach: true,
  },
};
