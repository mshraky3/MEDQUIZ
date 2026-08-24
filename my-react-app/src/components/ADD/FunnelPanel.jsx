import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList,
} from 'recharts';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Panel from './ui/Panel.jsx';
import { num, pct } from './ui/format.js';
import { PALETTE, AXIS_TICK, GRID, TOOLTIP } from './ui/chartTheme.js';

/**
 * Landing → signup → free tier → paywall → subscribe → payment — the part of the
 * journey that used to be invisible (Vercel Analytics events can't be joined
 * to accounts, and page_engagement only tracks logged-in users). Backed by
 * funnel_events, written by the client beacon (POST /api/funnel) and, for
 * paywall_hit, directly by subscriptionGuard.js server-side.
 *
 * Split into a MAIN path and OUTCOME events rather than one flat list, because
 * this funnel branches: signup_otp_verified/signup_otp_failed are alternative
 * results of one step, same for payment_success/payment_failed, and a single
 * "step 4 → step 5" percentage across a branch would either double-count or
 * silently drop whichever branch isn't shown. The bar chart only ever draws
 * the main path, so each bar-to-bar drop really is that step losing people —
 * the outcomes sit next to it as context, not inside the funnel math.
 */
const MAIN_FUNNEL = [
    { event: 'landing_view', label: 'Viewed the landing page' },
    { event: 'landing_cta_signup_click', label: 'Clicked a signup CTA' },
    { event: 'signup_view', label: 'Viewed the signup page' },
    { event: 'signup_track_selected', label: 'Chose a study track' },
    { event: 'signup_otp_sent', label: 'OTP sent' },
    { event: 'signup_otp_verified', label: 'Account created' },
    { event: 'paywall_hit', label: 'Ran out of free questions' },
    { event: 'subscribe_view', label: 'Viewed /subscribe' },
    { event: 'subscribe_pay_click', label: 'Clicked "Pay and subscribe"' },
    { event: 'payment_success', label: 'Payment succeeded' },
];

/** Alternative outcomes of a MAIN_FUNNEL step — shown as context, never as a funnel bar. */
const OUTCOME_EVENTS = [
    { event: 'signup_otp_failed', label: 'OTP failed', of: 'signup_otp_sent' },
    { event: 'payment_failed', label: 'Payment failed', of: 'subscribe_pay_click' },
    // Retired 2026-08-08 — nothing emits this any more. Kept so a past cohort's
    // count still renders instead of the step just vanishing from the page.
    { event: 'trial_started', label: 'Free trial started (retired)', of: 'signup_otp_verified' },
];

const RANGES = [
    { days: 7, label: '7 days' },
    { days: 30, label: '30 days' },
    { days: 90, label: '90 days' },
];

