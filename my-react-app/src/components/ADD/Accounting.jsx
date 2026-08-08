import React, { useCallback, useEffect, useState } from 'react';
import axios, { getAdminKey } from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import AdminLayout from './AdminLayout.jsx';
import './Accounting.css';

/**
 * Accounting — the money view, separate from the growth dashboard.
 *
 * Everything here comes from /api/accounting/summary, which derives every
 * figure through services/accountingService.js. That is deliberate: the
 * dashboard, this page, the 2-day PDF report and customer invoices all read
 * the same settlement logic, so they cannot disagree about what was earned.
 *
 * "Net" means money that actually reaches the bank: gross − gateway fee −
 * refunds. The previous dashboard only ever showed gross, which overstated
 * takings by roughly 3.6% of turnover.
 */
const sar = (halalas) => (Number(halalas || 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
});

const fmtDate = (d) => new Date(d).toISOString().slice(0, 10);

// English labels for payment plan ids — admin is English/LTR only.
const PLAN_LABELS = {
    monthly: 'Monthly',
    four_month: '4-month',
    annual: 'Annual',
    group_3: 'Group (3 seats)',
    group_5: 'Group (5 seats)',
    unknown: 'Unknown',
};
const planLabel = (planId) => PLAN_LABELS[planId] || planId;

