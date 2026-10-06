import { describe, expect, it } from 'vitest';
import { parseInline as parseDocInline } from '@/features/docs/docInline';
import { explanationPlain, parseExplanation, parseInline } from '@/lib/explanation';
import { fromISO, monthGrid, toISO } from '@/lib/dates';
import { formatDate, formatNumber } from '@/lib/format';
import { SOURCE_LABELS, getSourceLabel, getTypeLabel } from '@/lib/labels';
import { accuracyTone, calculateBestWorstTopics, formatClock, formatDuration, timeAgo, totalsFromTopics } from '@/lib/stats';
import { MEDICAL, NURSING, TRACKS, TRACK_KEYS, normalizeTrack, pick, specialtyKeys, trackLabel } from '@/lib/tracks';
import { appRouteForWebPath } from '@/lib/webPaths';

describe('tracks', () => {
  it('defaults anything unknown to the medical track', () => {
    expect(normalizeTrack('NURSING')).toBe(NURSING);
    expect(normalizeTrack(' medical ')).toBe(MEDICAL);
    expect(normalizeTrack('dentistry')).toBe(MEDICAL);
    expect(normalizeTrack(undefined)).toBe(MEDICAL);
    expect(normalizeTrack(42)).toBe(MEDICAL);
    // Object.prototype keys must not be treated as tracks.
    expect(normalizeTrack('constructor')).toBe(MEDICAL);
    expect(normalizeTrack('__proto__')).toBe(MEDICAL);
  });

  it('keeps the two tracks on disjoint specialty keys', () => {
    const med = specialtyKeys(MEDICAL);
    const nur = specialtyKeys(NURSING);
    expect(med.length).toBeGreaterThan(0);
    expect(nur.length).toBeGreaterThan(0);
    expect(med.filter((k) => nur.includes(k))).toEqual([]);
    expect(TRACK_KEYS.sort()).toEqual(['medical', 'nursing']);
  });

  it('labels in both languages and falls back to Arabic', () => {
    expect(trackLabel(MEDICAL, 'en')).toBeTruthy();
    expect(trackLabel(NURSING, 'ar')).toBeTruthy();
    expect(pick({ ar: 'ع', en: 'E' }, 'en')).toBe('E');
    expect(pick({ ar: 'ع', en: '' }, 'en')).toBe('');
    expect(pick(undefined, 'en')).toBe('');
  });

  it('every specialty has an icon and a label in both languages', () => {
    for (const track of TRACK_KEYS) {
      for (const s of TRACKS[track].specialties) {
        expect(s.icon, s.key).toBeTruthy();
        expect(s.label.ar, s.key).toBeTruthy();
        expect(s.label.en, s.key).toBeTruthy();
      }
    }
  });
});

describe('labels', () => {
  it('resolves specialty keys and falls back to the raw key', () => {
    const key = specialtyKeys(MEDICAL)[0];
    expect(getTypeLabel(key, 'en')).not.toBe(key);
    expect(getTypeLabel('some-new-type', 'en')).toBe('some-new-type');
    expect(getTypeLabel(null)).toBe('');
  });

  it('knows the live sources and shows legacy keys as-is rather than blank', () => {
    expect(getSourceLabel('MedicalMonthlyRecall', 'ar')).toBe(SOURCE_LABELS.ar.MedicalMonthlyRecall);
    expect(getSourceLabel('SomeFutureBank', 'en')).toBe('SomeFutureBank');
    expect(getSourceLabel(null, 'en')).toBeTruthy();
  });
});