const FunnelPanel = () => {
    const [days, setDays] = useState(30);
    const [data, setData] = useState(null);
    const [state, setState] = useState('loading');

    const load = useCallback(async () => {
        setState('loading');
        try {
            const { data: d } = await axios.get(`${Globals.URL}/api/funnel/admin?days=${days}`);
            setData(d);
            setState('ready');
        } catch (_) {
            setState('error');
        }
    }, [days]);

    useEffect(() => { load(); }, [load]);

    const eventRow = (event) => data?.events?.find((e) => e.event === event);
    const hasData = state === 'ready' && (data?.events?.length || 0) > 0;

    // Distinct actors, not raw event count, is what "how many people reached
    // this step" means — an OTP resend or a page revisit inflates the raw
    // count for one person without moving them any further down the funnel.
    const funnelData = useMemo(() => {
        const firstActors = eventRow(MAIN_FUNNEL[0].event)?.distinct_actors || 0;
        let prevActors = null;
        return MAIN_FUNNEL.map((step) => {
            const row = eventRow(step.event);
            const actors = Number(row?.distinct_actors) || 0;
            const pctOfPrev = prevActors ? Math.round((actors / prevActors) * 100) : 100;
            const pctOfFirst = firstActors ? Math.round((actors / firstActors) * 100) : 0;
            prevActors = actors || prevActors; // a zero mid-funnel doesn't zero out everything after it
            return {
                ...step,
                actors,
                events: Number(row?.count) || 0,
                pctOfPrev,
                pctOfFirst,
                // Precomputed rather than looked up inside the label formatter —
                // recharts only hands a formatter the raw bar value, and two
                // steps tying on actor count (commonly two zeros) would have
                // matched the wrong row if the label tried to find itself by
                // that value after the fact.
                barLabel: `${num(actors)} · ${pct(pctOfPrev, 0)}`,
            };
        });
    }, [data]);

    const maxActors = Math.max(1, ...funnelData.map((d) => d.actors));

    return (
        <Panel
            icon="target"
            title="Signup & paywall funnel"
            // A step's % can read over 100% — someone can reach "viewed /subscribe"
            // without ever recording "hit the paywall" in this window (a direct
            // visit, or a paywall hit from an earlier window), same as
            // wowActiveRatio on the Overview page can exceed 100% for the same
            // reason: it is a real count of real people, not a share of a fixed
            // pool that only shrinks.
            subtitle="Landing through payment — the pre-account part of the journey. Bar width is people, not events; the % is against the step before it, and people can enter mid-funnel, so it isn't always ≤100%."
            actions={(
                <div className="growth-presets">
                    {RANGES.map((r) => (
                        <button key={r.days} type="button" onClick={() => setDays(r.days)}>
                            {r.label}
                        </button>
                    ))}
                </div>
            )}
        >
            {state === 'loading' && !data && <div className="growth-state">Loading…</div>}
            {state === 'error' && <div className="growth-state growth-state--error">Failed to load funnel data.</div>}
            {state === 'ready' && !hasData && (
                <div className="growth-state">No funnel events recorded yet in this range.</div>
            )}

            {hasData && (
                <>
                    <ResponsiveContainer width="100%" height={MAIN_FUNNEL.length * 34 + 20}>
                        <BarChart
                            data={funnelData}
                            layout="vertical"
                            margin={{ top: 4, right: 56, left: 8, bottom: 0 }}
                            barCategoryGap={8}
                        >
                            <CartesianGrid stroke={GRID} horizontal={false} />
                            <XAxis type="number" domain={[0, maxActors]} tick={AXIS_TICK} allowDecimals={false} />
                            <YAxis type="category" dataKey="label" tick={{ ...AXIS_TICK, fontSize: 11 }} width={190} />
                            <Tooltip
                                contentStyle={TOOLTIP}
                                formatter={(value, name, item) => [
                                    `${num(value)} people (${item.payload.events} events) — ${item.payload.pctOfPrev}% of previous step`,
                                    'Reached this step',
                                ]}
                            />
                            <Bar dataKey="actors" radius={[0, 4, 4, 0]}>
                                {funnelData.map((d) => <Cell key={d.event} fill={PALETTE[0]} fillOpacity={0.35 + 0.65 * (d.pctOfFirst / 100)} />)}
                                <LabelList
                                    dataKey="barLabel"
                                    position="right"
                                    style={{ fontSize: 11, fill: '#475569', fontWeight: 700 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="growth-table-wrap">
                        <table className="growth-table">
                            <thead>
                                <tr><th>Outcome</th><th className="num">Events</th><th className="num">Distinct visitors/accounts</th></tr>
                            </thead>
                            <tbody>
                                {OUTCOME_EVENTS.map((step) => {
                                    const row = eventRow(step.event);
                                    return (
                                        <tr key={step.event}>
                                            <td>{step.label}</td>
                                            <td className="num">{num(row?.count || 0)}</td>
                                            <td className="num">{num(row?.distinct_actors || 0)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Panel>
    );
};

export default FunnelPanel;
