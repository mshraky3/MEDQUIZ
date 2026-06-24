import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import './Subscribe.css';

function reasonToArabic(reason) {
    switch (reason) {
        case 'not_paid':
            return 'لم تكتمل عملية الدفع. لم يتم خصم أي مبلغ.';
        case 'amount_mismatch':
            return 'قيمة الدفع غير مطابقة لقيمة الاشتراك.';
        case 'currency_mismatch':
            return 'عملة الدفع غير صحيحة.';
        case 'account_mismatch':
            return 'عملية الدفع لا تخص هذا الحساب.';
        default:
            return 'تعذّر التحقق من عملية الدفع. إذا تم خصم المبلغ تواصل مع الدعم.';
    }
}

const PaymentCallback = () => {
    const { user, sessionToken, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [state, setState] = useState('verifying'); // verifying | success | failed
    const [message, setMessage] = useState('');
    const ranRef = useRef(false);

    useEffect(() => {
        document.documentElement.dir = 'rtl';
    }, []);

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
            setMessage('لم نتمكن من العثور على معلومات عملية الدفع.');
            return;
        }
        if (moyasarStatus && moyasarStatus !== 'paid') {
            setState('failed');
            setMessage(params.get('message') || reasonToArabic('not_paid'));
            return;
        }

        (async () => {
            try {
                const { data } = await axios.post(`${Globals.URL}/api/payment/verify`, {
                    paymentId,
                    userId: user.id,
                });
                if (data.success) {
                    // Persist so RequireAuth lets the user into the app immediately.
                    setUser({ ...user, accessAllowed: true, subscription_status: 'active' }, sessionToken);
                    setState('success');
                    setMessage('تم تفعيل اشتراكك بنجاح! وصول كامل لمدة سنة.');
                    setTimeout(() => navigate('/quizs', { replace: true }), 1800);
                } else {
                    setState('failed');
                    setMessage(reasonToArabic(data.reason));
                }
            } catch (err) {
                setState('failed');
                setMessage(reasonToArabic(err.response?.data?.reason));
            }
        })();
    }, [user, sessionToken, params, navigate, setUser]);

    return (
        <div className="login-body" dir="rtl">
            <div className="login-wrapper">
                <div className="login-card subscribe-card">
                    {state === 'verifying' && (
                        <div className="subscribe-result">
                            <Spinner size="lg" />
                            <h2>جاري التحقق من الدفع...</h2>
                            <p>لحظات من فضلك، لا تغلق هذه الصفحة.</p>
                        </div>
                    )}

                    {state === 'success' && (
                        <div className="subscribe-result">
                            <div className="subscribe-result-icon success">
                                <Icon name="check-circle" size={64} />
                            </div>
                            <h2>تم تفعيل الاشتراك</h2>
                            <p>{message}</p>
                            <p>جاري تحويلك إلى المنصة...</p>
                        </div>
                    )}

                    {state === 'failed' && (
                        <div className="subscribe-result">
                            <div className="subscribe-result-icon failed">
                                <Icon name="x-circle" size={64} />
                            </div>
                            <h2>تعذّر إتمام العملية</h2>
                            <p>{message}</p>
                            <button
                                className="btn primary large"
                                style={{ marginTop: 8 }}
                                onClick={() => navigate('/subscribe', { replace: true })}
                            >
                                إعادة المحاولة
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentCallback;
