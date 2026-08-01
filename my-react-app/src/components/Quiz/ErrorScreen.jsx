import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

const ErrorScreen = ({ message, navigate, id, onRetry }) => {
  const t = useCopy(quizCopy).quiz;
  const { dir } = useLang();

  return (
    <div className="quiz-container">
      <div className="error-content">
        <div className="error-icon"><Icon name="alert-triangle" size={36} /></div>
        <h2>{t.errorTitle}</h2>
        <p>{message}</p>
        <div className="error-actions">
          {onRetry && (
            <button
              className="retry-button"
              onClick={onRetry}
            >
              <Icon name="refresh" size={15} /> {t.retry}
            </button>
          )}
          <button
            className="back-button"
            onClick={() => navigate("/quizs", { state: { id } })}
            aria-label={t.back}
          >
            {/* Points back toward the start edge, which swaps with the language. */}
            <Icon name={dir === 'rtl' ? 'chevron-right' : 'chevron-left'} size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
