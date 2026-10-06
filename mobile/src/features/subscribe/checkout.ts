/**
 * The pure parts of checkout: building the page Moyasar's hosted form runs in,
 * recognising the redirect it ends with, and the price display rules. Kept free
 * of React and I/O so it can be tested; the WebView and the screens only use it.
 */
import { SITE_URL } from '@/config';

// Moyasar embedded payment form (Moyasar.js). Same build the website uses.
export const MOYASAR_VERSION = '1.16.0';
export const MOYASAR_CSS = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}/moyasar.css`;
export const MOYASAR_JS = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}/moyasar.js`;

/** Where Moyasar sends the browser when a payment attempt ends (paid or not). */
export const CALLBACK_PATH = '/payment/callback';

export type Plan = {
  id: string;
  kind?: 'individual' | 'group';
  months: number;
  seats?: number;
  priceHalalas: number;
  compareAtHalalas?: number | null;
  offerId?: string | null;
};

export type PaymentConfig = {
  enabled: boolean;
  currency?: string;
  kind?: string;
  plans?: Plan[];
  offer?: { active?: boolean; id?: string } | null;
  publishableKey?: string | null;
};

/** The config is usable only when payments are on, keyed, and carry at least one plan. */
export function isCheckoutAvailable(cfg: PaymentConfig | null | undefined): boolean {
  return !!(cfg && cfg.enabled && cfg.publishableKey && cfg.plans && cfg.plans.length > 0);
}

/**
 * A plan is "on offer" only when the server sent a compare-at price that is
 * genuinely higher than what it charges. Never derived in the UI: a struck-
 * through number has to be a real former price, not decoration.
 */
export function planOffer(plan: Pick<Plan, 'priceHalalas' | 'compareAtHalalas'> | null | undefined) {
  if (!plan || !(Number(plan.compareAtHalalas) > Number(plan.priceHalalas))) return null;
  const was = Number(plan.compareAtHalalas) / 100;
  const now = plan.priceHalalas / 100;
  return { was, saved: was - now, pct: Math.round((1 - now / was) * 100) };
}

/**
 * Which plan to pre-select: an explicit ?plan= wins (the groups page picked it),
 * then the recommended tier, then whatever is first.
 */
export function choosePlan(plans: Plan[], requested: string | null | undefined, recommended: string): Plan {
  return (
    (requested ? plans.find((p) => p.id === requested) : undefined) ||
    plans.find((p) => p.id === recommended) ||
    plans[0]
  );
}

export const isTestKey = (key: string | null | undefined): boolean => String(key || '').startsWith('pk_test_');

/** JSON that is safe to embed inside an inline <script>. */
export const scriptSafeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export type CheckoutInit = {
  amount: number;
  currency: string;
  description: string;
  publishableKey: string;
  callbackUrl: string;
  accountId: number | string;
  planId: string;
  seats: number;
  lang: 'ar' | 'en';
};

/**
 * The page the WebView renders. It is the website's checkout, minus the
 * website: Moyasar's own hosted form, with the same amount, description and
 * metadata. The metadata is what the server grants months from, so amount,
 * description and metadata always move together (a full re-init per plan, never
 * a setAmount). Card data is typed into Moyasar's form and goes straight to
 * Moyasar: the app never sees it.
 *
 * Apple Pay is left out: it does not exist in Android WebViews.
 */
export function buildCheckoutHtml(init: CheckoutInit): string {
  const config = {
    element: '.mysr-form',
    amount: init.amount,
    currency: init.currency,
    description: init.description,
    publishable_api_key: init.publishableKey,
    callback_url: init.callbackUrl,
    methods: ['creditcard'],
    supported_networks: ['visa', 'mastercard', 'mada'],
    language: init.lang,
    // seats rides along so accounting can tell one payment that activated five
    // accounts from one that activated one; the server never trusts it for
    // entitlement.
    metadata: { account_id: String(init.accountId), plan: init.planId, seats: String(init.seats || 1) },
  };
  const dir = init.lang === 'ar' ? 'rtl' : 'ltr';
  return `<!doctype html>
<html lang="${init.lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="stylesheet" href="${MOYASAR_CSS}">
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; font-family: -apple-system, Roboto, 'Segoe UI', sans-serif; }
  body { padding: 4px 2px 16px; }
  .mysr-form { max-width: 520px; margin: 0 auto; }
</style>
</head>
<body>
<div class="mysr-form"></div>
<script src="${MOYASAR_JS}"></script>
<script>
  (function () {
    function post(msg) { try { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch (e) {} }
    window.addEventListener('error', function () { post({ type: 'error' }); });
    try {
      Moyasar.init(${scriptSafeJson(config)});
      // The form has its own pay button; its submit marks the attempt.
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        var form = document.querySelector('.mysr-form form');
        if (form) {
          clearInterval(timer);
          post({ type: 'ready' });
          form.addEventListener('submit', function () { post({ type: 'pay_click' }); }, { once: true });
        } else if (tries > 16) {
          clearInterval(timer);
          post({ type: 'blocked' });
        }
      }, 500);
    } catch (e) { post({ type: 'error' }); }
  })();
</script>
</body>
</html>`;
}

export type CallbackResult = { id: string | null; status: string | null; message: string | null; next: string | null };

/** True when a URL is Moyasar's redirect back to our callback. */
export function isCallbackUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const site = new URL(SITE_URL);
    // Both www and the apex host are valid names for the site.
    const bare = (host: string) => host.replace(/^www\./, '');
    const sameSite = bare(u.hostname) === bare(site.hostname);
    return sameSite && u.pathname === CALLBACK_PATH;
  } catch {
    return false;
  }
}

export function parseCallbackUrl(url: string): CallbackResult {
  const u = new URL(url);
  return {
    id: u.searchParams.get('id'),
    status: u.searchParams.get('status'),
    message: u.searchParams.get('message'),
    next: u.searchParams.get('next'),
  };
}

/**
 * Where to go after a successful payment. Only same-app absolute paths are
 * accepted, so a crafted callback URL can never point the app anywhere else.
 */
export function safeNextPath(requested: string | null | undefined): '/groups' | '/(tabs)' {
  if (!requested || !/^\/[a-z0-9/-]*$/i.test(requested)) return '/(tabs)';
  return requested.replace(/\/+$/, '') === '/groups' ? '/groups' : '/(tabs)';
}

/**
 * Only https pages (and the blank page the form starts from) may load in the
 * checkout WebView. Banks' 3-D Secure pages are https; anything else (intent://,
 * market://, file://) is refused rather than handed to Android.
 */
export function isAllowedCheckoutUrl(url: string): boolean {
  return url === 'about:blank' || /^https:\/\//i.test(url);
}

export type GroupPlan = Plan & { compareToHalalas?: number | null };

/**
 * What one person saves by joining the group instead of buying alone.
 * `compareToHalalas` is the individual plan of the SAME length, sent by the
 * server so this screen never has to pick which plan to compare against.
 * Returns null when no comparison came, or when the group plan is not actually
 * cheaper per seat: the card then says nothing rather than inventing a saving.
 */
export function savingsFor(plan: Pick<GroupPlan, 'compareToHalalas' | 'seats' | 'priceHalalas'> | null | undefined) {
  const solo = Number(plan?.compareToHalalas);
  const seats = Number(plan?.seats);
  const total = Number(plan?.priceHalalas);
  if (!solo || !seats || !total) return null;
  const perSeat = total / seats;
  if (perSeat >= solo) return null;
  return { perSeat: Math.round(perSeat / 100), solo: Math.round(solo / 100), percent: Math.round((1 - perSeat / solo) * 100) };
}
