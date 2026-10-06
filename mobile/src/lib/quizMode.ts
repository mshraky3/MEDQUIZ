/**
 * How the quiz behaves while it is being taken.
 *
 *   study: each answer locks as it is picked, the correct option is marked and
 *          the explanation opens straight away
 *   exam:  silent: no reveal, answers stay changeable, feedback only on the
 *          result screen
 *
 * The choice is a working preference, remembered on the device. Every entry
 * point into /quiz reads it from here (the launcher, which also lets the
 * student change it, and the hub's quick start) so they can never disagree. The
 * final quiz always passes 'exam' explicitly: a mock exam is never revealed.
 */
import { useCallback, useEffect, useState } from 'react';
import { KEYS, getItem, setItem } from './storage';

export const STUDY = 'study';
export const EXAM = 'exam';
export type QuizMode = typeof STUDY | typeof EXAM;

/** Study is the default: the explanations are the point of the feature. */
export async function readQuizMode(): Promise<QuizMode> {
  return (await getItem(KEYS.quizMode)) === EXAM ? EXAM : STUDY;
}

export async function writeQuizMode(mode: QuizMode): Promise<void> {
  await setItem(KEYS.quizMode, mode === EXAM ? EXAM : STUDY);
}

/** The stored mode as state, with a setter that persists. */
export function useQuizMode(): [QuizMode, (mode: QuizMode) => void, boolean] {
  const [mode, setModeState] = useState<QuizMode>(STUDY);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    readQuizMode().then((m) => {
      if (alive) {
        setModeState(m);
        setLoaded(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  const setMode = useCallback((next: QuizMode) => {
    setModeState(next);
    void writeQuizMode(next);
  }, []);
  return [mode, setMode, loaded];
}
