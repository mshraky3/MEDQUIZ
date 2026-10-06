import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { getJson, setJson } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

/**
 * A student's place on the reading path, kept per account on the device: which
 * steps are done, the resume point and the checkpoints passed. Both the path
 * screen and the lesson screen read and write it, so it lives in one store they
 * share rather than in either screen's state.
 */
export type PathState = { lastStepId: string | null; lastAt: number; checkpoints: Record<string, boolean> };
export type SummaryProgress = { done: Record<string, boolean>; path: PathState; loaded: boolean };

export const EMPTY_PATH: PathState = { lastStepId: null, lastAt: 0, checkpoints: {} };
const EMPTY: SummaryProgress = { done: {}, path: EMPTY_PATH, loaded: false };

const stores = new Map<string, SummaryProgress>();
const listeners = new Map<string, Set<() => void>>();

const progressKey = (who: string) => `summaries.progress.${who}`;
const pathKey = (who: string) => `summaries.path.${who}`;

const emit = (who: string) => listeners.get(who)?.forEach((fn) => fn());
const read = (who: string): SummaryProgress => stores.get(who) || EMPTY;

function write(who: string, next: SummaryProgress) {
  stores.set(who, next);
  emit(who);
}

async function load(who: string) {
  const [done, path] = await Promise.all([getJson<Record<string, boolean>>(progressKey(who)), getJson<Partial<PathState>>(pathKey(who))]);
  write(who, {
    done: done && typeof done === 'object' ? done : {},
    path: { ...EMPTY_PATH, ...(path || {}), checkpoints: { ...(path?.checkpoints || {}) } },
    loaded: true,
  });
}

export function toggleDone(who: string, stepId: string): boolean {
  const cur = read(who);
  const done = { ...cur.done };
  const marking = !done[stepId];
  if (marking) done[stepId] = true;
  else delete done[stepId];
  write(who, { ...cur, done });
  void setJson(progressKey(who), done);
  return marking;
}

export function updatePath(who: string, updater: (prev: PathState) => PathState) {
  const cur = read(who);
  const path = updater(cur.path);
  write(who, { ...cur, path });
  void setJson(pathKey(who), path);
}

/** The signed-in account's reading progress, plus the actions that change it. */
export function useSummaryProgress() {
  const { user } = useAuth();
  const who = user?.username || user?.email || 'guest';

  const subscribe = useCallback(
    (fn: () => void) => {
      if (!listeners.has(who)) listeners.set(who, new Set());
      listeners.get(who)!.add(fn);
      return () => listeners.get(who)?.delete(fn);
    },
    [who]
  );
  const state = useSyncExternalStore(subscribe, () => read(who), () => EMPTY);

  useEffect(() => {
    if (!stores.get(who)?.loaded) void load(who);
  }, [who]);

  return {
    ...state,
    toggleDone: useCallback((stepId: string) => toggleDone(who, stepId), [who]),
    updatePath: useCallback((updater: (prev: PathState) => PathState) => updatePath(who, updater), [who]),
  };
}

/** Test helper: forget everything in memory. */
export function resetSummaryStores() {
  stores.clear();
  listeners.clear();
}
