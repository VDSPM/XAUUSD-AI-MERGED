import type { AppSettings } from "@/types";
import { mockSettings } from "@/mock/mockSettings";
import { simulateLatency } from "./apiClient";

/**
 * Backend contract:
 *   GET /api/settings       -> AppSettings
 *   PUT /api/settings  body: AppSettings -> AppSettings
 */
export const settingsService = {
  getSettings(): Promise<AppSettings> {
    return simulateLatency(mockSettings);
  },

  updateSettings(settings: AppSettings): Promise<AppSettings> {
    return simulateLatency(settings, 400);
  },
};
