// Copy for /account — "my subscription" in one screen.
export default {
    ar: {
        pageTitle: 'حسابي',
        heading: 'اشتراكي',
        loading: 'جاري تحميل تفاصيل اشتراكك...',
        loadError: 'تعذّر تحميل تفاصيل اشتراكك. حدّث الصفحة وحاول مرة أخرى.',

        emailLabel: 'البريد المسجَّل',
        statusLabel: 'الحالة',
        planLabel: 'الخطة',
        startedLabel: 'تاريخ الاشتراك',
        endsLabel: 'ينتهي في',
        // Keyed by the plan id stored in the payment metadata. An id with no
        // entry here (a retired plan) falls back to planUnknown rather than
        // printing a raw id at the customer.
        planNames: {
            monthly: 'اشتراك شهري',
            four_month: 'اشتراك 4 أشهر',
            annual: 'اشتراك سنوي',
            group_3: 'اشتراك جماعي — 3 حسابات',
            group_5: 'اشتراك جماعي — 5 حسابات',
        },
        planUnknown: 'اشتراك مدفوع',
        paidAmount: (n, cur) => `دفعت ${n} ${cur === 'SAR' ? 'ريال' : cur}`,
        daysLeft: (n) => (
            n === 1 ? 'يوم واحد متبقٍ'
                : n === 2 ? 'يومان متبقيان'
                    : n <= 10 ? `${n} أيام متبقية`
                        : `${n} يوماً متبقياً`
        ),

        statusActive: 'اشتراك مفعّل',
        statusGroupSeat: 'مقعد ضمن مجموعة',
        statusFree: 'حساب مجاني',
        statusLegacy: 'وصول دائم',
        statusAdmin: 'حساب مُدار',

        freeTitle: 'أسئلتك المجانية',
        freeRemaining: (n, total) => `استخدمت ${total - n} من ${total} سؤالاً مجانياً`,
        freeSpentNote: 'أنهيت أسئلتك المجانية. حسابك وتحليلاتك وأول درس من كل تخصص تبقى مفتوحة لك — الاشتراك يفتح بقية البنك.',
        freeLeftNote: 'الاشتراك يفتح بنك الأسئلة كاملاً والملخصات بكل دروسها.',

        noAutoRenew: 'اشتراكك لا يتجدّد تلقائياً. لن نخصم أي مبلغ دون أن تشتري بنفسك.',
        legacyNote: 'حسابك يتمتع بوصول دائم دون اشتراك.',

        subscribeCta: 'عرض خطط الاشتراك',
        renewCta: 'تمديد اشتراكي',
        groupCta: 'إدارة مقاعد مجموعتي',
        groupBuyCta: 'اشتراك جماعي لك ولأصدقائك',
        backToQuizzes: 'العودة إلى الاختبارات',
    },

    en: {
        pageTitle: 'My account',
        heading: 'My subscription',
        loading: 'Loading your subscription…',
        loadError: 'We could not load your subscription. Refresh the page and try again.',

        emailLabel: 'Registered email',
        statusLabel: 'Status',
        planLabel: 'Plan',
        startedLabel: 'Purchased on',
        endsLabel: 'Ends on',
        // Keyed by the plan id stored in the payment metadata. An id with no
        // entry here (a retired plan) falls back to planUnknown rather than
        // printing a raw id at the customer.
        planNames: {
            monthly: 'Monthly subscription',
            four_month: '4-month subscription',
            annual: 'Annual subscription',
            group_3: 'Group subscription — 3 accounts',
            group_5: 'Group subscription — 5 accounts',
        },
        planUnknown: 'Paid subscription',
        paidAmount: (n, cur) => `Paid ${cur === 'SAR' ? 'SAR ' : ''}${n}${cur === 'SAR' ? '' : ' ' + cur}`,
        daysLeft: (n) => `${n} day${n === 1 ? '' : 's'} left`,

        statusActive: 'Active subscription',
        statusGroupSeat: 'Seat in a group',
        statusFree: 'Free account',
        statusLegacy: 'Permanent access',
        statusAdmin: 'Managed account',

        freeTitle: 'Your free questions',
        freeRemaining: (n, total) => `You have used ${total - n} of your ${total} free questions`,
        freeSpentNote: 'You have used your free questions. Your account, your analytics and the first lesson of every specialty stay open — a subscription opens the rest of the bank.',
        freeLeftNote: 'A subscription opens the whole question bank and every lesson in the summaries.',

        noAutoRenew: 'Your subscription does not renew automatically. Nothing will ever be charged unless you buy it yourself.',
        legacyNote: 'Your account has permanent access without a subscription.',

        subscribeCta: 'See subscription plans',
        renewCta: 'Extend my subscription',
        groupCta: 'Manage my group seats',
        groupBuyCta: 'A group subscription for you and your friends',
        backToQuizzes: 'Back to quizzes',
    },
};
