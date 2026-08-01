import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import supportCopy from '../../i18n/copy/support.js';
// Same shared card shell as Subscribe — the callback URL is often opened as a
// fresh page load, so Login.css cannot be assumed to be in the bundle already.
import '../login/Login.css';
import './Subscribe.css';

const PaymentCallback = () => {
    const { user, sessionToken, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const t = useCopy(supportCopy).callback;
    const { dir } = useLang();
    // The server returns a stable reason code; the wording is ours.
    const reasonText = (reason) => t.reasons[reason] || t.reasons.default;
    const [params] = useSearchParams();
    const [state, setState] = useState('verifying'); // verifying | success | failed
    const [message, setMessage] = useState('');
    const ranRef = useRef(false);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;

        if (!user || !user.id || !sessionToken) {
            navigate('/login', { replace: true, state: { from: '/subscribe' } });
            return;
        }

        const paymentId = params.get('id');
        const moyasarStatus = params.get('status'); // 'paid' | 'failed' | null

        if (!paymentId) {
            setState('failed');
            setMessage(t.noPaymentInfo);
            return;
        }
        if (moyasarStatus && moyasarStatus !== 'paid') {
            setState('failed');
            setMessage(params.get('message') || reasonText('not_paid'));
            return;
        }

        (async () => {
            try {
                // The server derives the account from this session, so the
                // credentials are required — a userId in the body is ignored.
                const { data } = await axios.post(
                    `${Globals.URL}/api/payment/verify`,
                    { paymentId, username: user.username },
                    { headers: { Authorization: `Bearer ${sessionToken}` } },
                );
                if (data.success) {
                    // Persist so RequireAuth lets the user into the app immediately.
                    setUser({ ...user, accessAllowed: true, subscription_status: 'active' }, sessionToken);
                    setState('success');
                    setMessage(t.successMessage);
                    setTimeout(() => navigate('/quizs', { replace: true }), 1800);
                } else {
                    setState('failed');
                    setMessage(reasonText(data.reason));
                }
            } catch (err) {
                setState('failed');
                setMessage(reasonText(err.response?.data?.reason));
            }
        })();
    }, [user, sessionToken, params, navigate, setUser]);

    return (
        <div className="login-body" dir={dir}>
            <div className="login-wrapper">
                <div className="login-card subscribe-card">
                    {state === 'verifying' && (
                        <div className="subscribe-result">
                            <Spinner size="lg" />
                            <h2>{t.verifyingTitle}</h2>
                            <p>{t.verifyingBody}</p>
                        </div>
                    )}

                    {state === 'success' && (
                        <div className="subscribe-result">
                            <div className="subscribe-result-icon success">
                                <Icon name="check-circle" size={64} />
                            </div>
                            <h2>{t.successTitle}</h2>
                            <p>{message}</p>
                            <p>{t.redirecting}</p>
                        </div>
                    )}

                    {state === 'failed' && (
                        <div className="subscribe-result">
                            <div className="subscribe-result-icon failed">
                                <Icon name="x-circle" size={64} />
                            </div>
                            <h2>{t.failedTitle}</h2>
                            <p>{message}</p>
                            <button
                                className="btn primary large"
                                style={{ marginTop: 8 }}
                                onClick={() => navigate('/subscribe', { replace: true })}
                            >
                                {t.retry}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentCallback;
