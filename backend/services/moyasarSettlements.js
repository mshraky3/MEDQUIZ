/**
 * Moyasar settlements (payouts to the bank), read-only.
 *
 * Amounts are in halalas. A settlement's `amount` is what Moyasar sent to the
 * bank (fees already taken); its lines name the payments it covers.
 *
 * All-or-nothing on purpose: any failed request throws, because a partial list
 * would silently understate what is in the bank.
 */

const MOYASAR_API = 'https://api.moyasar.com/v1';
const MAX_PAGES = 50;
const LINES_CONCURRENCY = 5;

async function fetchAllPages(http, secretKey, path, field) {
    const byKey = new Map();
    let page = 1;
    for (let i = 0; page && i < MAX_PAGES; i++) {
        const r = await http.get(`${MOYASAR_API}${path}`, {
            auth: { username: secretKey, password: '' },
            params: { page },
            timeout: 15000,
            validateStatus: () => true,
        });
        if (r.status !== 200 || !Array.isArray(r.data?.[field])) {
            throw new Error(`Moyasar ${field} request failed (HTTP ${r.status})`);
        }
        // Keyed so a repeated page can never double-count money.
        for (const item of r.data[field]) {
            byKey.set(item.id || `${item.payment_id}:${item.type}:${item.amount}`, item);
        }
        page = r.data.meta?.next_page || null;
    }
    if (page) throw new Error(`Moyasar ${field} list is longer than ${MAX_PAGES} pages`);
    return [...byKey.values()];
}

/**
 * @returns {Promise<Array<{id:string, createdAt:string, amountHalalas:number, paymentIds:string[]}>>}
 */
export async function fetchLiveSettlements({ secretKey = process.env.MOYASAR_SECRET_KEY, http } = {}) {
    // A test key would return test money and look just as convincing.
    if (!String(secretKey || '').startsWith('sk_live_')) {
        throw new Error('A live Moyasar secret key is not configured on this server');
    }
    const client = http || (await import('axios')).default;
    const list = await fetchAllPages(client, secretKey, '/settlements', 'settlements');

    const out = [];
    for (let i = 0; i < list.length; i += LINES_CONCURRENCY) {
        out.push(...await Promise.all(list.slice(i, i + LINES_CONCURRENCY).map(async (s) => {
            if (!Number.isInteger(s.amount) || (s.currency && s.currency !== 'SAR')) {
                throw new Error('Moyasar returned a settlement this page cannot add up');
            }
            const lines = await fetchAllPages(
                client, secretKey, `/settlements/${encodeURIComponent(s.id)}/lines`, 'lines'
            );
            return {
                id: s.id,
                createdAt: s.created_at,
                amountHalalas: s.amount,
                paymentIds: lines.map((l) => l.payment_id).filter(Boolean),
            };
        })));
    }
    return out;
}
