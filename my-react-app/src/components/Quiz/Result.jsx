import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

const Result = ({
  correctAnswers,
  totalQuestions,
  accuracy,
  duration,
  answers = [],
  isFinalQuiz,
  onRetry,
  userId,
  completedTopics = []
}) => {
  const navigate = useNavigate();
  const t = useCopy(quizCopy).result;
  const { lang, dir } = useLang();
  const wrongCount = answers.filter(a => !a.isCorrect).length;
  // Students review mistakes first; fall back to everything on a perfect run.
  const [filter, setFilter] = useState(wrongCount > 0 ? 'wrong' : 'all');

  const handleViewAnalysis = () => {
    if (isFinalQuiz) {
      // For final quiz, navigate to analysis with Final Exams tab
      navigate('/analysis', { state: { id: userId, activeTab: 'final-exams' } });
    } else {
      // For regular users, navigate to analysis with user ID
      navigate('/analysis', { state: { id: userId } });
    }
  };

  const visibleAnswers = answers
    .map((answer, index) => ({ answer, index }))
    .filter(({ answer }) => filter === 'all' || !answer.isCorrect);

  return (
    <div className="quiz-result" dir={dir}>
      {completedTopics.length > 0 && (
        <div className="result-completion-banner">
          <Icon name="trophy" size={20} />
          <span>
            {t.completedBannerBefore}{' '}
            {completedTopics
              .map(c => `${getTypeLabel(c.type, lang)} \u00b7 ${getSourceLabel(c.source, lang)}`)
              .join(lang === 'ar' ? '\u060c ' : ', ')}
          </span>
        </div>
      )}
      <h2>{t.title}</h2>
      <p>{t.scoreBefore} <strong>{correctAnswers}</strong> {t.scoreMiddle} <strong>{totalQuestions}</strong> {t.scoreAfter}</p>
      <p>{t.accuracy} <strong>{accuracy}%</strong></p>
      <p>{t.duration} <strong>{t.durationValue(Math.floor(duration / 60), duration % 60)}</strong></p>

      <div className="result-buttons">
        <button onClick={onRetry} className="restart-button">
          {t.another}
        </button>
        <button onClick={handleViewAnalysis} className="home-button">
          {t.viewAnalysis}
        </button>
      </div>

      {answers.length > 0 && (
        <section className="result-review">
          <div className="result-review-header">
            <h3>{t.reviewTitle}</h3>
            <div className="result-review-filters" role="group" aria-label={t.filterLabel}>
              <button
                type="button"
                className={`result-filter-btn ${filter === 'wrong' ? 'active' : ''}`}
                onClick={() => setFilter('wrong')}
                disabled={wrongCount === 0}
              >
                {t.filterWrong(wrongCount)}
              </button>
              <button
                type="button"
                className={`result-filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                {t.filterAll(answers.length)}
              </button>
            </div>
          </div>

          {visibleAnswers.length === 0 ? (
            <p className="result-review-empty">
              <Icon name="sparkles" size={16} /> {t.noWrong}
            </p>
          ) : (
            <ul className="result-review-list">
              {visibleAnswers.map(({ answer, index }) => (
                <li
                  key={index}
                  className={`result-review-item ${answer.isCorrect ? 'is-correct' : 'is-wrong'}`}
                >
                  <div className="result-review-meta">
                    <span className="result-review-num">{t.questionNo(index + 1)}</span>
                    <span className="result-review-topic">{getTypeLabel(answer.topic, lang)}</span>
                    <span className={`result-review-state ${answer.isCorrect ? 'ok' : 'bad'}`}>
                      {answer.isCorrect
                        ? <><Icon name="check-circle" size={14} /> {t.correct}</>
                        : <><Icon name="x-circle" size={14} /> {t.wrong}</>}
                    </span>
                  </div>
                  <p className="result-review-question" dir="auto">{answer.question}</p>
                  <div className="result-review-answers">
                    {answer.selected ? (
                      <div className={`result-review-answer ${answer.isCorrect ? 'ok' : 'bad'}`}>
                        <span>{t.yourAnswer}</span> <bdi>{answer.selected}</bdi>
                      </div>
                    ) : (
                      <div className="result-review-answer bad">
                        <span>{t.unanswered}</span>
                      </div>
                    )}
                    {!answer.isCorrect && (
                      <div className="result-review-answer ok">
                        <span>{t.correctAnswer}</span> <bdi>{answer.correct}</bdi>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default Result;
