// AUTO-COPIED from my-react-app/src/i18n/copy/deleteAccount.js. Do not edit here:
// change the website's file, then run `npm run sync:copy` in mobile/.
/**
 * Public "delete my account" page (the URL for the Google Play Data safety form).
 * Arabic and English together. The retention promise is deliberately general
 * ("the period Saudi tax and accounting rules require"): no number is printed
 * until the owner's accountant confirms it.
 */
const SUPPORT = 'alshraky3@gmail.com';

const deleteAccountCopy = {
    ar: {
        title: 'حذف حسابك في SQB',
        intro: 'يمكنك طلب حذف حسابك وبياناتك في أي وقت من هذه الصفحة، دون الحاجة إلى تسجيل الدخول.',
        deletedHeading: 'ما الذي يُحذف',
        deleted: [
            'بريدك الإلكتروني واسم المستخدم وكلمة المرور وربط حساب جوجل.',
            'سجل إجاباتك وجلسات الاختبار وتحليل الأداء والسلسلة اليومية والأهداف والإنجازات والإشعارات وتقدم الملخصات.',
            'سجل الدخول (عنوان IP ونوع الجهاز) وقصة النجاح التي كتبتها وبلاغاتك عن الأسئلة.',
        ],
        keptHeading: 'ما الذي يبقى',
        kept: [
            'سجلات الدفع فقط (رقم العملية والمبلغ والعملة والحالة والتاريخ والباقة)، لأن أنظمة الضريبة والمحاسبة في المملكة تلزمنا بحفظها للمدة التي تحددها. تُمحى منها كل البيانات الشخصية، فلا يبقى فيها ما يدل عليك.',
            'إذا سبق أن دفعت، يبقى سجل الحساب فارغاً دون اسم أو بريد، ويُنهى الوصول إليه.',
        ],
        outsideHeading: 'نسخ خارج قاعدة بياناتنا',
        outside: 'قد تحتفظ الجهات التي تشغّل الخدمة (بوابة الدفع وخدمة البريد واستضافة الموقع) بسجلاتها الخاصة وفق سياساتها. زر الحذف هنا لا يصل إليها.',
        cannotHeading: 'متى لا يتم الحذف تلقائياً',
        cannot: 'إذا كان لديك اشتراك مدفوع ما زال ساريًا، أو كنت صاحب باقة جماعية ما زالت قائمة، فلن يتم الحذف تلقائياً ولن يُسترد أي مبلغ تلقائياً. راسلنا وتنطبق [[/refund-policy|سياسة الاسترداد]].',
        formHeading: 'اطلب الحذف الآن',
        signedIn: 'أنت مسجل الدخول بهذا البريد.',
        emailLabel: 'البريد الإلكتروني للحساب',
        sendCode: 'أرسل رمز التأكيد',
        sending: 'جاري الإرسال...',
        codeSent: 'إذا كان هناك حساب بهذا البريد فقد أرسلنا إليه رمزاً من 6 أرقام (صالح 10 دقائق). لم يصلك؟ تحقق من البريد غير الهام.',
        codeLabel: 'رمز التأكيد',
        confirmCheck: 'أفهم أن الحذف نهائي ولا يمكن التراجع عنه.',
        confirmBtn: 'احذف حسابي نهائياً',
        working: 'جاري الحذف...',
        doneDeleted: 'تم حذف حسابك وبياناتك الشخصية.',
        doneAnonymised: 'تم حذف بياناتك الشخصية وإنهاء حسابك. تبقى سجلات الدفع دون أي بيانات شخصية كما هو موضح أعلاه.',
        errEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
        errCode: 'يرجى إدخال الرمز المكون من 6 أرقام.',
        errCheck: 'يرجى تأكيد أنك تفهم أن الحذف نهائي.',
        errBadCode: 'الرمز غير صحيح أو انتهت صلاحيته.',
        errRefused: 'لا يمكن حذف هذا الحساب تلقائياً الآن لأن لديه اشتراكاً مدفوعاً أو باقة جماعية سارية. راسلنا على البريد أدناه.',
        errDisabled: 'الحذف الذاتي غير متاح حالياً. راسلنا على البريد أدناه وسنحذف حسابك يدوياً.',
        errGeneric: 'تعذر إكمال الطلب. حاول لاحقاً أو راسلنا.',
        supportHeading: 'لا تستطيع استخدام النموذج؟',
        support: `راسلنا على [[mailto:${SUPPORT}|${SUPPORT}]] من البريد المسجل في حسابك بعنوان "حذف حسابي"، وسنرد عليك.`,
    },
    en: {
        title: 'Delete your SQB account',
        intro: 'You can ask us to delete your account and data at any time from this page. You do not need to be signed in.',
        deletedHeading: 'What is deleted',
        deleted: [
            'Your e-mail, username, password and linked Google sign-in.',
            'Your answer history, quiz sessions, performance analysis, daily streak, goals, achievements, notifications and summary progress.',
            'Your sign-in history (IP address and device type), any success story you wrote, and your question reports.',
        ],
        keptHeading: 'What is kept',
        kept: [
            'Payment records only (reference, amount, currency, status, date, plan), because Saudi tax and accounting rules require us to keep them for the period they set. All personal data is removed from them, so nothing in them identifies you.',
            'If you ever paid, the account record stays as an empty shell with no name or e-mail, and access to it is ended.',
        ],
        outsideHeading: 'Copies outside our database',
        outside: 'The services that run SQB (payment gateway, e-mail service, hosting) may keep their own logs under their own policies. The button here does not reach them.',
        cannotHeading: 'When deletion is not automatic',
        cannot: 'If you have paid time still running, or you own a group plan that is still active, the account is not deleted automatically and nothing is refunded automatically. E-mail us and our [[/refund-policy|Refund Policy]] applies.',
        formHeading: 'Request deletion now',
        signedIn: 'You are signed in with this e-mail.',
        emailLabel: 'Account e-mail',
        sendCode: 'Send confirmation code',
        sending: 'Sending...',
        codeSent: 'If an account exists for this e-mail, we sent it a 6-digit code (valid 10 minutes). Nothing arrived? Check your spam folder.',
        codeLabel: 'Confirmation code',
        confirmCheck: 'I understand deletion is permanent and cannot be undone.',
        confirmBtn: 'Delete my account permanently',
        working: 'Deleting...',
        doneDeleted: 'Your account and personal data were deleted.',
        doneAnonymised: 'Your personal data was deleted and your account was closed. Payment records remain with no personal data, as described above.',
        errEmail: 'Please enter a valid e-mail address.',
        errCode: 'Please enter the 6-digit code.',
        errCheck: 'Please confirm you understand deletion is permanent.',
        errBadCode: 'The code is wrong or has expired.',
        errRefused: 'This account cannot be deleted automatically right now because it has paid time or a group plan still running. Please e-mail us at the address below.',
        errDisabled: 'Self-service deletion is not available yet. E-mail us at the address below and we will delete your account by hand.',
        errGeneric: 'Could not complete the request. Try again later or e-mail us.',
        supportHeading: 'Cannot use the form?',
        support: `E-mail [[mailto:${SUPPORT}|${SUPPORT}]] from the address on your account with the subject "Delete my account" and we will reply.`,
    },
};

export default deleteAccountCopy;
