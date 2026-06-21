import React, { useState } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import Globals from '../../global.js';
import './ReportModal.css';

const ReportModal = ({ question, userId, userEmail, onClose }) => {
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
            <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                <button className="report-modal-close" onClick={onClose}><Icon name="x" size={18} /></button>
                <h3 className="report-modal-title"><Icon name="flag" size={16} /> Report Question</h3>

                {status === 'success' ? (
                    <div className="report-modal-success">
                        <p><Icon name="check-circle" size={16} /> Report submitted. We'll review it and email you with the result.</p>
                        <button className="report-btn-submit" onClick={onClose}>Close</button>
                    </div>
                ) : (
                    <>
                        <div className="report-modal-question-preview">
                            <p>{question?.question_text}</p>
                        </div>
                        <label className="report-modal-label">
                            What seems wrong? <span className="report-optional">(optional)</span>
                        </label>
                        <textarea
                            className="report-modal-textarea"
                            placeholder="e.g. The correct answer should be option 2..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                        {status === 'error' && (
                            <p className="report-modal-error">Failed to submit. Please try again.</p>
                        )}
                        <div className="report-modal-actions">
                            <button className="report-btn-cancel" onClick={onClose}>Cancel</button>
                            <button
                                className="report-btn-submit"
                                onClick={handleSubmit}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
