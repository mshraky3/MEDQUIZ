import React from 'react';
import Icon from '../common/Icon.jsx';
import './QuizComplete.css';

/**
 * Shown when the user has answered every question in the selected category
 * (type + source). A question never repeats until its whole category is
 * finished, so reaching here means the topic is fully covered.
 */
const QuizComplete = ({ sourceLabel, total, onRestart, onBack, resetting }) => (
    <div className="quiz-complete-wrap" dir="rtl">
        <div className="quiz-complete-card">
            <div className="quiz-complete-icon"><Icon name="trophy" size={44} /></div>
            <h2>🎉 أحسنت! أنهيت هذا القسم</h2>
            <p className="quiz-complete-msg">
                لقد أجبت على كل أسئلة <strong>{sourceLabel}</strong> في هذا التخصص.
                لن يتكرر أي سؤال حتى تُنهي القسم بالكامل — وقد أنهيته!
            </p>

            {total > 0 && (
                <div className="quiz-complete-stat">
                    <span className="quiz-complete-stat-num">{total.toLocaleString('ar-EG')}</span>
                    <span className="quiz-complete-stat-label">سؤال مكتمل</span>
                </div>
            )}

            <div className="quiz-complete-actions">
                <button
                    className="quiz-complete-restart"
                    onClick={onRestart}
                    disabled={resetting}
                >
                    {resetting
                        ? <><Icon name="refresh" size={16} className="spin" /> جارٍ التهيئة…</>
                        : <><Icon name="refresh" size={16} /> ابدأ القسم من جديد</>}
                </button>
                <button className="quiz-complete-back" onClick={onBack} disabled={resetting}>
                    اختيار مصدر آخر
                </button>
            </div>
        </div>
    </div>
);

export default QuizComplete;
