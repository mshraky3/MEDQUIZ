// Saves the answers of one finished quiz. ONE request (POST /question-attempts/batch);
// the old behaviour of one request per answer, all at once, exhausted the database
// connection limit on a 150-question quiz (7 Nov 2026). If the batch cannot be saved,
// fall back to the old per-answer route, at most CONCURRENCY at a time.

export const FALLBACK_CONCURRENCY = 5;
const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Worth retrying: no HTTP answer at all (network), 5xx, or the pooler's EMAXCONN text.
export const isRetryable = (err) => {
  const status = err?.response?.status ?? err?.status;
  if (status && status >= 400 && status < 500) return false;
  return true;
};

async function withBackoff(task, tries, sleep) {
  let last;
  for (let i = 0; i < tries; i += 1) {
    try {
      return await task();
    } catch (err) {
      last = err;
      if (!isRetryable(err) || i === tries - 1) break;
      await sleep(400 * 2 ** i);
    }
  }
  throw last;
}

/**
 * @param {(url:string, body:object)=>Promise} post  e.g. apiClient.post
 * @param {Array} attempts  bodies of the old POST /question-attempts (same fields)
 * @returns {Promise<{failures:number, usedFallback:boolean}>}
 */
export async function saveAttempts(post, attempts, { sessionId, userId, sleep = defaultSleep, concurrency = FALLBACK_CONCURRENCY } = {}) {
  if (!attempts.length) return { failures: 0, usedFallback: false };
  try {
    await withBackoff(
      () => post('/question-attempts/batch', {
        user_id: userId,
        quiz_session_id: sessionId,
        attempts: attempts.map(({ question_id, selected_option, is_correct, time_taken }) => ({ question_id, selected_option, is_correct, time_taken })),
      }),
      3,
      sleep
    );
    return { failures: 0, usedFallback: false };
  } catch {
    // fall through to the per-answer route
  }
  let next = 0;
  let failures = 0;
  const worker = async () => {
    while (next < attempts.length) {
      const body = attempts[next++];
      try {
        await withBackoff(() => post('/question-attempts', body), 3, sleep);
      } catch {
        failures += 1;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, attempts.length) }, worker));
  return { failures, usedFallback: true };
}
