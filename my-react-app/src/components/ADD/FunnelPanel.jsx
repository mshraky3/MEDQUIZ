import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Panel from './ui/Panel.jsx';

/**
 * Landing → signup → trial → paywall → subscribe → payment — the part of the
 * journey that used to be invisible (Vercel Analytics events can't be joined
 * to accounts, and page_engagement only tracks logged-in users). Backed by
 * funnel_events, written by the client beacon (POST /api/funnel) and, for
 * paywall_hit, directly by subscriptionGuard.js server-side.
 */
const FUNNEL_ORDER = [
    { event: 'landing_cta_signup_click', label: 'Clicked a signup CTA on landing' },
    { event: 'signup_view', label: 'Viewed the signup page' },
    { event: 'signup_track_selected', label: 'Chose a study track' },
    { event: 'signup_otp_sent', label: 'OTP sent' },
    { event: 'signup_otp_verified', label: 'OTP verified — account created' },
    { event: 'signup_otp_failed', label: 'OTP failed' },
    { event: 'trial_started', label: 'Free trial started' },
    { event: 'paywall_hit', label: 'Hit the paywall (402)' },
    { event: 'subscribe_view', label: 'Viewed /subscribe' },
    { event: 'subscribe_pay_click', label: 'Clicked "Pay and subscribe"' },
    { event: 'payment_success', label: 'Payment succeeded' },
    { event: 'payment_failed', label: 'Payment failed' },
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

    const countFor = (event) => data?.events?.find((e) => e.event === event)?.count || 0;
    const actorsFor = (event) => data?.events?.find((e) => e.event === event)?.distinct_actors || 0;
    const hasData = state === 'ready' && (data?.events?.length || 0) > 0;

    return (
        <Panel
            icon="target"
            title="Signup & paywall funnel"
            subtitle="Landing through payment — the pre-account part of the journey"
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
                <div className="growth-table-wrap">
                    <table className="growth-table">
                        <thead>
                            <tr><th>Step</th><th className="num">Events</th><th className="num">Distinct visitors/accounts</th></tr>
                        </thead>
                        <tbody>
                            {FUNNEL_ORDER.map((step) => (
                                <tr key={step.event}>
                                    <td>{step.label}</td>
                                    <td className="num">{countFor(step.event)}</td>
                                    <td className="num">{actorsFor(step.event)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Panel>
    );
};

export default FunnelPanel;
