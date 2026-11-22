/**
 * Which questions go into an exam sitting. Pure functions plus one async
 * orchestrator that is handed a `fetchBucket` function, so every rule here is
 * testable without a database (services/examPicker.test.js) and the SQL lives
 * in services/examService.js.
 *
 * Rules (owner decision, Nov 2026)
 *   - only questions that have an explanation (the review after the exam needs it)
 *   - no "didn't recall" option (case-insensitive, trimmed, all four options)
 *   - four distinct, non-empty options and a key that is one of them
 *   - one question per normalised text (the same recall can sit in two collections)
 *   - the order is shuffled
 *   - count capped by the usable pool, with the cap reported, never hidden
 *   - SNLE follows the 40/30/20/10 blueprint where the pool allows; a domain the
 *     pool cannot fill is reported and its share goes to the other domains
 *   - SMLE and SDLE are spread across specialties in proportion to the pool
 */

export const PLACEHOLDER_TEXT = "didn't recall";

/** Lower-case, collapse whitespace, unify apostrophes: the key for "same text" and "same option". */
export function normaliseText(value) {
    return String(value ?? '')
        .normalize('NFKC')
        .replace(/[‘’ʼ]/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

const OPTION_KEYS = ['option1', 'option2', 'option3', 'option4'];
const optionsOf = (q) => OPTION_KEYS.map((k) => q?.[k]);

export function hasPlaceholderOption(q) {
    return optionsOf(q).some((o) => normaliseText(o) === PLACEHOLDER_TEXT);
}

/** True when two options read the same (or one is empty), so the question cannot have four real choices. */
export function hasIdenticalOptions(q) {
    const opts = optionsOf(q).map(normaliseText);
    if (opts.some((o) => o === '')) return true;
    return new Set(opts).size < opts.length;
}

/**
 * May this row go into an exam? `has_explanation` is computed by the SQL (the
 * explanation text itself is never selected, so it can never leak into the
 * payload); a row without it is refused.
 */
export function isUsableQuestion(q) {
    if (!q || typeof q !== 'object') return false;
    if (normaliseText(q.question_text) === '') return false;
    if (q.has_explanation !== true) return false;
    if (hasPlaceholderOption(q)) return false;
    if (hasIdenticalOptions(q)) return false;
    const key = normaliseText(q.correct_option);
    return optionsOf(q).some((o) => normaliseText(o) === key);
}

/** Fisher-Yates; `rng` returns [0,1) (Math.random by default, a seeded one in tests). */
export function shuffle(items, rng = Math.random) {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Split `total` into integers in proportion to `weights` (largest remainder).
 * Ties go to the earlier key so the result is deterministic.
 */
export function allocateProportional(weights, total) {
    const keys = Object.keys(weights);
    const sum = keys.reduce((s, k) => s + Math.max(0, weights[k]), 0);
    const out = Object.fromEntries(keys.map((k) => [k, 0]));
    if (sum <= 0 || total <= 0) return out;
    const exact = keys.map((k) => ({ k, v: (Math.max(0, weights[k]) * total) / sum }));
    let used = 0;
    for (const e of exact) {
        out[e.k] = Math.floor(e.v);
        used += out[e.k];
    }
    const byRemainder = [...exact].sort((a, b) => (b.v - Math.floor(b.v)) - (a.v - Math.floor(a.v)));
    for (let i = 0; used < total && i < byRemainder.length; i += 1, used += 1) out[byRemainder[i].k] += 1;
    return out;
}

/**
 * Decide how many questions to ask from each bucket.
 *
 * @param {object} config  an entry of config/exams.js (or a demo cut of it)
 * @param {Record<string, number>} counts  usable questions per specialty key
 * @returns {{ requested, served, capped, buckets: [{key, specialties, wanted, target}], notes: object[] }}
 *   `notes` entries: { code: 'domain_short', domain, wanted, got } and { code: 'pool_short', requested, served }
 */
export function planQuotas(config, counts) {
    const requested = config.questions;
    const notes = [];
    const poolTotal = Object.values(counts).reduce((s, n) => s + Math.max(0, n), 0);
    const total = Math.min(requested, poolTotal);

    let buckets;
    if (config.blueprint) {
        const pool = (d) => d.specialties.reduce((s, sp) => s + Math.max(0, counts[sp] || 0), 0);
        const wantedByKey = allocateProportional(
            Object.fromEntries(config.blueprint.map((d) => [d.key, d.pct])),
            total
        );
        buckets = config.blueprint.map((d) => ({
            key: d.key,
            specialties: d.specialties,
            wanted: wantedByKey[d.key],
            capacity: pool(d),
            target: Math.min(wantedByKey[d.key], pool(d)),
        }));
        // A short domain hands its share to the domains that still have room,
        // in proportion to their weight, until everything is placed or nothing has room.
        let missing = total - buckets.reduce((s, b) => s + b.target, 0);
        while (missing > 0) {
            const open = buckets.filter((b) => b.target < b.capacity);
            if (open.length === 0) break;
            const weights = Object.fromEntries(open.map((b) => [b.key, config.blueprint.find((d) => d.key === b.key).pct]));
            const share = allocateProportional(weights, missing);
            let placed = 0;
            for (const b of open) {
                const add = Math.min(share[b.key], b.capacity - b.target);
                b.target += add;
                placed += add;
            }
            if (placed === 0) {
                // proportional rounding gave nothing to anyone with room: hand out one by one
                const b = open[0];
                b.target += 1;
                placed = 1;
            }
            missing -= placed;
        }
        for (const b of buckets) {
            if (b.target < b.wanted) notes.push({ code: 'domain_short', domain: b.key, wanted: b.wanted, got: b.target });
        }
    } else {
        const keys = Object.keys(counts).filter((k) => counts[k] > 0);
        const alloc = allocateProportional(Object.fromEntries(keys.map((k) => [k, counts[k]])), total);
        buckets = keys.map((k) => ({
            key: k,
            specialties: [k],
            wanted: alloc[k],
            capacity: counts[k],
            target: Math.min(alloc[k], counts[k]),
        }));
    }

    const served = buckets.reduce((s, b) => s + b.target, 0);
    if (served < requested) notes.push({ code: 'pool_short', requested, served });
    return {
        requested,
        served,
        capped: served < requested,
        buckets: buckets.map(({ key, specialties, wanted, target }) => ({ key, specialties, wanted, target })),
        notes,
    };
}

/**
 * Fill one bucket: ask `fetch` for candidate rows (already random-ordered and
 * SQL-filtered), drop what the rules refuse or what repeats an earlier text,
 * and ask again (excluding everything seen) until `need` is met or the source
 * runs dry. `seenText` is shared across buckets so a text can only be used once.
 */
export async function fillBucket({ fetch, specialties, need, seenText, seenIds, maxRounds = 5 }) {
    const taken = [];
    for (let round = 0; round < maxRounds && taken.length < need; round += 1) {
        const limit = Math.ceil((need - taken.length) * 1.4) + 10;
        const rows = await fetch({ specialties, limit, excludeIds: [...seenIds] });
        for (const r of rows) {
            seenIds.add(r.id);
            if (taken.length >= need) continue;
            if (!isUsableQuestion(r)) continue;
            const key = normaliseText(r.question_text);
            if (seenText.has(key)) continue;
            seenText.add(key);
            taken.push(r);
        }
        if (rows.length < limit) break; // the source is exhausted for this bucket
    }
    return taken;
}

/**
 * The orchestrator. Returns the shuffled questions plus the report the client shows.
 * `fetchBucket({ specialties, limit, excludeIds })` -> rows with has_explanation true.
 */
export async function pickExamQuestions({ config, counts, fetchBucket, rng = Math.random }) {
    const plan = planQuotas(config, counts);
    const seenText = new Set();
    const seenIds = new Set();
    const picked = [];
    const byDomain = [];

    for (const b of plan.buckets) {
        const rows = b.target > 0
            ? await fillBucket({ fetch: fetchBucket, specialties: b.specialties, need: b.target, seenText, seenIds })
            : [];
        picked.push(...rows);
        byDomain.push({ key: b.key, wanted: b.wanted, got: rows.length });
    }

    // Duplicates or refused rows can leave a bucket short even though the plan
    // said the pool was big enough: top up from the whole pool.
    const allSpecialties = [...new Set(plan.buckets.flatMap((b) => b.specialties))];
    if (picked.length < plan.served && allSpecialties.length > 0) {
        const extra = await fillBucket({
            fetch: fetchBucket,
            specialties: allSpecialties,
            need: plan.served - picked.length,
            seenText,
            seenIds,
        });
        picked.push(...extra);
    }

    const questions = shuffle(picked, rng);
    const notes = [...plan.notes];
    if (questions.length < plan.served && !notes.some((n) => n.code === 'pool_short')) {
        notes.push({ code: 'pool_short', requested: plan.requested, served: questions.length });
    }
    return {
        questions,
        requested: plan.requested,
        served: questions.length,
        capped: questions.length < plan.requested,
        byDomain,
        notes,
    };
}

/** The shape sent to the browser: no explanation, no internals. The key stays (the site scores in the browser). */
export function toExamQuestion(q) {
    return {
        id: q.id,
        question_text: q.question_text,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correct_option: q.correct_option,
        question_type: q.question_type,
        source: q.source,
        ...(q.images ? { images: q.images } : {}),
    };
}
