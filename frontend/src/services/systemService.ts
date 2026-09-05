import type { SystemHealthSnapshot } from "@/types";
import { apiFetch } from "./apiClient";

interface BackendHealth {
  status: "ok" | "degraded";
  timestamp: string;
  strategyVersion: string;
  dataSource: string;
  database: boolean;
}

export const systemService = {
  async getHealth(): Promise<SystemHealthSnapshot> {
    const data = await apiFetch<BackendHealth>("/health");
    const overall = data.status === "ok" ? "operational" : "degraded";
    return {
      overall,
      services: [
        { id: "backend", name: "Backend API", health: overall, latencyMs: null, lastChecked: data.timestamp, detail: data.strategyVersion },
        { id: "market-data", name: "Market Data", health: data.dataSource === "mock" ? "degraded" : "operational", latencyMs: null, lastChecked: data.timestamp, detail: data.dataSource },
        { id: "database", name: "Database", health: data.database ? "operational" : "degraded", latencyMs: null, lastChecked: data.timestamp, detail: data.database ? "Connected" : "Unavailable" },
      ],
      dataFeedConnected: data.dataSource !== "mock",
      lastAnalysisRunAt: null,
      uptimePct30d: 0,
    };
  },
};
