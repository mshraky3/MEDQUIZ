// AUTO-COPIED from my-react-app/src/i18n/copy/recallAnnouncement.js. Do not edit here:
// change the website's file, then run `npm run sync:copy` in mobile/.
/**
 * "New: November 2026 recall sets" — the small announcement card on the landing page.
 * Same pattern as themeAnnouncement.js.
 *
 * TO REMOVE: this file, components/landing/RecallAnnouncement.* and the one
 * <RecallAnnouncement /> line in Landing.jsx. The card also hides itself after
 * SHOW_UNTIL (RecallAnnouncement.jsx), so forgetting only leaves dead code.
 *
 * Honest wording only: these sets are compiled from candidates’ memory, have no
 * written explanations, are never described as verified or reviewed (the nursing
 * answers in particular are not), may lack a picture on some questions, and no
 * question count is used as the pitch (the live total is on the landing page).
 */
const recallAnnouncementCopy = {
    ar: {
        sectionLabel: 'إعلان: تجميعات نوفمبر 2026',
        tag: 'جديد',
        from: 'طب بشري · تمريض · أسنان',
        title: 'تجميعات نوفمبر 2026 وصلت',
        body: 'تجميعات جديدة لاختبارات SMLE وSNLE وSDLE مجمّعة من ذاكرة المتقدمين. بعض الأسئلة قد تفتقد الصورة.',
        cta: 'ابدأ بالتجميعات الجديدة',
        monthShort: 'نوفمبر',
        range: '2026',
        previewLabel: 'تجميعات نوفمبر 2026',
    },
    en: {
        sectionLabel: 'Announcement: November 2026 recall sets',
        tag: 'New',
        from: 'Medicine · Nursing · Dentistry',
        title: 'November 2026 recall sets are here',
        body: 'New recall sets for the SMLE, SNLE and SDLE, compiled from candidates’ memory. A few questions may be missing their picture.',
        cta: 'Start the new sets',
        monthShort: 'Nov',
        range: '2026',
        previewLabel: 'November 2026 recall sets',
    },
};

export default recallAnnouncementCopy;
