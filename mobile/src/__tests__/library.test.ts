import { describe, expect, it } from 'vitest';
import payload from '@/features/library/data/publicQuestions.json';
import stories from '@/features/library/data/successStories.json';
import { HONESTY_NOTE_AR, HONESTY_NOTE_EN, buildCollections } from '@/features/library/seo/pastPapers.js';
import { buildQuestionIndex, relatedQuestions, specialtySlug, stemBody } from '@/features/library/seo/publicQuestions.js';
import { storiesFrom } from '@/features/library/seo/successStories.js';
import { EXAMS_ROOT, EXAM_KEYS, EXAM_PAGES, SHARED_PAGES, examRoutePaths, resolveExamRoute } from '@/features/docs/examRoutes';
import { appRouteForWebPath } from '@/lib/webPaths';
import { GUIDE_KEYS } from '@/features/docs/guideKeys';
import guidesCopy from '@/i18n/copy/guides.js';

const index = buildQuestionIndex(payload);

describe('free question library', () => {
  it('indexes every published question exactly once, per track and specialty', () => {
    expect(index.total).toBe((payload as any).questions.length);
    const inSpecialties = index.specialties.reduce((n: number, s: any) => n + s.questions.length, 0);
    expect(inSpecialties).toBe(index.total);
    const inTracks = index.tracks.reduce((n: number, t: any) => n + t.specialties.reduce((m: number, s: any) => m + s.questions.length, 0), 0);
    expect(inTracks).toBe(index.total);
    expect(index.byQuestionSlug.size).toBe(index.total);
  });

  it('every question can be shown: stem, 2+ options, a valid correct option and an explanation', () => {
    for (const question of index.questions) {
      expect(question.stem?.trim(), question.slug).toBeTruthy();
      expect(question.options.length, question.slug).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex, question.slug).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex, question.slug).toBeLessThan(question.options.length);
      expect(question.explanation?.trim(), question.slug).toBeTruthy();
    }
  });

  it('slugs are URL-safe and map back to the question, and the route regexes accept them', () => {
    for (const s of index.specialties) {
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
      expect(index.bySpecialtySlug.get(s.slug)).toBe(s);
      expect(appRouteForWebPath(`/questions/${s.slug}`)).toEqual({ pathname: '/questions/[specialty]', params: { specialty: s.slug } });
    }
    for (const question of index.questions) {
      expect(question.slug, question.slug).toMatch(/^[a-z0-9-]+$/);
      expect(specialtySlug(question.specialty)).toMatch(/^[a-z0-9-]+$/);
    }
    expect(specialtySlug('obstetrics and gynecology')).toBe('obstetrics-and-gynecology');
  });

  it('never repeats the headline sentence in the body, and never loses the stem', () => {
    for (const question of index.questions) {
      const body = stemBody(question);
      expect(body.length).toBeGreaterThan(0);
      if (!question.headline.endsWith('…') && question.stem.startsWith(question.headline) && question.stem.length > question.headline.length) {
        expect(body.startsWith(question.headline)).toBe(false);
      }
    }
  });

  it('related questions stay in the specialty, exclude the question itself and wrap around', () => {
    const last = index.questions[index.questions.length - 1];
    const group = index.bySpecialtySlug.get(specialtySlug(last.specialty));
    const related = relatedQuestions(index, last);
    expect(related.length).toBe(Math.min(6, group.questions.length - 1));
    expect(related.every((r: any) => r.specialty === last.specialty && r.slug !== last.slug)).toBe(true);
  });
});

describe('past-paper collections', () => {
  const data = buildCollections(payload);

  it('only lists collections the bank really has, with their true totals', () => {
    expect(data.collections.length).toBeGreaterThan(0);
    for (const c of data.collections) {
      expect(c.total, c.slug).toBeGreaterThan(0);
      expect(data.bySlug.get(c.slug)).toBe(c);
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect(c.samples.every((q: any) => q.source === c.source)).toBe(true);
      expect(c.specialties.reduce((n: number, s: any) => n + s.count, 0)).toBe(c.samples.length);
    }
    expect(data.tracks.flatMap((t: any) => t.collections)).toHaveLength(data.collections.length);
  });

  it('states that these are not official papers, in both languages', () => {
    expect(HONESTY_NOTE_EN).toMatch(/not affiliated/i);
    expect(HONESTY_NOTE_EN).toMatch(/Prometric/);
    expect(HONESTY_NOTE_AR).toMatch(/Prometric/);
    expect(HONESTY_NOTE_AR).toMatch(/غير تابعة/);
  });
});

describe('success stories', () => {
  it('shows only stories that carry a name and a quote (nothing invented)', () => {
    const list = storiesFrom(stories);
    expect(list.every((s: any) => s.name && s.quote)).toBe(true);
    expect(storiesFrom(null)).toEqual([]);
    expect(storiesFrom({ stories: [{ id: 1, name: 'x' }, { id: 2, name: 'y', quote: 'q' }] })).toHaveLength(1);
  });
});

describe('exam guides', () => {
  it('resolves every route in the section, in both languages', () => {
    const paths = examRoutePaths();
    expect(paths.length).toBeGreaterThan(5);
    for (const lang of ['ar', 'en'] as const) {
      for (const path of paths) {
        const resolved = resolveExamRoute(path, lang);
        expect(resolved, `${lang} ${path}`).not.toBeNull();
        expect(resolved!.page.title, `${lang} ${path}`).toBeTruthy();
        expect(resolved!.page.sections.length, `${lang} ${path}`).toBeGreaterThan(0);
        for (const card of resolved!.cards) expect(paths, `${lang} card ${card.path}`).toContain(card.path);
      }
    }
  });

  it('every exam page carries a source note and routes are reachable from the app mapper', () => {
    for (const exam of EXAM_KEYS) for (const page of EXAM_PAGES) {
      const resolved = resolveExamRoute(`${EXAMS_ROOT}/${exam}/${page}`, 'en')!;
      const last = resolved.page.sections[resolved.page.sections.length - 1];
      expect(JSON.stringify(last), `${exam}/${page}`).toMatch(/https?:\/\//);
    }
    for (const path of examRoutePaths()) expect(appRouteForWebPath(path), path).not.toBeNull();
    for (const shared of SHARED_PAGES) expect(appRouteForWebPath(`${EXAMS_ROOT}/${shared}`)).not.toBeNull();
  });

  it('rejects paths outside the section', () => {
    expect(resolveExamRoute('/exams/nope', 'en')).toBeNull();
    expect(resolveExamRoute('/exams/smle/nope', 'en')).toBeNull();
    expect(resolveExamRoute('/elsewhere', 'en')).toBeNull();
  });
});

describe('study guides', () => {
  it('every card on the hub opens something that exists, in both languages', () => {
    for (const lang of ['ar', 'en'] as const) {
      const copy = (guidesCopy as any)[lang];
      for (const card of copy.hub.cards) {
        const target = appRouteForWebPath(card.path) as any;
        expect(target, `${lang} ${card.path}`).not.toBeNull();
        if (card.path.startsWith('/exams')) {
          expect(resolveExamRoute(card.path, lang), card.path).not.toBeNull();
        } else {
          const slug = target.params.slug;
          expect(GUIDE_KEYS[slug], slug).toBeTruthy();
          expect(copy[GUIDE_KEYS[slug]].sections.length, slug).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every guide article is reachable from the hub', () => {
    const linked = (guidesCopy as any).en.hub.cards.map((c: any) => c.path.replace('/guides/', ''));
    for (const slug of Object.keys(GUIDE_KEYS)) expect(linked, slug).toContain(slug);
  });
});
