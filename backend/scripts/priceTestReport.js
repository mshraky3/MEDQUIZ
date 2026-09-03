/**
 * What each price ladder actually earned.
 *
 * The backlog item this exists for (S5-01, "re-test the annual anchor") is
 * blocked on customers, not on code — but the measurement had to be built
 * before the test runs, not after, because the losing half of a price test is
 * invisible in the database. A payment records what someone paid. Nothing
 * recorded what the people who did not pay had been quoted: prices come from
 * environment variables, and changing one leaves no trace of the old value or
 * of the date it changed. `subscribe_prices_shown` is that missing record, and
 * this script is its reader.
 *
 * WHAT IT DOES
 *   Groups everyone who was shown prices by the ladder they saw, follows each
 *   group through plan-select → pay-click → payment, and prints conversion and
 *   revenue per thousand exposures for each. Money comes from payment_events,
 *   not from the browser beacon, which adblock can drop.
 *
 * WHAT IT REFUSES TO DO
 *   Declare a winner on too little data. The gate is --min-buyers (default 30,
 *   the number the backlog names) across all arms, and even above it the z-test
 *   is reported as a description, not a licence. Four sales against three is
 *   not a pricing signal, however the percentages land.
 *
 * READ-ONLY. It creates nothing, updates nothing, and sends nothing.
 *
 * Usage (from backend/, reads .env like app.js):
 *   node scripts/priceTestReport.js                 # last 90 days
 *   node scripts/priceTestReport.js --days 30
 *   node scripts/priceTestReport.js --since 2026-09-01
 *   node scripts/priceTestReport.js --csv exposures.csv
 *
 * Flags: --days N, --since YYYY-MM-DD, --min-buyers N, --csv FILE
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const numArg = (name, fallback) => {
    const i = process.argv.indexOf(name);
    if (i === -1) return fallback;
    const value = Number(process.argv[i + 1]);
    return Number.isFinite(value) ? value : fallback;
};
const strArg = (name, fallback = null) => {
    const i = process.argv.indexOf(name);
    return i === -1 ? fallback : (process.argv[i + 1] || fallback);
};

const DAYS = numArg('--days', 90);
// Interpolated into SQL below (a date literal can't be a bind parameter inside
// an interval expression), so it is checked here rather than trusted.
const SINCE = (() => {
    const raw = strArg('--since');
    if (raw == null) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        console.error(`--since must be YYYY-MM-DD, got "${raw}"`);
        process.exit(1);
    }
    return raw;
})();
const MIN_BUYERS = numArg('--min-buyers', 30);
const CSV_PATH = strArg('--csv');

// ── formatting ───────────────────────────────────────────────────────────
export const sar = (halalas) => (Number(halalas || 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0, maximumFractionDigits: 2,
});
export const pct = (n, d) => (d > 0 ? `${((n / d) * 100).toFixed(1)}%` : '—');

/** `annual:30000,monthly:5000` → `annual 300 · monthly 50 SAR`. */
export const readableLadder = (ladder) => (!ladder ? '(none recorded)' : ladder
    .split(',')
    .map((pair) => {
        const [id, halalas] = pair.split(':');
        return `${id} ${sar(halalas)}`;
    })
    .join(' · '));

/**
 * Two-sided p-value for a difference of two proportions, normal approximation.
 * Deliberately the crudest defensible test: anything more elaborate would
 * dress up sample sizes that cannot support the conclusion either way.
 */
export function twoProportionP(x1, n1, x2, n2) {
    if (!n1 || !n2) return null;
    const p1 = x1 / n1, p2 = x2 / n2;
    const pooled = (x1 + x2) / (n1 + n2);
    const se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
    if (!se) return null;
    const z = Math.abs(p1 - p2) / se;
    // Abramowitz & Stegun 7.1.26 for erf, good to ~1e-7.
    const t = 1 / (1 + 0.3275911 * (z / Math.SQRT2));
    const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t
        - 0.284496736) * t + 0.254829592) * t * Math.exp(-((z / Math.SQRT2) ** 2));
    return 1 - erf; // 2 * (1 - Φ(z))
}

