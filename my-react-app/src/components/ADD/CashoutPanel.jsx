import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';

/**
 * Cash-out position: what Moyasar has sent to the bank and nobody has taken
 * out yet. It loads on its own, so a slow Moyasar never blocks the ledger
 * below it, and it ignores that page's date filters.
 */
const sar = (halalas) => (Number(halalas || 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const day = (key) => new Date(`${key}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const Kpi = ({ label, value, sub, tone = '' }) => (
    <div className={`acc-kpi ${tone}`}>
        <span className="acc-kpi-label">{label}</span>
        <span className="acc-kpi-value">{value}</span>
        <span className="acc-kpi-sub">{sub}</span>
    </div>
);

const money = (halalas) => (halalas == null ? '—' : <>{sar(halalas)}<small>SAR</small></>);

const CashoutPanel = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${Globals.URL}/api/accounting/cashout`);
            setData(res.data);
        } catch (err) {
            setData(null);
            setError(err.response?.data?.message || err.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const last = data?.lastCashout;
    const pending = data?.unsettled;

    return (
        <section className="acc-panel">
            <h2>Cash-out</h2>
            <p className="acc-panel-sub">
                Moyasar settlements, not a bank statement. All dates are Riyadh time.
                The date filters on this page do not apply here.
            </p>

            {loading && <div className="acc-loading"><Spinner size="lg" /><p>Asking Moyasar…</p></div>}

            {!loading && error && (
                <div className="acc-inline-error">
                    {error} <button type="button" className="acc-btn ghost sm" onClick={load}>Retry</button>
                </div>
            )}

            {!loading && data && (
                <>
                    {!last && (
                        <div className="acc-note">
                            <span>
                                No cash-out is recorded, so the uncashed amount is unknown. Set
                                <code>CASHOUT_LAST</code> on the API project to
                                <code>cash-out day:newest settlement day it took</code> (both
                                YYYY-MM-DD), then redeploy.
                            </span>
                        </div>
                    )}

                    <div className="acc-kpis">
                        <Kpi
                            tone="is-net"
                            label="Settled, not cashed out"
                            value={money(data.uncashedHalalas)}
                            sub={data.uncashed ? plural(data.uncashed.length, 'Moyasar settlement') : 'no cash-out recorded'}
                        />
                        <Kpi
                            label="Your share"
                            value={money(data.ownerShareHalalas)}
                            sub={data.ownerShareRatio
                                ? `settled amount × ${data.ownerShareRatio}`
                                : <>set <code>OWNER_SHARE_RATIO</code></>}
                        />
                        <Kpi
                            label="Paid, not yet settled"
                            value={money(pending.netHalalas)}
                            sub={pending.count
                                ? `${plural(pending.count, 'payment')} since ${day(pending.oldestDate)}, after fees`
                                    + (pending.estimatedCount ? ' (partly estimated)' : '')
                                : 'nothing waiting'}
                        />
                        <Kpi
                            label="Last cash-out"
                            value={last ? day(last.date) : '—'}
                            sub={last ? `took settlements up to ${day(last.coversThrough)}` : 'not recorded'}
                        />
                    </div>

                    {data.uncashed && (
                        <div className="acc-table-wrap">
                            <table className="acc-table">
                                <thead>
                                    <tr><th>Settled on</th><th className="num">Payments</th><th className="num">Sent to bank</th></tr>
                                </thead>
                                <tbody>
                                    {data.uncashed.map((s, i) => (
                                        <tr key={`${s.date}-${i}`}>
                                            <td>{day(s.date)}</td>
                                            <td className="num">{s.paymentCount}</td>
                                            <td className="num net">{sar(s.amountHalalas)}</td>
                                        </tr>
                                    ))}
                                    {data.uncashed.length === 0 && (
                                        <tr><td colSpan={3} className="acc-empty">Nothing settled since the last cash-out.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {last && (
                        <p className="acc-panel-sub">
                            After a new cash-out, change <code>CASHOUT_LAST</code> on the API project
                            (<code>cash-out day:newest settlement day it took</code>, YYYY-MM-DD) and redeploy.
                        </p>
                    )}
                </>
            )}
        </section>
    );
};

export default CashoutPanel;
