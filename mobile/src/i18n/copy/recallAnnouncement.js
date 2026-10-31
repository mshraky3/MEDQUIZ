// AUTO-COPIED from my-react-app/src/i18n/copy/recallAnnouncement.js. Do not edit here:
// change the website's file, then run `npm run sync:copy` in mobile/.
/**
 * "New: October 2026 recalls" — the small announcement card on the landing page.
 * Same pattern as themeAnnouncement.js.
 *
 * TO REMOVE: this file, components/landing/RecallAnnouncement.* and the one
 * <RecallAnnouncement /> line in Landing.jsx. The card also hides itself after
 * SHOW_UNTIL (RecallAnnouncement.jsx), so forgetting only leaves dead code.
 *
 * Honest wording only: recall questions have no written explanations, the set
 * covers 1-22 October so far, and no question count is used as the pitch.
 */
const recallAnnouncementCopy = {
    ar: {
        sectionLabel: 'إعلان: تجميعة أكتوبر 2026',
        tag: 'جديد',
        from: 'للطب البشري (SMLE)',
        title: 'تجميعة أكتوبر 2026 وصلت',
        body: 'أسئلة تذكّرها المختبرون في جلسات SMLE من ١ إلى ٢٢ أكتوبر، والمزيد قادم. أسئلة التجميعات بدون شرح مكتوب.',
        cta: 'ابدأ بتجميعة أكتوبر',
        monthShort: 'أكتوبر',
        range: '١–٢٢',
        previewLabel: 'أسئلة أكتوبر من ١ إلى ٢٢',
    },
    en: {
        sectionLabel: 'Announcement: October 2026 recalls',
        tag: 'New',
        from: 'Medicine (SMLE)',
        title: 'October 2026 recalls are here',
        body: 'Questions examinees recalled from the SMLE sittings of 1–22 October, with more to come. Recall questions have no written explanations.',
        cta: 'Start the October recalls',
        monthShort: 'Oct',
        range: '1–22',
        previewLabel: 'October questions, 1 to 22',
    },
};

export default recallAnnouncementCopy;