// ── the report ───────────────────────────────────────────────────────────
async function main() {
    const db = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
    });

    const windowStart = SINCE
        ? `'${SINCE}'::timestamptz`
        : `NOW() - INTERVAL '${DAYS} days'`;
    const label = SINCE ? `since ${SINCE}` : `last ${DAYS} days`;

    /**
     * One row per person, with the ladder they saw first.
     *
     * `actor` prefers account_id: /subscribe is behind a login, so the same
     * human arriving on a phone and a laptop is one row, not two. The anon_id
     * fallback is for rows written before the beacon carried credentials.
     *
     * `ladders_seen` is what makes a price change readable rather than
     * misleading. Someone shown 99 SAR in the morning and 300 in the afternoon
     * belongs to neither arm; counted in either, they would flatter it.
     */
    const exposureCte = `
        WITH shown AS (
            SELECT COALESCE(account_id::text, 'anon:' || anon_id) AS actor,
                   MAX(account_id)                                AS account_id,
                   props->>'ladder'                               AS ladder,
                   MIN(created_at)                                AS first_seen
              FROM funnel_events
             WHERE event = 'subscribe_prices_shown'
               AND created_at >= ${windowStart}
               AND COALESCE(account_id::text, anon_id) IS NOT NULL
             GROUP BY 1, 3
        ),
        actors AS (
            SELECT actor,
                   MAX(account_id)                             AS account_id,
                   COUNT(*)                                    AS ladders_seen,
                   (ARRAY_AGG(ladder ORDER BY first_seen))[1]  AS arm,
                   MIN(first_seen)                             AS first_seen
              FROM shown
             GROUP BY actor
        )
    `;

    const { rows: arms } = await db.query(`
        ${exposureCte}
        SELECT arm,
               COUNT(*) FILTER (WHERE ladders_seen = 1)::int AS exposed,
               COUNT(*) FILTER (WHERE ladders_seen > 1)::int AS crossed,
               MIN(first_seen) AS from_ts,
               MAX(first_seen) AS to_ts
          FROM actors
         GROUP BY arm
         ORDER BY exposed DESC
    `);

    if (!arms.length) {
        console.log(`\nNo price exposures recorded (${label}).`);
        console.log('subscribe_prices_shown ships with this change — there is nothing before it.\n');
        await db.end();
        return;
    }

    // Downstream funnel steps, attributed to the arm of first exposure.
    const { rows: steps } = await db.query(`
        ${exposureCte}
        SELECT a.arm,
               f.event,
               COUNT(DISTINCT a.actor)::int AS actors
          FROM actors a
          JOIN funnel_events f
            ON COALESCE(f.account_id::text, 'anon:' || f.anon_id) = a.actor
           AND f.created_at >= a.first_seen
         WHERE a.ladders_seen = 1
           AND f.event IN ('subscribe_plan_select', 'subscribe_pay_click', 'payment_success')
         GROUP BY 1, 2
    `);

    // The money. payment_events is the source of truth; the beacon is not.
    const { rows: paid } = await db.query(`
        ${exposureCte}
        SELECT a.arm,
               COUNT(DISTINCT a.account_id)::int         AS buyers,
               COALESCE(SUM(p.amount_halalas), 0)::bigint AS gross_halalas
          FROM actors a
          JOIN payment_events p
            ON p.account_id = a.account_id
           AND p.status = 'paid'
           AND p.received_at >= a.first_seen
         WHERE a.ladders_seen = 1
           AND a.account_id IS NOT NULL
         GROUP BY 1
    `);

    const stepFor = (arm, event) => steps.find((s) => s.arm === arm && s.event === event)?.actors || 0;
    const paidFor = (arm) => paid.find((p) => p.arm === arm) || { buyers: 0, gross_halalas: 0 };

    console.log(`\n  Price ladders shown, ${label}`);
    console.log('  ' + '─'.repeat(78));

    const table = arms.map((row) => {
        const money = paidFor(row.arm);
        const gross = Number(money.gross_halalas);
        return {
            arm: row.arm,
            exposed: row.exposed,
            crossed: row.crossed,
            selected: stepFor(row.arm, 'subscribe_plan_select'),
            payClicked: stepFor(row.arm, 'subscribe_pay_click'),
            buyers: money.buyers,
            gross,
            perThousand: row.exposed ? Math.round((gross / row.exposed) * 1000) : 0,
            from: row.from_ts,
            to: row.to_ts,
        };
    });

    for (const r of table) {
        console.log(`\n  ${readableLadder(r.arm)}`);
        console.log(`    live        ${new Date(r.from).toISOString().slice(0, 10)} → ${new Date(r.to).toISOString().slice(0, 10)}`);
        console.log(`    shown to    ${r.exposed} people${r.crossed ? `   (+${r.crossed} excluded: also saw another ladder)` : ''}`);
        console.log(`    picked      ${r.selected}  (${pct(r.selected, r.exposed)})`);
        console.log(`    tried card  ${r.payClicked}  (${pct(r.payClicked, r.exposed)})`);
        console.log(`    paid        ${r.buyers}  (${pct(r.buyers, r.exposed)})`);
        console.log(`    revenue     ${sar(r.gross)} SAR   →  ${sar(r.perThousand)} SAR per 1000 shown`);
    }

    // ── verdict ──────────────────────────────────────────────────────────
    const totalBuyers = table.reduce((sum, r) => sum + r.buyers, 0);
    const ranked = [...table].sort((a, b) => b.exposed - a.exposed);

    console.log('\n  ' + '─'.repeat(78));
    if (ranked.length < 2) {
        console.log('  VERDICT: one ladder only — nothing to compare. This is a baseline, not a test.');
    } else if (totalBuyers < MIN_BUYERS) {
        console.log(`  VERDICT: INSUFFICIENT DATA — ${totalBuyers} buyers across all ladders, ${MIN_BUYERS} required.`);
        console.log('  Revenue per 1000 above is worth reading as a description. It is not a result,');
        console.log('  and the arm that happens to lead here will not reliably lead again.');
    } else {
        const [a, b] = ranked;
        const p = twoProportionP(a.buyers, a.exposed, b.buyers, b.exposed);
        const better = a.perThousand >= b.perThousand ? a : b;
        console.log(`  Purchase rate: ${pct(a.buyers, a.exposed)} vs ${pct(b.buyers, b.exposed)}`
            + (p == null ? '' : `,  p ≈ ${p.toFixed(3)}`));
        console.log(`  Revenue per 1000 shown: ${sar(a.perThousand)} vs ${sar(b.perThousand)} SAR`);
        console.log(`  Leading on revenue: ${readableLadder(better.arm)}`);
        if (p != null && p >= 0.05) {
            console.log('  The conversion difference is inside the noise at this sample size.');
        }
        console.log('  Decide on revenue per exposure, not on conversion: a lower price that converts');
        console.log('  better can still earn less, and that is the whole question the anchor asks.');
    }

    // Confounds worth naming before anyone reads a number off this.
    const spans = table.map((r) => `${new Date(r.from).toISOString().slice(0, 10)}→${new Date(r.to).toISOString().slice(0, 10)}`);
    if (new Set(spans).size === spans.length && spans.length > 1) {
        console.log('\n  NOTE: these ladders ran in sequence, not side by side. Anything else that');
        console.log('  changed between those dates — a campaign, an exam season, a funnel fix — is');
        console.log('  inside the comparison too.');
    }
    console.log('');

    if (CSV_PATH) {
        const header = 'ladder,exposed,crossed,plan_selected,pay_clicked,buyers,gross_halalas,revenue_per_1000_halalas,first_seen,last_seen\n';
        const body = table.map((r) => [
            `"${r.arm}"`, r.exposed, r.crossed, r.selected, r.payClicked, r.buyers,
            r.gross, r.perThousand, new Date(r.from).toISOString(), new Date(r.to).toISOString(),
        ].join(',')).join('\n');
        fs.writeFileSync(CSV_PATH, header + body + '\n', 'utf8');
        console.log(`  Wrote ${CSV_PATH}\n`);
    }

    await db.end();
}

// Only when run as a script. Imported (by priceTestReport.test.js, which
// covers the arithmetic above) it must not open a connection to anything.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch((err) => {
        console.error('priceTestReport failed:', err.message);
        process.exit(1);
    });
}
