/**
 * Self-service account deletion (Google Play requirement).
 *
 * One function, written against any pg-style client so the tests can drive it
 * with a fake. It does NOT commit: the caller owns BEGIN/COMMIT/ROLLBACK (same
 * pattern as DELETE /users/:userId).
 *
 *   never paid -> the account row and every personal row are DELETED.
 *   ever paid  -> the account row stays as an anonymised shell (no name, no
 *                 e-mail, no password, no Google id, access ended) so payment
 *                 rows, reports and money numbers keep working; everything else
 *                 personal is deleted; payment_events keeps its money columns
 *                 and its raw_payload is cut down to a whitelist.
 *   refused    -> paid time still running, or owner of a group whose seats other
 *                 people use / whose paid term runs on. Nothing is changed; the
 *                 person is told to write to support (the refund policy applies).
 *                 Nothing here ever refunds.
 *
 * Optional tables are touched inside a SAVEPOINT and a missing table/column
 * (42P01 / 42703) is skipped, because several tables are created outside the
 * repo or only by cold-start bootstrap. Any other error propagates so the caller
 * rolls everything back.
 *
 * No DDL here (never ALTER in a request path) and no new table is needed.
 */
import crypto from 'crypto';

export const DELETION_OUTCOME = Object.freeze({
    DELETED: 'deleted',
    ANONYMISED: 'anonymised',
    REFUSED: 'refused',
    NOT_FOUND: 'not_found',
});

// Personal rows keyed by an account id column. Each is its own savepoint.
const PERSONAL_TABLES = [
    ['user_question_attempts', 'user_id'],
    ['user_quiz_sessions', 'user_id'],
    ['user_topic_analysis', 'user_id'],
    ['user_streaks', 'user_id'],
    ['user_analysis', 'user_id'],
    ['final_quiz_attempts', 'user_id'],
    ['final_review_sessions', 'user_id'],
    ['user_question_progress', 'user_id'],
    ['user_achievements', 'user_id'],
    ['user_goals', 'user_id'],
    ['user_notifications', 'user_id'],
    ['summary_progress', 'user_id'],
    ['login_history', 'user_id'],
    ['temp_link_accounts', 'user_id'],
    ['success_stories', 'user_id'],
    ['question_reports', 'user_id'],
];

/**
 * Keeps only non-personal payment facts. Everything else in the Moyasar payload
 * (payer name, e-mail, card holder, card digits, IP, free-form metadata,
 * description, callback URLs) is dropped. Kept: the keys accountingService and
 * paymentService read (id, status, amount, currency, created_at, fee, refunded,
 * source.type/company, metadata.plan/seats/account_id).
 */
export const scrubPaymentPayloadSql = `
    UPDATE payment_events
       SET raw_payload = jsonb_strip_nulls(jsonb_build_object(
             'id',         raw_payload->'id',
             'status',     raw_payload->'status',
             'amount',     raw_payload->'amount',
             'currency',   raw_payload->'currency',
             'created_at', raw_payload->'created_at',
             'fee',        raw_payload->'fee',
             'refunded',   raw_payload->'refunded',
             'source',     jsonb_build_object('type', raw_payload#>'{source,type}', 'company', raw_payload#>'{source,company}'),
             'metadata',   jsonb_build_object('plan', raw_payload#>'{metadata,plan}', 'seats', raw_payload#>'{metadata,seats}', 'account_id', raw_payload#>'{metadata,account_id}')
           ))
     WHERE account_id = $1 AND raw_payload IS NOT NULL`;

const MISSING = new Set(['42P01', '42703']); // undefined_table, undefined_column

async function optional(client, name, sql, params) {
    await client.query(`SAVEPOINT ${name}`);
    try {
        const r = await client.query(sql, params);
        await client.query(`RELEASE SAVEPOINT ${name}`);
        return r;
    } catch (err) {
        await client.query(`ROLLBACK TO SAVEPOINT ${name}`);
        await client.query(`RELEASE SAVEPOINT ${name}`);
        if (MISSING.has(err?.code)) return null;
        throw err;
    }
}

