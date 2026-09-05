import { useCallback, useState } from "react";
import { decisionService } from "@/services/decisionService";
import { useAsyncData } from "./useAsyncData";

export function useDecision() {
  const { data, loading, error, refresh } = useAsyncData(() => decisionService.getLatestDecision());
  const [requesting, setRequesting] = useState(false);

  const requestNewAnalysis = useCallback(async () => {
    setRequesting(true);
    try {
      await decisionService.requestNewAnalysis();
      refresh();
    } finally {
      setRequesting(false);
    }
  }, [refresh]);

  return { data, loading, error, refresh, requesting, requestNewAnalysis };
}
