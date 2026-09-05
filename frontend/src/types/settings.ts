export interface RiskSettings {
  accountBalance: number;
  riskPerTradePct: number;
  dailyRiskLimitPct: number;
  dailyTradeLimit: number;
}

export interface AnalysisSettings {
  autoRefreshEnabled: boolean;
  autoRefreshIntervalSec: number;
  minConfidenceToDisplay: number;
  requireGoldenZoneFill: boolean;
}

export interface NotificationSettings {
  notifyOnBuySell: boolean;
  notifyOnWait: boolean;
  notifyOnRiskBreach: boolean;
}

export interface AppSettings {
  risk: RiskSettings;
  analysis: AnalysisSettings;
  notifications: NotificationSettings;
}
