import React from 'react';
import Spinner from '../common/Spinner.jsx';
import { useCopy } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import './Loading.css';

const Loading = () => {
  const t = useCopy(quizCopy).quiz;
  return (
    <div className="quiz-container">
      <div className="loading-content">
        <Spinner size="lg" />
        <h2>{t.loadingTitle}</h2>
        <p>{t.loadingBody}</p>
        <div className="loading-bar">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
