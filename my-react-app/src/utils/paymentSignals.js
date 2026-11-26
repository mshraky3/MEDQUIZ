/**
 * What can be read from the embedded Moyasar form (mpf 1.16.0) when a payment
 * does not go through. Read-only helpers for funnel logging: nothing here
 * creates, changes or blocks a payment, and nothing reads an input's value.
 *
 * Card data never leaves these functions: only the payment's `status` and
 * `source.message` are touched, and every free-text value goes through
 * scrubGatewayText first.
 *
 * No imports on purpose, so the tests run under plain `node --test`.
 */

const MAX_MESSAGE = 150;

/** Gateway text made safe to store: no links, emails, ids, tokens or long numbers. */
export function scrubGatewayText(value) {
    if (typeof value !== 'string') return null;
    const clean = value
        .slice(0, 1000)
        .replace(/https?:\/\/\S+/gi, '[url]')
        .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[email]')
        .replace(/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/gi, '[id]')
        .replace(/\b(?:token|tok|pk|sk)_\w+/gi, '[id]')
        .replace(/(?=[\w+/=-]*\d)[\w+/=-]{20,}/g, '[id]')
        // Four or more digits, also when split by spaces or punctuation (card
        // numbers, last four, expiry). Any script's digits. "M074" and
        // "HTTP 402" are three digits and stay readable.
        .replace(/\p{Nd}(?:[^\p{L}\p{Nd}]{0,3}\p{Nd}){3,}/gu, '#')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, MAX_MESSAGE);
    return clean || null;
}

/** A gateway status word ("initiated", "failed"...) or null. */
export function safeStatus(value) {
    return typeof value === 'string' && /^[a-z_]{1,24}$/i.test(value) ? value.toLowerCase() : null;
}

/** From the payment object Moyasar hands to on_completed. */
export function createdPaymentSignal(payment) {
    return {
        status: safeStatus(payment?.status),
        message: scrubGatewayText(payment?.source?.message),
    };
}

/**
 * on_failure's argument as text. Usually a string; null when the Apple Pay sheet
 * is closed; the Apple Pay merchant check can pass a Response or an Error. Other
 * objects are never serialised.
 */
export function failureMessage(error) {
    if (typeof error === 'string') return scrubGatewayText(error);
    if (typeof error?.status === 'number') return `HTTP ${error.status}`;
    return scrubGatewayText(error?.message);
}

// The autocomplete attributes mpf 1.16.0 puts on its four card inputs.
const FIELD_BY_AUTOCOMPLETE = {
    ccname: 'name',
    'cc-number': 'number',
    'cc-exp': 'expiry',
    'cc-csc': 'cvc',
};

/**
 * The form checks its fields itself before calling Moyasar, and when one fails
 * it fires no callback at all: it only marks the input and shows a fixed text.
 * Returns which fields are marked and that text, or null when none is.
 * Looks at class names, the autocomplete attribute and the alert text only.
 */
export function readInvalidFields(form) {
    if (!form?.querySelectorAll) return null;
    const fields = Array.from(form.querySelectorAll('input.mysr-form-inputError'),
        (input) => FIELD_BY_AUTOCOMPLETE[input.getAttribute('autocomplete')] || 'other');
    if (!fields.length) return null;
    const alerts = Array.from(form.querySelectorAll(
        '.mysr-form-inputAlert:not(.mysr-form-inputAlertHidden), .mysr-form-requiredAlert:not(.mysr-form-requiredAlertHidden)',
    ), (el) => (el.textContent || '').trim()).filter(Boolean);
    return {
        fields: [...new Set(fields)].join(','),
        message: scrubGatewayText([...new Set(alerts)].join('; ')),
    };
}

// Which plan the last payment attempt was for. The callback URL does not carry
// it, and 3-D Secure reloads the page, so it is kept for the tab.
const ATTEMPT_KEY = 'sqb_pay_attempt';
const ATTEMPT_TTL_MS = 60 * 60 * 1000;

export function rememberAttempt({ plan, amountHalalas }) {
    try {
        window.sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ plan, amountHalalas, ts: Date.now() }));
    } catch (_) { /* storage blocked: the callback is logged without a plan */ }
}

export function recallAttempt() {
    try {
        const saved = JSON.parse(window.sessionStorage.getItem(ATTEMPT_KEY) || 'null');
        if (!saved || Date.now() - saved.ts > ATTEMPT_TTL_MS) return {};
        return { plan: saved.plan, amountHalalas: saved.amountHalalas };
    } catch (_) {
        return {};
    }
}

/** What Moyasar put on the callback URL (?status=&message=), plus the remembered plan. */
export function callbackSignal(search) {
    try {
        const params = new URLSearchParams(search);
        return {
            status: safeStatus(params.get('status')),
            message: scrubGatewayText(params.get('message')),
            ...recallAttempt(),
        };
    } catch (_) {
        return {};
    }
}
