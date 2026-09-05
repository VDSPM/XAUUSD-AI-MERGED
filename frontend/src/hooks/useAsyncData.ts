import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Generic hook for loading data from a service function.
 * Handles loading/error state and exposes a manual refresh trigger,
 * with optional automatic polling.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options?: { pollIntervalMs?: number }
): AsyncDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => setData(result))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    if (options?.pollIntervalMs) {
      const id = setInterval(load, options.pollIntervalMs);
      return () => clearInterval(id);
    }
  }, [load, options?.pollIntervalMs]);

  return { data, loading, error, refresh: load };
}
