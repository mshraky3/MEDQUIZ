/**
 * The exam section's URL structure, with no prose attached.
 *
 * Split out of i18n/copy/examGuides.js so main.jsx (which needs the list of
 * routes at start-up) does not pull that file's ~115 KB of Arabic and English
 * copy into the entry chunk. i18n/copy/examGuides.js re-exports everything
 * here, so other imports are unchanged. seo/examGuides.js keeps its own
 * examRoutePaths(); examPaths.test.js fails if the two ever differ.
 */
export const EXAMS_ROOT = '/exams';

/** The two shared pages, and the four each exam owns. */
export const SHARED_PAGES = ['format', 'test-day'];
export const EXAM_PAGES = ['blueprint', 'passing-score', 'eligibility', 'attempts'];
export const EXAM_KEYS = ['smle', 'snle'];

export const examPath = (exam) => `${EXAMS_ROOT}/${exam}`;
export const examPagePath = (exam, page) => `${EXAMS_ROOT}/${exam}/${page}`;
export const sharedPagePath = (page) => `${EXAMS_ROOT}/${page}`;

/** Every language-neutral path in the section, in link order. */
export function examRoutePaths() {
    return [
        EXAMS_ROOT,
        ...SHARED_PAGES.map(sharedPagePath),
        ...EXAM_KEYS.flatMap((exam) => [
            examPath(exam),
            ...EXAM_PAGES.map((page) => examPagePath(exam, page)),
        ]),
    ];
}