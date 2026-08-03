import React from 'react';
import Icon from '../common/Icon.jsx';
import { nextExamDateAny } from '../../config/examDates.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Honest urgency: a real, verifiable exam date, not a fake countdown or
 * seat-cap. Renders nothing when config/examDates.js has no future date on
 * file — never falls back to an invented deadline.
 */
const ExamCountdown = ({ copy }) => {
    const next = nextExamDateAny();
    if (!next) return null;

    const days = Math.max(1, Math.ceil((next.getTime() - Date.now()) / MS_PER_DAY));

    return (
        <div className="exam-countdown">
            <Icon name="calendar" size={16} />
            <span>{copy(days)}</span>
        </div>
    );
};

export default ExamCountdown;
