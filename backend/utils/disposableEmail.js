/**
 * Disposable ("throwaway") email blocking for free-tier signup.
 *
 * Every new account gets free questions, so a throwaway inbox is a free
 * identity: one person can mint accounts by the dozen. The OTP step proves the
 * inbox exists, not that it belongs to a real student, so we refuse the
 * well-known temp-mail domains before sending a code.
 *
 * This is a deny-list, so it catches the common services, not every new one.
 * Add a domain here when a new throwaway shows up in the admin Users page.
 * Matching is on the domain and any parent domain, so `x.mailinator.com` is
 * blocked by `mailinator.com`.
 */

const DISPOSABLE_DOMAINS = new Set([
    // seen in production
    'emailnox.live', 'bora4d.com',
    // big, long-lived services
    'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
    'guerrillamail.de', 'guerrillamailblock.com', 'sharklasers.com', 'grr.la', 'spam4.me', 'pokemail.net',
    '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minemail.com', '20minutemail.com',
    'temp-mail.org', 'temp-mail.io', 'temp-mail.ru', 'tempmail.com', 'tempmail.net', 'tempmail.dev',
    'tempmail.plus', 'tempmail.email', 'tempmailo.com', 'tempail.com', 'tempinbox.com', 'tempr.email',
    'throwawaymail.com', 'throwam.com', 'trashmail.com', 'trashmail.net', 'trashmail.de', 'trashmail.io',
    'trash-mail.com', 'wegwerfmail.de', 'wegwerfmail.net', 'yopmail.com', 'yopmail.net', 'yopmail.fr',
    'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc', 'dispostable.com', 'discard.email', 'discardmail.com',
    'getairmail.com', 'getnada.com', 'nada.email', 'maildrop.cc', 'mailnesia.com', 'mailcatch.com',
    'mailtemp.net', 'mail-temp.com', 'mohmal.com', 'mohmal.in', 'mohmal.tech', 'moakt.com', 'moakt.cc',
    'mintemail.com', 'mytemp.email', 'mytrashmail.com', 'fakeinbox.com', 'fakemail.net', 'fakemailgenerator.com',
    'emailondeck.com', 'emailfake.com', 'email-fake.com', 'fake-mail.net', 'generator.email', 'inboxkitten.com',
    'burnermail.io', 'anonbox.net', 'anonymbox.com', 'spamgourmet.com', 'spambox.us', 'spamex.com',
    'spamfree24.org', 'spamhereplease.com', 'tmail.ws', 'tmailor.com', 'tmpmail.net', 'tmpmail.org',
    'tmpeml.com', 'dropmail.me', 'dropmail.cc', 'emltmp.com', 'minuteinbox.com', 'luxusmail.org',
    'harakirimail.com', 'incognitomail.com', 'incognitomail.org', 'jourrapide.com', 'armyspy.com',
    'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com', 'rhyta.com', 'superrito.com',
    'teleworm.us', 'mailforspam.com', 'mailmoat.com', 'mailzilla.com', 'meltmail.com', 'mt2015.com',
    'nowmymail.com', 'objectmail.com', 'proxymail.eu', 'rcpt.at', 'safetymail.info', 'scatmail.com',
    'selfdestructingmail.com', 'sendspamhere.com', 'shortmail.net', 'sogetthis.com', 'soodonims.com',
    'spamavert.com', 'spamspot.com', 'supermailer.jp', 'techemail.com', 'thankyou2010.com',
    'throwawayemailaddress.com', 'trbvm.com', 'veryrealemail.com', 'webm4il.info', 'wh4f.org', 'xagloo.com',
    'yepmail.net', 'zetmail.com', 'zippymail.info', 'mailbox.in.ua', 'linshiyouxiang.net', 'mailpoof.com',
    'mail.tm', 'mail.gw', 'secmail.pro', '1secmail.com', '1secmail.net', '1secmail.org', 'esiix.com',
    'wwjmp.com', 'xojxe.com', 'kzccv.com', 'qiott.com', 'vjuum.com', 'laafd.com', 'txcct.com', 'icznn.com',
    'ezztt.com', 'dcctb.com', 'oosln.com', 'vddaz.com', 'yoggm.com', 'tempmailaddress.com',
    'temporary-mail.net', 'temporarymail.com', 'tempsky.com', 'tempm.com', 'emailtemporanea.net',
    'correotemporal.org', 'crazymailing.com', 'cmail.club', 'clrmail.com', 'ephemail.net', 'smailpro.com',
    'tempmail.ninja', 'tempmailer.com', 'fexpost.com', 'fexbox.org', 'fexbox.ru', 'mailmenot.io',
    'bccto.me', 'chacuo.net',
]);

/** Lower-cased domain part of an address, or '' when there is none. */
export function emailDomain(email) {
    const value = String(email || '').trim().toLowerCase();
    const at = value.lastIndexOf('@');
    return at < 0 ? '' : value.slice(at + 1);
}

/** True when the address uses a known throwaway domain (or a subdomain of one). */
export function isDisposableEmail(email) {
    const domain = emailDomain(email);
    if (!domain) return false;
    const parts = domain.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
        if (DISPOSABLE_DOMAINS.has(parts.slice(i).join('.'))) return true;
    }
    return false;
}

export const DISPOSABLE_EMAIL_MESSAGE =
    'Temporary email addresses are not accepted. Use your own email, or sign in with Google. / ' +
    'لا نقبل البريد المؤقت. استخدم بريدك الشخصي أو سجّل الدخول عبر Google.';
