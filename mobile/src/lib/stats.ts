/**
 * Small pure helpers shared by several screens: durations, accuracy tones and
 * the per-specialty maths over /topic-analysis rows.
 */

/** Formats a duration in seconds as a zero-padded HH:MM:SS clock string. */
export function formatDuration(totalSeconds: unknown): string {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** m:ss for the quiz countdown. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export type Tone = 'high' | 'mid' | 'low' | 'neutral';

/** One accuracy palette, reused everywhere a percentage needs a colour. */
export function accuracyTone(pct: number | null | undefined): Tone {
  if (pct == null || Number.isNaN(pct)) return 'neutral';
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

export type TopicRow = {
  question_type: string;
  total_answered: number | string;
  total_correct?: number | string;
  accuracy?: number | string;
  [key: string]: unknown;
};

export type TopicWithAccuracy = TopicRow & { accuracy: number };

/** Best and worst specialty by accuracy, ignoring anything unanswered. */
export function calculateBestWorstTopics(topicAnalysis: unknown): {
  best: TopicWithAccuracy | null;
  worst: TopicWithAccuracy | null;
} {
  if (!Array.isArray(topicAnalysis) || topicAnalysis.length === 0) return { best: null, worst: null };
  const valid = (topicAnalysis as TopicRow[]).filter(
    (t) => Number(t.total_answered) > 0 && t.total_correct !== undefined
  );
  if (valid.length === 0) return { best: null, worst: null };
  const withAccuracy: TopicWithAccuracy[] = valid
    .map((t) => ({ ...t, accuracy: (Number(t.total_correct) / Number(t.total_answered)) * 100 }))
    .sort((a, b) => b.accuracy - a.accuracy);
  return { best: withAccuracy[0], worst: withAccuracy[withAccuracy.length - 1] };
}

/** Totals across every specialty, summed from the same rows. */
export function totalsFromTopics(topicAnalysis: unknown): { answered: number; correct: number; accuracy: number } {
  if (!Array.isArray(topicAnalysis)) return { answered: 0, correct: 0, accuracy: 0 };
  const rows = topicAnalysis as TopicRow[];
  const answered = rows.reduce((n, t) => n + (Number(t.total_answered) || 0), 0);
  const correct = rows.reduce((n, t) => n + (Number(t.total_correct) || 0), 0);
  return { answered, correct, accuracy: answered > 0 ? (correct / answered) * 100 : 0 };
}

/** Relative time ("3h ago") from an ISO string, with the copy supplied by the caller. */
export function timeAgo(
  iso: string,
  t: {
    justNow: string;
    minutesAgo: (n: number) => string;
    hoursAgo: (n: number) => string;
    daysAgo: (n: number) => string;
  },
  now: number = Date.now()
): string {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(mins) || mins < 1) return t.justNow;
  if (mins < 60) return t.minutesAgo(mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t.hoursAgo(hours);
  return t.daysAgo(Math.floor(hours / 24));
}
