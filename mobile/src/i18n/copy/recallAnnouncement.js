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
 * Honest wording only: these questions have no written explanations, they are
 * described as practice questions in the current exam style (never as recalled
 * from real sittings, no sitting dates), and no question count is used as the pitch.
 */
const recallAnnouncementCopy = {
    ar: {
        sectionLabel: 'إعلان: إضافة أكتوبر 2026',
        tag: 'جديد',
        from: 'للطب البشري (SMLE)',
        title: 'إضافة أكتوبر 2026 وصلت',
        body: 'أسئلة تدريبية جديدة بنمط الاختبار الحالي، والمزيد قادم. هذه الأسئلة بدون شرح مكتوب.',
        cta: 'ابدأ بمجموعة أكتوبر',
        monthShort: 'أكتوبر',
        range: '2026',
        previewLabel: 'مجموعة أكتوبر 2026',
    },
    en: {
        sectionLabel: 'Announcement: October 2026 additions',
        tag: 'New',
        from: 'Medicine (SMLE)',
        title: 'October 2026 additions are here',
        body: 'New practice questions in the current exam style, with more to come. These questions have no written explanations.',
        cta: 'Start the October set',
        monthShort: 'Oct',
        range: '2026',
        previewLabel: 'October 2026 set',
    },
};

export default recallAnnouncementCopy;