describe('stats', () => {
  it('formats durations and clocks', () => {
    expect(formatDuration(0)).toBe('00:00:00');
    expect(formatDuration(3725)).toBe('01:02:05');
    expect(formatDuration('90')).toBe('00:01:30');
    expect(formatDuration(-5)).toBe('00:00:00');
    expect(formatDuration(undefined)).toBe('00:00:00');
    expect(formatClock(605)).toBe('10:05');
    expect(formatClock(-1)).toBe('0:00');
    expect(formatClock(59.9)).toBe('0:59');
  });

  it('bands accuracy', () => {
    expect(accuracyTone(75)).toBe('high');
    expect(accuracyTone(74.99)).toBe('mid');
    expect(accuracyTone(50)).toBe('mid');
    expect(accuracyTone(49.9)).toBe('low');
    expect(accuracyTone(0)).toBe('low');
    expect(accuracyTone(null)).toBe('neutral');
    expect(accuracyTone(NaN)).toBe('neutral');
  });

  const rows = [
    { question_type: 'surgery', total_answered: 10, total_correct: 9 },
    { question_type: 'medicine', total_answered: 20, total_correct: 10 },
    { question_type: 'pediatrics', total_answered: 0, total_correct: 0 },
    { question_type: 'obgyn', total_answered: '5', total_correct: '1' },
  ];

  it('picks best and worst specialty and ignores unanswered ones', () => {
    const { best, worst } = calculateBestWorstTopics(rows);
    expect(best?.question_type).toBe('surgery');
    expect(worst?.question_type).toBe('obgyn');
    expect(calculateBestWorstTopics([])).toEqual({ best: null, worst: null });
    expect(calculateBestWorstTopics(null)).toEqual({ best: null, worst: null });
    expect(calculateBestWorstTopics([{ question_type: 'x', total_answered: 0 }])).toEqual({ best: null, worst: null });
  });

  it('sums totals across specialties', () => {
    expect(totalsFromTopics(rows)).toEqual({ answered: 35, correct: 20, accuracy: (20 / 35) * 100 });
    expect(totalsFromTopics([])).toEqual({ answered: 0, correct: 0, accuracy: 0 });
    expect(totalsFromTopics('nope')).toEqual({ answered: 0, correct: 0, accuracy: 0 });
  });

  it('describes elapsed time with the supplied copy', () => {
    const t = { justNow: 'now', minutesAgo: (n: number) => `${n}m`, hoursAgo: (n: number) => `${n}h`, daysAgo: (n: number) => `${n}d` };
    const now = Date.parse('2026-10-07T12:00:00Z');
    expect(timeAgo('2026-10-07T11:59:30Z', t, now)).toBe('now');
    expect(timeAgo('2026-10-07T11:15:00Z', t, now)).toBe('45m');
    expect(timeAgo('2026-10-07T07:00:00Z', t, now)).toBe('5h');
    expect(timeAgo('2026-10-04T12:00:00Z', t, now)).toBe('3d');
    expect(timeAgo('garbage', t, now)).toBe('now');
  });
});

describe('format', () => {
  it('uses Latin digits in Arabic, like the website', () => {
    expect(formatNumber(1234, 'ar')).toMatch(/^[\d,٬.]+$/);
    expect(formatNumber(1234, 'ar')).not.toMatch(/[٠-٩]/);
    expect(formatNumber(12, 'en')).toBe('12');
    expect(formatNumber('', 'en')).toBe('');
    expect(formatNumber(null, 'en')).toBe('');
    expect(formatNumber('abc', 'en')).toBe('');
    expect(formatDate('2026-10-07T00:00:00Z', 'ar')).not.toMatch(/[٠-٩]/);
    expect(formatDate('not a date', 'en')).toBe('');
    expect(formatDate(null, 'en')).toBe('');
  });
});

describe('dates', () => {
  it('round-trips ISO dates and rejects impossible ones', () => {
    expect(toISO(new Date(2026, 9, 7))).toBe('2026-10-07');
    expect(toISO(fromISO('2026-02-28')!)).toBe('2026-02-28');
    expect(fromISO('2026-02-30')).toBeNull();
    expect(fromISO('2026-13-01')).toBeNull();
    expect(fromISO('7/10/2026')).toBeNull();
    expect(fromISO('')).toBeNull();
    expect(fromISO(null)).toBeNull();
  });

  it('lays a month out in whole Sunday-first weeks', () => {
    // October 2026 starts on a Thursday and has 31 days.
    const weeks = monthGrid(2026, 9);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0]).toEqual([null, null, null, null, 1, 2, 3]);
    expect(weeks.flat().filter((d) => d !== null)).toHaveLength(31);
    // 4 padding cells + 31 days fill exactly five weeks; the 31st is a Saturday.
    expect(weeks).toHaveLength(5);
    expect(weeks[4].at(-1)).toBe(31);
    // A month that does not end on Saturday is padded out to a full row.
    expect(monthGrid(2026, 8).at(-1)!.at(-1)).toBeNull();
    // February 2026 starts on a Sunday and has exactly 28 days: four full weeks.
    expect(monthGrid(2026, 1)).toHaveLength(4);
  });
});

