/**
 * Best-effort "this question was answered" reporter.
 *
 * Queues question ids and sends them to POST /api/questions/seen in one call:
 * after ~1 s of quiet, and immediately when the page is hidden or closed (with
 * fetch keepalive so the browser finishes it). Failures are ignored on purpose;
 * the final quiz submit still records everything. Ids are only ever sent once
 * per queue instance.
 */
export const SEEN_MAX_IDS = 20;
export const SEEN_DELAY_MS = 1000;

export function createSeenQueue({ send, delay = SEEN_DELAY_MS, setTimer = setTimeout, clearTimer = clearTimeout }) {
  const sent = new Set();
  let pending = [];
  let timer = null;

  const flush = () => {
    if (timer) { clearTimer(timer); timer = null; }
    while (pending.length > 0) {
      const batch = pending.splice(0, SEEN_MAX_IDS);
      try {
        const p = send(batch);
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch { /* best effort */ }
    }
  };

  return {
    add(id) {
      if (!Number.isInteger(id) || id <= 0 || sent.has(id)) return;
      sent.add(id);
      pending.push(id);
      if (!timer) timer = setTimer(flush, delay);
    },
    flush,
  };
}

/** fetch with keepalive, same auth as apiClient (Bearer token + username). */
export function sendSeenBeacon(baseUrl, ids) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('sessionToken') || user.sessionToken;
    if (!user.username || !token || typeof fetch !== 'function') return Promise.resolve();
    return fetch(`${baseUrl}/api/questions/seen`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question_ids: ids, username: user.username }),
    }).catch(() => {});
  } catch {
    return Promise.resolve();
  }
}
