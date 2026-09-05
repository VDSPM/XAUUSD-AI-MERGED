import { useCallback, useState } from "react";
import type { AppSettings } from "@/types";
import { settingsService } from "@/services/settingsService";
import { useAsyncData } from "./useAsyncData";

export function useSettings() {
  const { data, loading, error, refresh } = useAsyncData(() => settingsService.getSettings());
  const [saving, setSaving] = useState(false);

  const saveSettings = useCallback(
    async (next: AppSettings) => {
      setSaving(true);
      try {
        await settingsService.updateSettings(next);
        refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh]
  );

  return { data, loading, error, refresh, saving, saveSettings };
}
