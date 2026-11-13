/**
 * Question-bank size counts, cached in process for a few minutes (optimization program, change C4).
 *
 * The bank is almost static (new collections arrive a few times a month) but three hot paths
 * re-count it from scratch on every request:
 *   - GET /api/track-content-status (every hub visit): questions per specialty and per collection
 *     (live pg_stat_statements: 2,647 + 1,876 calls, mean 33 ms and 230 ms, about 517 s of DB time);
 *   - POST /quiz-sessions (every quiz submit): "how many questions does this topic have" once per
 *     touched topic, to decide whether the student just finished it.
 * One grouped statement (about 75 rows, about 30 ms) answers all of them, so it runs at most once
 * per TTL per server instance.
 *
 * Semantics are exactly those of the queries it replaces:
 *   typeRows(track)   == SELECT question_type, COUNT(*)::int AS total FROM questions WHERE track=$1 GROUP BY question_type
 *   sourceRows(track) == SELECT s AS source, COUNT(*)::int AS total FROM questions, unnest(sources) s WHERE track=$1 GROUP BY s
 *   comboCount(t,ty,s)== SELECT COUNT(*) FROM questions WHERE track=$1 AND question_type=$2 AND $3 = ANY(sources)
 * (the last equals the unnest count because `sources` holds no duplicates: live check 11 Nov 2026,
 * 75 combinations, 0 mismatches).
 *
 * Freshness: a snapshot is reused for ttlMs (5 min, like questionsCache in app.js) and dropped by
 * invalidate(), which the admin question writes call. Other server instances learn of a change when
 * their own TTL ends. If a refresh fails, the previous snapshot (however old) is served rather than an
 * error; with no snapshot at all the error is thrown to the caller as before.
 */
export const BANK_COUNTS_TTL_MS = 5 * 60 * 1000;

export const BANK_COUNTS_SQL = `
    SELECT 'type' AS kind, track, question_type, NULL::text AS source, COUNT(*)::int AS total
      FROM questions GROUP BY track, question_type
    UNION ALL
    SELECT 'source' AS kind, track, question_type, s AS source, COUNT(*)::int AS total
      FROM questions, unnest(sources) AS s GROUP BY track, question_type, s`;

const comboKey = (track, type, source) => JSON.stringify([track, type, source]);

function buildSnapshot(rows) {
    const types = new Map();   // track -> [{question_type, total}]
    const sources = new Map(); // track -> Map(source -> total)
    const combos = new Map();  // key -> total
    for (const r of rows) {
        if (r.kind === 'type') {
            if (!types.has(r.track)) types.set(r.track, []);
            types.get(r.track).push({ question_type: r.question_type, total: Number(r.total) });
        } else {
            if (!sources.has(r.track)) sources.set(r.track, new Map());
            const m = sources.get(r.track);
            m.set(r.source, (m.get(r.source) || 0) + Number(r.total));
            combos.set(comboKey(r.track, r.question_type, r.source), Number(r.total));
        }
    }
    return { types, sources, combos };
}

/**
 * @param {{db: {query: Function}, ttlMs?: number, now?: () => number}} opts
 */
export function createBankCounts({ db, ttlMs = BANK_COUNTS_TTL_MS, now = Date.now }) {
    let snap = null;    // { types, sources, combos, at }
    let loading = null; // in-flight refresh, shared by concurrent callers
    let generation = 0; // bumped by invalidate(); a refresh that started before it is not stored

    async function snapshot() {
        if (snap && now() - snap.at < ttlMs) return snap;
        if (loading) return loading;
        const startedAt = generation;
        loading = (async () => {
            try {
                const res = await db.query(BANK_COUNTS_SQL);
                const fresh = { ...buildSnapshot(res.rows), at: now() };
                if (startedAt === generation) snap = fresh;
                return fresh;
            } catch (err) {
                if (snap) return snap; // stale beats failing; the next call retries
                throw err;
            } finally {
                if (startedAt === generation) loading = null;
            }
        })();
        return loading;
    }

    return {
        /** Same shape as the old query result: { rows: [{question_type, total}] } */
        async typeResult(track) {
            const s = await snapshot();
            return { rows: (s.types.get(track) || []).map((r) => ({ ...r })) };
        },
        /** Same shape as the old query result: { rows: [{source, total}] } */
        async sourceResult(track) {
            const s = await snapshot();
            const m = s.sources.get(track);
            return { rows: m ? [...m].map(([source, total]) => ({ source, total })) : [] };
        },
        /**
         * Questions of this track and specialty that belong to the collection; 0 when none.
         * Returns null when type or source is not a string: the caller then runs its own query.
         */
        async comboCount(track, type, source) {
            if (typeof track !== 'string' || typeof type !== 'string' || typeof source !== 'string') return null;
            const s = await snapshot();
            return s.combos.get(comboKey(track, type, source)) || 0;
        },
        /** Drop the snapshot (admin question writes). */
        invalidate() { snap = null; loading = null; generation += 1; },
    };
}
