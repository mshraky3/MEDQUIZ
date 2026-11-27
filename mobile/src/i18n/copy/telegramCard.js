// AUTO-COPIED from my-react-app/src/i18n/copy/telegramCard.js. Do not edit here:
// change the website's file, then run `npm run sync:copy` in mobile/.
/**
 * Short Telegram invitations: the home-page card, the box on public pages and
 * the card on the quiz result screen. The /telegram page has its own copy in
 * telegramHub.js.
 * Claims only what is true: every channel gets SQB practice questions as polls
 * and explained questions every day, posted automatically.
 */
const telegramCardCopy = {
    ar: {
        label: 'قناة SQB على تلجرام',
        title: 'انضم لقناة SQB على تلجرام',
        body: 'أسئلة تدريبية وأسئلة مشروحة كل يوم',
        cta: 'انضم للقناة',
        trackTitle: (exam) => `قناة SQB لاختبار ${exam} على تلجرام`,
        chooseTitle: 'قنوات SQB على تلجرام',
        chooseBody: 'اختر قناة تخصصك: أسئلة تدريبية وأسئلة مشروحة كل يوم',
        chooseLabels: { medical: 'طب', nursing: 'تمريض', dental: 'أسنان' },
        hubLink: 'كل القنوات',
        hubBoxTitle: 'لكل تخصص قناة SQB خاصة على تلجرام',
        hubBoxCta: 'اختر قناتك',
        nudgeTitle: (exam) => `تابع قناة SQB لاختبار ${exam} على تلجرام`,
        nudgeBody: 'أسئلة على شكل تصويت وأسئلة مشروحة كل يوم',
        nudgeClose: 'إغلاق',
    },
    en: {
        label: 'SQB Telegram channel',
        title: 'Join the SQB Telegram channel',
        body: 'Practice questions and explained questions every day',
        cta: 'Join the channel',
        trackTitle: (exam) => `The SQB ${exam} channel on Telegram`,
        chooseTitle: 'SQB channels on Telegram',
        chooseBody: 'Pick your field: practice questions and explained questions every day',
        chooseLabels: { medical: 'Medicine', nursing: 'Nursing', dental: 'Dentistry' },
        hubLink: 'All channels',
        hubBoxTitle: 'Each field has its own SQB channel on Telegram',
        hubBoxCta: 'Pick your channel',
        nudgeTitle: (exam) => `Follow the SQB ${exam} channel on Telegram`,
        nudgeBody: 'Poll questions and explained questions every day',
        nudgeClose: 'Close',
    },
};

export default telegramCardCopy;
