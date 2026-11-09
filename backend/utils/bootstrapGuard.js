/**
 * The cold-start schema guard.
 * ------------------------------------------------------------------
 * Problem (7 Nov 2026): 25 Vercel instances started in the same second. Each ran the cheap "which schema version is
 * this database at?" check; the database was out of connections (EMAXCONN, limit 200) so the check FAILED, and the
 * old code answered a failed check by running the whole list of ensure*() DDL statements, on every instance, which
 * needs even more connections. "bootstrapAll:versionCheck failed" was logged 31 times since 31 Oct.
 *
 * Rule now: the full list runs ONLY when the check succeeded and proved the database is behind this deploy's
 * SCHEMA_BOOTSTRAP_VERSION. If the check itself fails, for any reason, nothing is run: the caller throws, the
 * request is served normally, and a later request tries the check again. To keep that retry from becoming a storm,
 * an instance waits RETRY_AFTER_MS before asking again.
 *
 * Normal requests behave exactly as before: version matches -> one SELECT, no DDL; version behind -> the full list
 * once; the version row is written at the end.
 */

export const RETRY_AFTER_MS = 15_000;

/** Per-process memory of the last failed check. */
export function newGuardState() {
    return { retryAt: 0 };
}

export class VersionCheckSkipped extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'VersionCheckSkipped';
        this.cause = cause;
    }
}

/**
 * @returns {Promise<'current'|'behind'>}
 *   'current' -> version row >= required: skip all DDL.
 *   'behind'  -> the check worked and the schema is older (or the version table is missing): run the full list.
 * @throws {VersionCheckSkipped} the check could not be answered; run NOTHING, retry on a later request.
 */
export async function checkSchemaVersion(db, requiredVersion, state, now = Date.now) {
    if (state.retryAt > now()) {
        throw new VersionCheckSkipped('version check recently failed on this instance; not asking again yet');
    }
    try {
        const { rows } = await db.query(`SELECT version FROM schema_bootstrap_version ORDER BY version DESC LIMIT 1`);
        return rows[0] && rows[0].version >= requiredVersion ? 'current' : 'behind';
    } catch (err) {
        if (err?.code === '42P01') {
            // The version table does not exist yet: a brand-new database. That is an answer ("behind"), not a failure.
            await db.query(`
                CREATE TABLE IF NOT EXISTS schema_bootstrap_version (
                    version    INTEGER PRIMARY KEY,
                    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `);
            return 'behind';
        }
        state.retryAt = now() + RETRY_AFTER_MS;
        throw new VersionCheckSkipped(`version check failed: ${err?.message || err}`, err);
    }
}
