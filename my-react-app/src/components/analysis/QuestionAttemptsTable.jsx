import React, { useState, useMemo, useCallback } from 'react';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import './analysis.css';

const QuestionAttemptsTable = ({ questionAttempts, questions, latestQuiz }) => {
    const [showAll, setShowAll] = useState(false);

    // Memoize expensive filtering and sorting operations
    const lastQuizAttempts = useMemo(() => {
        if (!latestQuiz || !latestQuiz.id) return [];

        return questionAttempts
            .filter(a => a.quiz_session_id === latestQuiz.id)
            .sort((a, b) => new Date(a.attempted_at) - new Date(b.attempted_at));
    }, [questionAttempts, latestQuiz]);

    const displayedAttempts = useMemo(() => {
        return showAll ? lastQuizAttempts : lastQuizAttempts.slice(0, 5);
    }, [lastQuizAttempts, showAll]);

    // Memoize questions lookup for better performance
    const questionsMap = useMemo(() => {
        const map = new Map();
        questions.forEach(q => map.set(q.id, q));
        return map;
    }, [questions]);

    const toggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    return (
        <section className="streak-section">
            <h3 className="section-header">أسئلة آخر اختبار</h3>

            {lastQuizAttempts.length > 0 ? (
                <>
                    <div className="questions-grid">
                        {displayedAttempts.map((attempt, index) => {
                            const questionRow = questionsMap.get(attempt.question_id);
                            const questionText = questionRow?.question_text || 'Unknown question';
                            const correctAnswer = questionRow?.correct_option || 'N/A';
                            const questionSource = getSourceLabel(questionRow?.source);
                            const questionType = questionRow?.question_type || 'General';
                            const isCorrect = attempt.is_correct;
                            return (
                                <div key={attempt.id || index} className="question-card">
                                    <div className="question-header">
                                        <div className="question-meta">
                                            <span className="type-badge">
                                                <Icon name="book" size={15} /> {questionType}
                                            </span>
                                            <span className="source-badge">
                                                <Icon name="book-open" size={15} /> {questionSource}
                                            </span>
                                            <span className={`result-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                                                {isCorrect ? <><Icon name="check-circle" size={13} /> صحيح</> : <><Icon name="x-circle" size={13} /> خطأ</>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="question-content">
                                        <div className="question-text">
                                            {questionText}
                                        </div>

                                        <div className="answers-section">
                                            <div className="answer-row">
                                                <span className="answer-label wrong">إجابتك:</span>
                                                <span className={`answer-text ${isCorrect ? 'correct' : 'wrong'}`}>
                                                    {attempt.selected_option}
                                                </span>
                                            </div>
                                            <div className="answer-row">
                                                <span className="answer-label correct">الإجابة الصحيحة:</span>
                                                <span className="answer-text correct">{correctAnswer}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {lastQuizAttempts.length > 5 && (
                        <div className="see-all-container">
                            <button
                                onClick={toggleShowAll}
                                className="see-all-button"
                            >
                                {showAll ? '▲ عرض أقل' : `▼ عرض الكل (${lastQuizAttempts.length})`}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="no-streak">لم يتم العثور على أسئلة في آخر اختبار.</p>
            )}

        </section>
    );
};

export default QuestionAttemptsTable;