describe('explanation parsing (same grammar as the website)', () => {
  it('splits bold runs and leaves stray markers literal', () => {
    expect(parseInline('a **b** c')).toEqual([
      { bold: false, text: 'a ' },
      { bold: true, text: 'b' },
      { bold: false, text: ' c' },
    ]);
    // An unclosed pair is left literal rather than swallowing the rest of the text.
    expect(parseInline('5 ** 2 and x')).toEqual([{ bold: false, text: '5 ** 2 and x' }]);
    expect(parseInline('**only opened')).toEqual([{ bold: false, text: '**only opened' }]);
    expect(parseInline('')).toEqual([{ bold: false, text: '' }]);
  });

  it('turns dashes into one list per consecutive run and drops blank lines', () => {
    const blocks = parseExplanation('**Core:** x\n- a\n- b\n\nPara\n* c');
    expect(blocks.map((b) => b.type)).toEqual(['p', 'ul', 'p', 'ul']);
    expect((blocks[1] as any).items).toHaveLength(2);
    expect(parseExplanation('')).toEqual([]);
  });

  it('flattens to plain text without markers', () => {
    expect(explanationPlain('**Core:** a\n- b\n- c')).toBe('Core: a b c');
  });
});

describe('document inline markup', () => {
  it('parses **bold** and [[href|label]] and keeps plain text', () => {
    expect(parseDocInline('see [[/faq|the FAQ]] and **this**!')).toEqual([
      { kind: 'text', text: 'see ' },
      { kind: 'link', text: 'the FAQ', href: '/faq' },
      { kind: 'text', text: ' and ' },
      { kind: 'bold', text: 'this' },
      { kind: 'text', text: '!' },
    ]);
    expect(parseDocInline('[[mailto:a@b.co]]')).toEqual([{ kind: 'link', text: 'mailto:a@b.co', href: 'mailto:a@b.co' }]);
    expect(parseDocInline('')).toEqual([]);
  });
});

describe('appRouteForWebPath (notification CTAs and doc links)', () => {
  it('maps the main sections', () => {
    expect(appRouteForWebPath('/quizs')).toBe('/(tabs)');
    expect(appRouteForWebPath('/quizs?view=custom')).toBe('/launcher');
    expect(appRouteForWebPath('/analysis')).toBe('/(tabs)/analysis');
    expect(appRouteForWebPath('/wrong-questions')).toBe('/(tabs)/review');
    expect(appRouteForWebPath('/summaries')).toBe('/(tabs)/summaries');
    expect(appRouteForWebPath('/payment/callback')).toBe('/subscribe');
    expect(appRouteForWebPath('/groups')).toBe('/groups');
  });

  it('maps parameterised pages', () => {
    expect(appRouteForWebPath('/summaries/pediatrics')).toEqual({ pathname: '/summaries/[slug]', params: { slug: 'pediatrics' } });
    expect(appRouteForWebPath('/guides/smle-study-plan')).toEqual({ pathname: '/guides/[slug]', params: { slug: 'smle-study-plan' } });
    expect(appRouteForWebPath('/questions/medicine')).toEqual({ pathname: '/questions/[specialty]', params: { specialty: 'medicine' } });
    expect(appRouteForWebPath('/questions/medicine/some-q123')).toEqual({ pathname: '/questions/[specialty]/[slug]', params: { specialty: 'medicine', slug: 'some-q123' } });
    expect(appRouteForWebPath('/past-papers/smle-midgard')).toEqual({ pathname: '/past-papers/[slug]', params: { slug: 'smle-midgard' } });
    expect(appRouteForWebPath('/exams/smle/format')).toBe('/exams/smle/format');
  });

  it('strips the English prefix, queries and hashes', () => {
    expect(appRouteForWebPath('/en/analysis')).toBe('/(tabs)/analysis');
    expect(appRouteForWebPath('/en')).toBe('/(tabs)');
    expect(appRouteForWebPath('/faq#billing')).toBe('/faq');
  });

  it('returns null for anything the app does not have, instead of navigating nowhere', () => {
    expect(appRouteForWebPath(null)).toBeNull();
    expect(appRouteForWebPath('')).toBeNull();
    expect(appRouteForWebPath('/admin')).toBeNull();
    expect(appRouteForWebPath('/guides/Bad_Slug')).toBeNull();
    expect(appRouteForWebPath('/exams/a/b/c')).toBeNull();
    expect(appRouteForWebPath('https://evil.example/faq')).toBeNull();
  });
});
