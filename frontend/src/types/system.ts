export type ServiceHealth = "operational" | "degraded" | "down" | "unknown";

export interface ServiceStatus {
  id: string;
  name: string;
  health: ServiceHealth;
  latencyMs: number | null;
  lastChecked: string;
  detail: string;
}

export interface SystemHealthSnapshot {
  overall: ServiceHealth;
  services: ServiceStatus[];
  dataFeedConnected: boolean;
  lastAnalysisRunAt: string | null;
  uptimePct30d: number;
}
