/**
 * Copy for /telegram, the one page that lists every SQB channel. Read by
 * components/telegram/TelegramHub.jsx and by the prerender (seo/telegramHub.js).
 * Say only what is true: every channel gets SQB practice questions as polls and
 * explained questions every day, posted automatically. Review files have no
 * promised schedule. No subscriber or question counts.
 */
const telegramHubCopy = {
    ar: {
        meta: {
            title: 'قنوات SQB على تلجرام: SMLE وSNLE وSDLE',
            description: 'قنوات SQB على تلجرام لاختبار SMLE للطب وSNLE للتمريض وSDLE لطب الأسنان. أسئلة تدريبية على شكل تصويت وأسئلة مشروحة كل يوم.',
            keywords: 'قناة تلجرام SMLE, قناة تلجرام SNLE, قناة تلجرام SDLE, SQB تلجرام',
        },
        home: 'الرئيسية',
        kicker: 'SQB على تلجرام',
        title: 'قنوات SQB على تلجرام',
        intro: 'لكل تخصص قناة خاصة. اختر قناة تخصصك وانضم إليها.',
        listLabel: 'قنوات التخصصات',
        fields: { medical: 'الطب البشري', nursing: 'التمريض', dental: 'طب الأسنان' },
        join: (exam) => `انضم لقناة ${exam}`,
        yourTrack: 'قناة تخصصك',
        pointsTitle: 'ماذا تجد في كل قناة؟',
        points: [
            'أسئلة تدريبية من SQB على شكل تصويت، تُنشر تلقائياً كل يوم',
            'أسئلة مشروحة كل يوم',
            'ملفات مراجعة',
        ],
        note: 'SQB منصة مستقلة، وليست تابعة للهيئة السعودية للتخصصات الصحية ولا لشركة Prometric.',
    },
    en: {
        meta: {
            title: 'SQB Telegram channels: SMLE, SNLE and SDLE',
            description: 'SQB channels on Telegram for the SMLE (medicine), SNLE (nursing) and SDLE (dentistry): poll practice questions and explained questions every day.',
            keywords: 'SMLE Telegram channel, SNLE Telegram channel, SDLE Telegram channel, SQB Telegram',
        },
        home: 'Home',
        kicker: 'SQB on Telegram',
        title: 'SQB channels on Telegram',
        intro: 'Each field has its own channel. Pick yours and join it.',
        listLabel: 'Channels by field',
        fields: { medical: 'Medicine', nursing: 'Nursing', dental: 'Dentistry' },
        join: (exam) => `Join the ${exam} channel`,
        yourTrack: 'Your channel',
        pointsTitle: 'What is in each channel?',
        points: [
            'SQB practice questions as polls, posted automatically every day',
            'Explained questions every day',
            'Review files',
        ],
        note: 'SQB is an independent platform. It is not affiliated with the Saudi Commission for Health Specialties or with Prometric.',
    },
};

export default telegramHubCopy;
