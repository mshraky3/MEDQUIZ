import React, { useState } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import Globals from '../../global.js';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import './ReportModal.css';

const ReportModal = ({ question, userId, userEmail, onClose }) => {
    const t = useCopy(quizCopy).report;
    const { dir } = useLang();
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleSubmit = async () => {
        if (status === 'loading' || status === 'success') return;
        setStatus('loading');
        try {
            await axios.post(`${Globals.URL}/api/question-reports`, {
                question_id: question.id,
                user_id: userId,
                user_email: userEmail,
                reason: reason.trim() || null,
            });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="report-modal-overlay" onClick={onClose}>
            <div className="report-modal" onClick={(e) => e.stopPropagation()} dir={dir}>
                <button className="report-modal-close" onClick={onClose} aria-label={t.close}><Icon name="x" size={18} /></button>
                <h3 className="report-modal-title"><Icon name="flag" size={16} /> {t.title}</h3>

                {status === 'success' ? (
                    <div className="report-modal-success">
                        <p><Icon name="check-circle" size={16} /> {t.success}</p>
                        <button className="report-btn-submit" onClick={onClose}>{t.close}</button>
                    </div>
                ) : (
                    <>
                        {/* The question itself is exam material — always shown as
                            stored, in its own reading direction. */}
                        <div className="report-modal-question-preview" dir="auto">
                            <p>{question?.question_text}</p>
                        </div>
                        <label className="report-modal-label">
                            {t.label} <span className="report-optional">{t.optional}</span>
                        </label>
                        <textarea
                            className="report-modal-textarea"
                            placeholder={t.placeholder}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                        {status === 'error' && (
                            <p className="report-modal-error">{t.error}</p>
                        )}
                        <div className="report-modal-actions">
                            <button className="report-btn-cancel" onClick={onClose}>{t.cancel}</button>
                            <button
                                className="report-btn-submit"
                                onClick={handleSubmit}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? t.submitting : t.submit}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
