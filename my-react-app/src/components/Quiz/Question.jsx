import React, { useState } from 'react';
import Icon from '../common/Icon.jsx';
import ExplanationPanel from '../common/ExplanationPanel.jsx';
import ReportModal from './ReportModal';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import './ReportModal.css';

const Question = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  revealed = false,
  onSelectOption,
  onNextQuestion,
  onPreviousQuestion,
  onFinishQuiz,
  timeRemaining,
  timerMinutes,
  userId,
  userEmail,
}) => {
  const [showReport, setShowReport] = useState(false);
  const t = useCopy(quizCopy).quiz;
  const { dir } = useLang();
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining) return '#333';
    if (timeRemaining <= 60) return '#dc3545'; // Red
    if (timeRemaining <= 300) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  };

  // The question, its options and the correct answer are exam material: they
  // stay in the language they are stored in (English) whatever the UI language.
  const safeQuestionText = question?.question_text || t.questionUnavailable;
  const optionKeys = ['option1', 'option2', 'option3', 'option4'];

  return (
    <>
      {/* The card's chrome follows the site language; the stem and the four
          options are pinned LTR in QUIZ.css because they are exam material. */}
      <div className="quiz-container-card" dir={dir}>
        {/* Timer Display */}
        {timerMinutes && (
          <div className="timer-display" style={{ color: getTimerColor() }}>
            <Icon name="clock" size={15} /> {formatTime(timeRemaining)}
          </div>
        )}

        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <div className="header-top">
              <h3>{t.questionLabel(questionNumber)}</h3>
              <div className="progress-compact">{questionNumber}/{totalQuestions}</div>
            </div>
          </div>
          <div className="question-content">
            <div className="question-text">{safeQuestionText}</div>

            <div className="options">
              {optionKeys.map((optKey) => {
                const option = question?.[optKey];
                const isSelected = selectedAnswer === option;
                // Study mode only: once answered, mark the correct option and
                // the student's pick if it was a different one.
                let state = '';
                if (revealed && option) {
                  if (option === question?.correct_option) state = ' is-correct';
                  else if (isSelected) state = ' is-wrong';
                }
                return (
                  <button
                    key={optKey}
                    className={`option-button ${isSelected ? 'selected' : ''}${state}`}
                    onClick={() => option && onSelectOption(option)}
                    disabled={!option || revealed}
                  >
                    <span className="option-text">{option || t.optionUnavailable}</span>
                    {state === ' is-correct' && (
                      <span className="option-mark"><Icon name="check" size={16} /></span>
                    )}
                    {state === ' is-wrong' && (
                      <span className="option-mark"><Icon name="x" size={16} /></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Study mode: the answer is already on screen, so the explanation
                opens with it rather than hiding behind another click. */}
            {revealed && (
              <ExplanationPanel explanation={question?.explanation} defaultOpen />
            )}

            {/* Report button */}
            {userId && userEmail && (
              <div style={{ textAlign: 'start' }}>
                <button className="report-question-btn" onClick={() => setShowReport(true)}>
                  <Icon name="flag" size={15} /> {t.report}
                </button>
              </div>
            )}

            {/* Navigation Buttons inside question card */}
            <div className="navigation-section">
              <button
                className="nav-button prev-button"
                onClick={onPreviousQuestion}
                disabled={questionNumber === 1}
              >
                {dir === 'rtl' ? '\u2192 ' : '\u2190 '}{t.previous}
              </button>

              <button
                className="nav-button next-button"
                onClick={questionNumber === totalQuestions ? onFinishQuiz : onNextQuestion}
                disabled={questionNumber === totalQuestions && !selectedAnswer}
              >
                {questionNumber === totalQuestions
                  ? t.finish
                  : <>{t.next}{dir === 'rtl' ? ' \u2190' : ' \u2192'}</>}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showReport && (
        <ReportModal
          question={question}
          userId={userId}
          userEmail={userEmail}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
};

export default Question;
