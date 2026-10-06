import { useCallback, useEffect, useRef, useState } from 'react';
import { isAborted } from './api';

export type LoadState<T> = {
  data: T | null;
  /** First load in flight (no data yet). */
  loading: boolean;
  /** A reload in flight (data may already be present). */
  refreshing: boolean;
  error: unknown;
  reload: () => Promise<void>;
  setData: (next: T | null | ((prev: T | null) => T | null)) => void;
};

/**
 * Loads something once on mount (and when `deps` change), with abort on unmount
 * and a manual `reload`. A stale response can never land after a newer request.
 */
export function useLoad<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
  options: { enabled?: boolean } = {}
): LoadState<T> {
  const { enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const seq = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const run = useCallback(async (initial: boolean) => {
    controller.current?.abort();
    const mine = ++seq.current;
    const ctrl = new AbortController();
    controller.current = ctrl;
    if (initial) setLoading(true);
    else setRefreshing(true);
    try {
      const result = await loaderRef.current(ctrl.signal);
      if (mine !== seq.current) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (mine !== seq.current || isAborted(err)) return;
      setError(err);
    } finally {
      if (mine === seq.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }
    void run(true);
    return () => {
      controller.current?.abort();
      seq.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const reload = useCallback(() => run(false), [run]);
  return { data, loading, refreshing, error, reload, setData };
}
