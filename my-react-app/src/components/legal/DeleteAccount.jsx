import React, { useContext, useState } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext.jsx';
import { useCopy } from '../../i18n';
import deleteAccountCopy from '../../i18n/copy/deleteAccount.js';
import LegalDoc from './LegalDoc.jsx';
import './DeleteAccount.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public page (no sign-in needed): what is deleted and kept, plus a two-step
 * form. Step 1 e-mails a 6-digit code to the account address, step 2 sends the
 * code and deletes. A signed-in visitor gets their address filled in and fixed.
 */
const DeleteAccount = () => {
    const t = useCopy(deleteAccountCopy);
    const { user } = useContext(UserContext) || {};
    const signedInEmail = user?.email || (EMAIL_RE.test(user?.username || '') ? user.username : '');

    const [email, setEmail] = useState(signedInEmail || '');
    const [step, setStep] = useState('email'); // 'email' | 'code' | 'done'
    const [code, setCode] = useState('');
    const [sure, setSure] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [doneText, setDoneText] = useState('');

    const failFrom = (err, fallback) => {
        const status = err.response?.status;
        if (status === 503) return t.errDisabled;
        if (status === 401) return t.errBadCode;
        if (status === 409) return t.errRefused;
        return fallback;
    };

    const sendCode = async (e) => {
        e.preventDefault();
        if (!EMAIL_RE.test(email.trim())) { setError(t.errEmail); return; }
        setBusy(true); setError('');
        try {
            await axios.post(`${Globals.URL}/api/account/delete/request`, { email: email.trim().toLowerCase() });
            setStep('code');
        } catch (err) {
            setError(failFrom(err, t.errGeneric));
        } finally {
            setBusy(false);
        }
    };

    const confirm = async (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(code.trim())) { setError(t.errCode); return; }
        if (!sure) { setError(t.errCheck); return; }
        setBusy(true); setError('');
        try {
            const { data } = await axios.post(`${Globals.URL}/api/account/delete/confirm`, {
                email: email.trim().toLowerCase(),
                code: code.trim(),
            });
            setDoneText(data?.outcome === 'anonymised' ? t.doneAnonymised : t.doneDeleted);
            setStep('done');
        } catch (err) {
            setError(failFrom(err, t.errGeneric));
        } finally {
            setBusy(false);
        }
    };

    const doc = {
        title: t.title,
        sections: [
            { blocks: [{ p: t.intro }] },
            { heading: t.deletedHeading, blocks: [{ ul: t.deleted }] },
            { heading: t.keptHeading, blocks: [{ ul: t.kept }] },
            { heading: t.outsideHeading, blocks: [{ p: t.outside }] },
            { heading: t.cannotHeading, blocks: [{ p: t.cannot }] },
            { heading: t.supportHeading, blocks: [{ p: t.support }] },
        ],
    };

    return (
        <LegalDoc doc={doc}>
            <section className="legal-section">
                <h2>{t.formHeading}</h2>
                {step === 'done' ? (
                    <p className="delete-account-ok" role="status">{doneText}</p>
                ) : (
                    <form className="delete-account-form" onSubmit={step === 'email' ? sendCode : confirm} noValidate>
                        <div>
                            <label htmlFor="del-email">{t.emailLabel}</label>
                            <input
                                id="del-email"
                                className="form-input"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                dir="ltr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={Boolean(signedInEmail) || step === 'code'}
                            />
                            {signedInEmail && <p className="legal-updated" style={{ border: 0, margin: 0, padding: 0 }}>{t.signedIn}</p>}
                        </div>
                        {step === 'code' && (
                            <>
                                <p className="delete-account-ok" role="status">{t.codeSent}</p>
                                <div>
                                    <label htmlFor="del-code">{t.codeLabel}</label>
                                    <input
                                        id="del-code"
                                        className="form-input"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                        dir="ltr"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                                <label className="delete-account-check">
                                    <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} />
                                    <span>{t.confirmCheck}</span>
                                </label>
                            </>
                        )}
                        {error && <p className="error-message" role="alert">{error}</p>}
                        <div className="delete-account-actions">
                            {step === 'email' ? (
                                <button type="submit" className="btn btn-primary" disabled={busy}>
                                    {busy ? t.sending : t.sendCode}
                                </button>
                            ) : (
                                <button type="submit" className="btn delete-account-danger" disabled={busy}>
                                    {busy ? t.working : t.confirmBtn}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </section>
        </LegalDoc>
    );
};

export default DeleteAccount;
