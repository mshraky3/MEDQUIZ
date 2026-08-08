// Copy for the group-subscription page (/groups) and the seat-claim page.
//
// Wording rule for this whole file: never suggest the buyer can see WHO used a
// seat. They see which seat, and when. That is a promise the API enforces (see
// backend/routes/groups.js) and the copy must not contradict it.
export default {
    ar: {
        pageTitle: 'اشتراك المجموعة',
        pill: 'اشتراك جماعي',
        introTitle: 'اشتراك واحد لك ولأصدقائك',
        introBody: 'ادفع مرة واحدة، يُفعَّل حسابك مباشرة، وتحصل على روابط دعوة لبقية المقاعد توزّعها كما تشاء.',

        // ── Before purchase ──────────────────────────────────────────────
        chooseTitle: 'اختر حجم مجموعتك',
        seatsLabel: (n) => `${n} حسابات`,
        monthsLabel: (n) => (n === 4 ? 'لمدة 4 أشهر' : `لمدة ${n} أشهر`),
        perSeat: (n) => `${n} ريال للحساب الواحد`,
        priceWithCurrency: (n) => `${n} ريال`,
        previewNote: 'هكذا ستبدو مقاعدك بعد الدفع:',
        seatYouPreview: 'حسابك أنت — يُفعَّل فوراً',
        seatLinkPreview: (n) => `المقعد ${n} — رابط دعوة`,
        buyCta: (amount) => `اشترك بـ ${amount}`,
        noAutoRenew: 'دفعة واحدة فقط — لا يوجد تجديد تلقائي ولا خصم متكرر.',

        // ── After purchase ───────────────────────────────────────────────
        yourGroupTitle: 'مقاعد مجموعتك',
        endsOn: (date) => `كل المقاعد تنتهي في ${date}`,
        seatsUsed: (used, total) => `${used} من ${total} مقاعد مستخدمة`,
        seatYou: 'حسابك',
        seatNumber: (n) => `المقعد ${n}`,
        seatActive: 'مفعّل',
        seatAvailable: 'متاح',
        seatUsedOn: (date) => `استُخدم في ${date}`,
        copy: 'نسخ الرابط',
        copied: 'تم النسخ',
        shareHint: 'أرسل كل رابط لشخص واحد فقط — الرابط يُغلق بمجرد استخدامه.',
        privacyNote: 'لأسباب تتعلّق بالخصوصية لا نعرض لك بريد من استخدم الرابط، فقط أي المقاعد استُخدم ومتى.',
        expiredTitle: 'انتهى اشتراك هذه المجموعة',
        expiredBody: 'الروابط التي لم تُستخدم لم تعد صالحة. يمكنك شراء اشتراك جماعي جديد في أي وقت.',

        loading: 'جاري تحميل مقاعدك...',
        loadError: 'تعذّر تحميل بيانات مجموعتك. حدّث الصفحة وحاول مرة أخرى.',
        backToQuizzes: 'العودة إلى الاختبارات',

        // ── Seat claim (/join/:token) ────────────────────────────────────
        claim: {
            validating: 'جاري التحقق من الدعوة...',
            validTitle: 'لديك دعوة لحساب مدفوع',
            validBody: (date) => `أنشئ حسابك الآن — اشتراكك سيكون مفعّلاً حتى ${date}.`,
            invalidTitle: 'هذه الدعوة غير صالحة',
            reasons: {
                malformed: 'الرابط غير مكتمل. تأكد من نسخه كاملاً.',
                not_found: 'لم نتعرّف على هذا الرابط.',
                already_claimed: 'تم استخدام هذا الرابط لإنشاء حساب من قبل.',
                expired: 'انتهى اشتراك هذه المجموعة.',
                error: 'تعذّر التحقق من الرابط. حاول مرة أخرى.',
            },
            goHome: 'الذهاب إلى الصفحة الرئيسية',
        },
    },

    en: {
        pageTitle: 'Group subscription',
        pill: 'Group subscription',
        introTitle: 'One subscription for you and your friends',
        introBody: 'Pay once, your own account activates straight away, and you get invite links for the other seats to share however you like.',

        chooseTitle: 'Choose your group size',
        seatsLabel: (n) => `${n} accounts`,
        monthsLabel: (n) => `for ${n} months`,
        perSeat: (n) => `SAR ${n} per account`,
        priceWithCurrency: (n) => `SAR ${n}`,
        previewNote: 'This is how your seats will look after payment:',
        seatYouPreview: 'Your own account — activated instantly',
        seatLinkPreview: (n) => `Seat ${n} — invite link`,
        buyCta: (amount) => `Subscribe for ${amount}`,
        noAutoRenew: 'One payment only — no automatic renewal, no recurring charge.',

        yourGroupTitle: 'Your group seats',
        endsOn: (date) => `Every seat ends on ${date}`,
        seatsUsed: (used, total) => `${used} of ${total} seats used`,
        seatYou: 'Your account',
        seatNumber: (n) => `Seat ${n}`,
        seatActive: 'Active',
        seatAvailable: 'Available',
        seatUsedOn: (date) => `Used on ${date}`,
        copy: 'Copy link',
        copied: 'Copied',
        shareHint: 'Send each link to one person only — a link closes the moment it is used.',
        privacyNote: 'For privacy we never show you who used a link — only which seat was used, and when.',
        expiredTitle: 'This group subscription has ended',
        expiredBody: 'Any unused links have stopped working. You can buy a new group subscription any time.',

        loading: 'Loading your seats…',
        loadError: 'We could not load your group. Refresh the page and try again.',
        backToQuizzes: 'Back to quizzes',

        claim: {
            validating: 'Checking your invite…',
            validTitle: 'You have an invite to a paid account',
            validBody: (date) => `Create your account now — your subscription will be active until ${date}.`,
            invalidTitle: 'This invite is not valid',
            reasons: {
                malformed: 'The link looks incomplete. Check that you copied all of it.',
                not_found: 'We do not recognise this link.',
                already_claimed: 'This link has already been used to create an account.',
                expired: 'This group subscription has ended.',
                error: 'We could not check this link. Please try again.',
            },
            goHome: 'Go to the home page',
        },
    },
};
