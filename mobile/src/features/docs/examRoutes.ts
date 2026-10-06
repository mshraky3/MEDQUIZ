/**
 * The /exams section, resolved from the website's copy. A port of the routing
 * half of the website's seo/examGuides.js (resolveExamRoute, hubCards,
 * rootCards): the same twelve-odd pages from one data module, minus the SEO.
 */
import examGuidesCopy, {
  EXAMS_ROOT,
  EXAM_KEYS,
  EXAM_PAGES,
  SHARED_PAGES,
  SOURCES,
  examPagePath,
  examPath,
  sharedPagePath,
} from '@/i18n/copy/examGuides.js';
import type { Lang } from '@/lib/tracks';
import type { DocSection } from './RichDoc';

export type ExamPageCopy = { title: string; kicker?: string; intro?: string; sections: DocSection[]; listLabel?: string };
export type ExamCard = { path: string; title: string };
export type ResolvedExamRoute = { kind: 'root' | 'shared' | 'hub' | 'page'; exam?: string; page: ExamPageCopy; cards: ExamCard[] };

export { EXAMS_ROOT, EXAM_KEYS, EXAM_PAGES, SHARED_PAGES, examPagePath, examPath, sharedPagePath };

const copyFor = (lang: Lang) => (examGuidesCopy as any)[lang] || (examGuidesCopy as any).ar;

/**
 * The source note appended to every page, rather than written into each one:
 * twenty-six copies of a citation is twenty-six chances to let one go stale.
 */
function sourceSectionFor(lang: Lang, sourceKey: string): DocSection {
  const t = copyFor(lang);
  const src = (SOURCES as any)[sourceKey] || (SOURCES as any).shared;
  return t.sourceSection(lang === 'en' ? src.nameEn : src.nameAr, src.url, lang === 'en' ? src.retrievedEn : src.retrievedAr);
}

const withSource = (page: ExamPageCopy, lang: Lang, sourceKey: string): ExamPageCopy => ({
  ...page,
  sections: [...page.sections, sourceSectionFor(lang, sourceKey)],
});

/** The cards an exam hub links to: its four pages plus the two shared ones. */
export function hubCards(lang: Lang, exam: string): ExamCard[] {
  const t = copyFor(lang);
  const own = t.exams[exam].pages;
  return [
    ...EXAM_PAGES.map((page: string) => ({ path: examPagePath(exam, page), title: own[page].title })),
    ...SHARED_PAGES.map((page: string) => ({ path: sharedPagePath(page), title: t.shared[page].title })),
  ];
}

/** Every page on the exam section, for the root hub's card list. */
function rootCards(lang: Lang): ExamCard[] {
  const t = copyFor(lang);
  return [
    ...EXAM_KEYS.map((exam: string) => ({ path: examPath(exam), title: t.exams[exam].hub.title })),
    ...SHARED_PAGES.map((page: string) => ({ path: sharedPagePath(page), title: t.shared[page].title })),
  ];
}

/** One page's copy, ready to render. Null for a path that is not an exam route. */
export function resolveExamRoute(path: string, lang: Lang = 'ar'): ResolvedExamRoute | null {
  const t = copyFor(lang);
  if (path === EXAMS_ROOT) return { kind: 'root', page: { ...t.root }, cards: rootCards(lang) };
  const rest = path.startsWith(`${EXAMS_ROOT}/`) ? path.slice(EXAMS_ROOT.length + 1) : null;
  if (!rest) return null;

  const segments = rest.split('/');
  if (segments.length === 1) {
    const [key] = segments;
    if (SHARED_PAGES.includes(key)) return { kind: 'shared', page: withSource(t.shared[key], lang, 'shared'), cards: rootCards(lang) };
    if (EXAM_KEYS.includes(key)) return { kind: 'hub', exam: key, page: t.exams[key].hub, cards: hubCards(lang, key) };
    return null;
  }
  if (segments.length === 2) {
    const [exam, page] = segments;
    if (!EXAM_KEYS.includes(exam) || !EXAM_PAGES.includes(page)) return null;
    return { kind: 'page', exam, page: withSource(t.exams[exam].pages[page], lang, exam), cards: hubCards(lang, exam) };
  }
  return null;
}

/** Every language-neutral path in the section, in link order. */
export function examRoutePaths(): string[] {
  return [
    EXAMS_ROOT,
    ...SHARED_PAGES.map(sharedPagePath),
    ...EXAM_KEYS.flatMap((exam: string) => [examPath(exam), ...EXAM_PAGES.map((page: string) => examPagePath(exam, page))]),
  ];
}