const MONTH_LABEL = (key) => {
    const [y, m] = key.split('-');
    return new Date(Date.UTC(+y, +m - 1, 1))
        .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

const Accounting = () => {
    const [data, setData] = useState(null);
    const [state, setState] = useState('loading'); // loading | ready | error
    const [error, setError] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const load = useCallback(async () => {
        setState('loading');
        try {
            const params = new URLSearchParams();
            if (from) params.set('from', from);
            // `to` is an inclusive day in the UI; the API filter is exclusive,
            // so push it to the end of that day.
            if (to) params.set('to', `${to}T23:59:59.999Z`);
            const res = await axios.get(
                `${Globals.URL}/api/accounting/summary?${params.toString()}`
            );
            setData(res.data);
            setState('ready');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load');
            setState('error');
        }
    }, [from, to]);

    useEffect(() => { load(); }, [load]);

    // The CSV and PDF routes are plain links, but they need the admin header —
    // so fetch as a blob and hand the browser an object URL.
    const download = async (url, filename) => {
        try {
            const res = await axios.get(url, { responseType: 'blob' });
            const href = URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = href;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(href);
        } catch (err) {
            setError('Download failed: ' + (err.message || 'unknown error'));
        }
    };

    const openInvoice = async (ref, number) => {
        try {
            const res = await axios.get(
                `${Globals.URL}/api/accounting/invoice/${ref}.pdf`, { responseType: 'blob' }
            );
            const href = URL.createObjectURL(res.data);
            window.open(href, '_blank', 'noopener');
            // Revoked late so the new tab has time to load the blob.
            setTimeout(() => URL.revokeObjectURL(href), 60000);
        } catch (err) {
            setError(`Could not open invoice ${number}: ${err.message}`);
        }
    };

    if (state === 'loading' && !data) {
        return (
            <AdminLayout>
                <div className="acc-loading"><Spinner size="lg" /><p>Loading accounting…</p></div>
            </AdminLayout>
        );
    }

    if (state === 'error' && !data) {
        return (
            <AdminLayout>
                <div className="acc-error">
                    <Icon name="alert-triangle" size={28} />
                    <p>{error}</p>
                    <button className="acc-btn" onClick={load}>Retry</button>
                </div>
            </AdminLayout>
        );
    }

    const t = data?.totals || {};
    const tag = fmtDate(new Date());

    return (
        <AdminLayout>

                <header className="acc-head">
                    <div>
                        <h1><Icon name="bar-chart" size={20} /> Accounting</h1>
                        <p>
                            Settled figures for every confirmed payment. <b>Net</b> is what reaches
                            the bank — gross minus Moyasar&apos;s fee minus refunds.
                        </p>
                    </div>
                    <div className="acc-actions">
                        <button
                            className="acc-btn"
                            onClick={() => download(
                                `${Globals.URL}/api/accounting/export.csv${from || to
                                    ? `?${new URLSearchParams({ ...(from && { from }), ...(to && { to: `${to}T23:59:59.999Z` }) })}`
                                    : ''}`,
                                `sqb-accounting-${tag}.csv`,
                            )}
                            disabled={!getAdminKey()}
                        >
                            <Icon name="folder" size={15} /> Export CSV
                        </button>
                        <button className="acc-btn ghost" onClick={load}>
                            <Icon name="refresh" size={15} /> Refresh
                        </button>
                    </div>
                </header>

                <div className="acc-filters">
                    <label>
                        From
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </label>
                    <label>
                        To
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </label>
                    {(from || to) && (
                        <button className="acc-btn ghost sm" onClick={() => { setFrom(''); setTo(''); }}>
                            Clear
                        </button>
                    )}
                    <span className="acc-filter-note">
                        {t.count} payment{t.count === 1 ? '' : 's'} in range
                    </span>
                </div>

                {error && <div className="acc-inline-error">{error}</div>}

                {/* ── Headline figures ── */}
                <section className="acc-kpis">
                    <div className="acc-kpi">
                        <span className="acc-kpi-label">Gross received</span>
                        <span className="acc-kpi-value">{sar(t.grossHalalas)}<small>SAR</small></span>
                        <span className="acc-kpi-sub">{t.count} payments</span>
                    </div>
                    <div className="acc-kpi is-cost">
                        <span className="acc-kpi-label">Gateway fees</span>
                        <span className="acc-kpi-value">−{sar(t.feeHalalas)}<small>SAR</small></span>
                        <span className="acc-kpi-sub">
                            {t.grossHalalas ? ((t.feeHalalas / t.grossHalalas) * 100).toFixed(2) : '0.00'}% of gross
                        </span>
                    </div>
                    <div className="acc-kpi is-cost">
                        <span className="acc-kpi-label">Refunded</span>
                        <span className="acc-kpi-value">−{sar(t.refundedHalalas)}<small>SAR</small></span>
                        <span className="acc-kpi-sub">{t.refundCount} refund{t.refundCount === 1 ? '' : 's'}</span>
                    </div>
                    <div className="acc-kpi is-net">
                        <span className="acc-kpi-label">Net received</span>
                        <span className="acc-kpi-value">{sar(t.netHalalas)}<small>SAR</small></span>
                        <span className="acc-kpi-sub">after fees &amp; refunds</span>
                    </div>
                </section>

                {t.estimatedCount > 0 && (
                    <div className="acc-note">
                        <Icon name="info" size={16} />
                        <span>
                            <b>{t.estimatedCount}</b> of {t.count} payments have no settled fee from
                            Moyasar (the gateway returned <code>fee: 0</code>). Their fee is computed
                            from the scheme rate + fixed fee + VAT and is marked
                            <span className="acc-est-marker">est.</span> below. The model reproduces
                            Moyasar&apos;s reported fees exactly on the payments where a fee was given.
                        </span>
                    </div>
                )}

                {data?.vat?.registered === false && (
                    <div className="acc-note subtle">
                        <Icon name="info" size={16} />
                        <span>
                            No VAT breakdown is shown because <code>BUSINESS_VAT_NUMBER</code> is not
                            set. Once you are VAT-registered, set it and invoices plus these figures
                            will show the statutory split automatically.
                        </span>
                    </div>
                )}

                {/* ── Monthly ledger ── */}
                <section className="acc-panel">
                    <h2>By month</h2>
                    <div className="acc-table-wrap">
                        <table className="acc-table">
                            <thead>
                                <tr>
                                    <th>Month</th><th className="num">Payments</th><th className="num">Gross</th>
                                    <th className="num">Fees</th><th className="num">Refunds</th><th className="num">Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.months || []).map((m) => (
                                    <tr key={m.month}>
                                        <td>{MONTH_LABEL(m.month)}</td>
                                        <td className="num">{m.count}</td>
                                        <td className="num">{sar(m.gross)}</td>
                                        <td className="num cost">−{sar(m.fee)}</td>
                                        <td className="num cost">{m.refunded ? `−${sar(m.refunded)}` : '—'}</td>
                                        <td className="num net">{sar(m.net)}</td>
                                    </tr>
                                ))}
                                {(data?.months || []).length === 0 && (
                                    <tr><td colSpan={6} className="acc-empty">No payments in this range.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── Cost of each payment method ── */}
                <section className="acc-panel">
                    <h2>By payment method</h2>
                    <p className="acc-panel-sub">What each scheme actually costs you per riyal collected.</p>
                    <div className="acc-scheme-grid">
                        {(data?.schemes || []).map((s) => (
                            <div className="acc-scheme" key={s.scheme}>
                                <span className="acc-scheme-name">{s.scheme}</span>
                                <span className="acc-scheme-count">{s.count} payment{s.count === 1 ? '' : 's'}</span>
                                <div className="acc-scheme-rows">
                                    <span>Gross <b>{sar(s.gross)}</b></span>
                                    <span>Fees <b className="cost">−{sar(s.fee)}</b></span>
                                    <span>Net <b className="net">{sar(s.net)}</b></span>
                                </div>
                                <span className="acc-scheme-rate">
                                    effective {s.gross ? ((s.fee / s.gross) * 100).toFixed(2) : '0.00'}% fee
                                </span>
                            </div>
                        ))}
                        {(data?.schemes || []).length === 0 && <p className="acc-empty">No data.</p>}
                    </div>
                </section>

                {/* ── Per-track revenue ── */}
                <section className="acc-panel">
                    <h2>By study track</h2>
                    <div className="acc-table-wrap">
                        <table className="acc-table">
                            <thead>
                                <tr>
                                    <th>Track</th><th className="num">Payments</th>
                                    <th className="num">Gross</th><th className="num">Fees</th><th className="num">Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.byTrack || []).map((b) => (
                                    <tr key={b.track}>
                                        <td>{b.label} <span className="acc-dim">({b.track})</span></td>
                                        <td className="num">{b.count}</td>
                                        <td className="num">{sar(b.gross)}</td>
                                        <td className="num cost">−{sar(b.fee)}</td>
                                        <td className="num net">{sar(b.net)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── Per-plan revenue ── */}
                <section className="acc-panel">
                    <h2>By plan</h2>
                    <div className="acc-table-wrap">
                        <table className="acc-table">
                            <thead>
                                <tr>
                                    <th>Plan</th><th className="num">Payments</th><th className="num">Seats</th>
                                    <th className="num">Gross</th><th className="num">Fees</th><th className="num">Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.byPlan || []).map((b) => (
                                    <tr key={b.plan}>
                                        <td>{planLabel(b.plan)}</td>
                                        <td className="num">{b.count}</td>
                                        <td className="num">{b.seats}</td>
                                        <td className="num">{sar(b.gross)}</td>
                                        <td className="num cost">−{sar(b.fee)}</td>
                                        <td className="num net">{sar(b.net)}</td>
                                    </tr>
                                ))}
                                {(data?.byPlan || []).length === 0 && (
                                    <tr><td colSpan={6} className="acc-empty">No data.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── Every payment ── */}
                <section className="acc-panel">
                    <h2>All payments</h2>
                    <p className="acc-panel-sub">
                        Newest last. Click an invoice number to open the exact PDF the customer received.
                    </p>
                    <div className="acc-table-wrap">
                        <table className="acc-table">
                            <thead>
                                <tr>
                                    <th>Invoice</th><th>Date</th><th>Subscriber</th><th>Plan</th><th className="num">Seats</th><th>Method</th>
                                    <th className="num">Gross</th><th className="num">Fee</th><th className="num">Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.payments || []).map((p) => (
                                    <tr key={p.gatewayRef} className={p.isRefunded ? 'is-refunded' : ''}>
                                        <td>
                                            <button
                                                type="button"
                                                className="acc-invoice-link"
                                                onClick={() => openInvoice(p.gatewayRef, p.invoiceNumber)}
                                                title="Open the customer's invoice PDF"
                                            >
                                                {p.invoiceNumber}
                                            </button>
                                        </td>
                                        <td>{fmtDate(p.receivedAt)}</td>
                                        <td className="acc-sub-cell" title={p.subscriberLabel}>{p.subscriberLabel}</td>
                                        <td>{p.planId ? planLabel(p.planId) : '—'}</td>
                                        <td className="num">{p.seats || 1}</td>
                                        <td>
                                            {p.company || '—'}
                                            {p.method === 'applepay' && <span className="acc-tag">Apple Pay</span>}
                                        </td>
                                        <td className="num">{sar(p.grossHalalas)}</td>
                                        <td className="num cost">
                                            −{sar(p.feeHalalas)}
                                            {p.estimated && <span className="acc-est-marker">est.</span>}
                                        </td>
                                        <td className="num net">{sar(p.netHalalas)}</td>
                                    </tr>
                                ))}
                                {(data?.payments || []).length === 0 && (
                                    <tr><td colSpan={9} className="acc-empty">No payments in this range.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
        </AdminLayout>
    );
};

export default Accounting;