/**
 * @param {{query: Function}} client  a client inside an open transaction
 * @param {number|string} accountId
 * @returns {Promise<{outcome: string, reason?: string, email?: string|null}>}
 */
export async function deleteAccountData(client, accountId) {
    const acc = await client.query(
        `SELECT id, email, username, subscription_expiry_date FROM accounts WHERE id = $1 FOR UPDATE`,
        [accountId]
    );
    if (acc.rows.length === 0) return { outcome: DELETION_OUTCOME.NOT_FOUND };
    const account = acc.rows[0];

    const paid = await client.query(
        `SELECT 1 FROM payment_events WHERE account_id = $1 AND status = 'paid' LIMIT 1`,
        [accountId]
    );
    const everPaid = paid.rows.length > 0;

    // Refusal 1: paid time is still running (we never refund automatically).
    if (everPaid && account.subscription_expiry_date
        && new Date(account.subscription_expiry_date).getTime() > Date.now()) {
        return { outcome: DELETION_OUTCOME.REFUSED, reason: 'paid_time_left' };
    }
    // Refusal 2: owner of a group other people sit in, or whose term runs on.
    const group = await optional(client, 'sp_group',
        `SELECT 1 FROM subscription_groups g
          WHERE g.owner_account_id = $1
            AND (g.expires_at > NOW()
                 OR EXISTS (SELECT 1 FROM group_seats s
                             WHERE s.group_id = g.id
                               AND s.claimed_by_account_id IS NOT NULL
                               AND s.claimed_by_account_id <> $1))
          LIMIT 1`,
        [accountId]);
    if (group && group.rows.length > 0) {
        return { outcome: DELETION_OUTCOME.REFUSED, reason: 'group_owner' };
    }

    // Seats this person claimed in someone else's group: free the seat.
    await optional(client, 'sp_seats',
        `UPDATE group_seats SET claimed_by_account_id = NULL, claimed_at = NULL WHERE claimed_by_account_id = $1`,
        [accountId]);

    for (const [i, [table, col]] of PERSONAL_TABLES.entries()) {
        await optional(client, `sp_t${i}`, `DELETE FROM ${table} WHERE ${col} = $1`, [accountId]);
    }

    // Rows that hold the e-mail without a foreign key.
    if (account.email) {
        const mail = String(account.email).toLowerCase();
        await optional(client, 'sp_otp', `DELETE FROM signup_otps WHERE email = $1`, [mail]);
        await optional(client, 'sp_mail', `UPDATE question_reports SET user_email = 'deleted' WHERE lower(user_email) = $1`, [mail]);
    }
    await optional(client, 'sp_bcast', `DELETE FROM broadcast_recipients WHERE account_id = $1`, [accountId]);
    await optional(client, 'sp_funnel', `UPDATE funnel_events SET account_id = NULL, props = '{}'::jsonb WHERE account_id = $1`, [accountId]);

    if (!everPaid) {
        await client.query(`DELETE FROM accounts WHERE id = $1`, [accountId]);
        return { outcome: DELETION_OUTCOME.DELETED, email: account.email || null };
    }

    // Paid at some point: keep the shell, scrub the money payloads.
    await client.query(scrubPaymentPayloadSql, [accountId]);
    await client.query(
        `UPDATE accounts
            SET username = $2, email = $3, password = $4, google_id = NULL,
                session_token = NULL, logged = FALSE, isactive = FALSE
          WHERE id = $1`,
        [accountId, `deleted-${accountId}`, `deleted-${accountId}@deleted.invalid`, crypto.randomBytes(24).toString('hex')]
    );
    await optional(client, 'sp_optout', `UPDATE accounts SET email_opt_out = TRUE WHERE id = $1`, [accountId]);
    return { outcome: DELETION_OUTCOME.ANONYMISED, email: account.email || null };
}
