import { api, getApiSession } from './api';
import { getItem, setItem } from './storage';

/**
 * First-party funnel beacon, the app's counterpart of the website's
 * trackFunnel(): it lands in the same `funnel_events` table, so landing ->
 * signup -> paywall -> subscribe -> payment can be read across both clients.
 * The server whitelists event names, so only names it already knows are sent.
 * Best-effort and silent: telemetry must never affect what a student is doing.
 */
const ANON_ID_KEY = 'sqb_anon_id';
let anonCache: string | null = null;

async function anonId(): Promise<string> {
  if (anonCache) return anonCache;
  let id = await getItem(ANON_ID_KEY);
  if (!id) {
    id = `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}${Math.random().toString(36).slice(2, 12)}`;
    await setItem(ANON_ID_KEY, id);
  }
  anonCache = id;
  return id;
}

export type FunnelEvent =
  | 'landing_cta_signup_click'
  | 'signup_view'
  | 'signup_track_selected'
  | 'signup_otp_sent'
  | 'signup_otp_verified'
  | 'signup_otp_failed'
  | 'subscribe_view'
  | 'subscribe_prices_shown'
  | 'subscribe_plan_select'
  | 'subscribe_pay_click'
  | 'payment_success'
  | 'payment_failed';

export function trackFunnel(event: FunnelEvent, props: Record<string, unknown> = {}): void {
  void (async () => {
    try {
      const creds = getApiSession();
      await api.post(
        '/api/funnel',
        {
          anon_id: await anonId(),
          event,
          // `platform` lets a report tell app traffic from web traffic.
          props: { ...props, platform: 'app' },
          ...(creds ? { username: creds.username, sessionToken: creds.token } : {}),
        },
        { auth: false, timeoutMs: 8000 }
      );
    } catch {
      /* telemetry must never surface to the student */
    }
  })();
}

/** The price ladder shown, as one sortable string (`annual:30000,monthly:5000`), same format as the site. */
export const priceLadder = (plans: { id: string; priceHalalas: number }[] | undefined | null): string =>
  (plans || [])
    .map((p) => `${p.id}:${p.priceHalalas}`)
    .sort()
    .join(',');

