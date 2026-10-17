/**
 * "Dark mode is here" — the small announcement card on the landing page.
 *
 * TO REMOVE: this file, components/landing/ThemeAnnouncement.* and the one
 * <ThemeAnnouncement /> line in Landing.jsx. Nothing else depends on them.
 * The card also hides itself after SHOW_UNTIL (ThemeAnnouncement.jsx), so
 * forgetting to remove it only leaves dead code, never a stale banner.
 */
const themeAnnouncementCopy = {
    ar: {
        sectionLabel: 'إعلان: الوضع الليلي',
        tag: 'جديد',
        from: 'من اقتراحاتكم',
        title: 'الوضع الليلي وصل',
        body: 'ذاكر براحة في الليل: كل صفحات SQB الآن بمظهر داكن، بنفس الوضوح وبألوان أريح للعين. اختيارك يُحفظ على جهازك.',
        tryDark: 'جرّب الوضع الليلي',
        backToLight: 'العودة للوضع النهاري',
        hint: 'غيّره متى شئت من الزر أعلى الصفحة، أو اختر «حسب الجهاز» من صفحة حسابي.',
        previewLabel: 'معاينة الصفحة بالوضعين النهاري والليلي',
    },
    en: {
        sectionLabel: 'Announcement: dark mode',
        tag: 'New',
        from: 'You asked for it',
        title: 'Dark mode is here',
        body: 'Study comfortably at night: every SQB page now comes in a dark look, just as clear and easier on the eyes. Your choice is saved on your device.',
        tryDark: 'Try dark mode',
        backToLight: 'Back to light mode',
        hint: 'Switch any time with the button at the top of the page, or pick "Follow device" on your account page.',
        previewLabel: 'Preview of a page in light and dark mode',
    },
};

export default themeAnnouncementCopy;
