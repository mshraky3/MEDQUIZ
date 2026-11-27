import React, { useEffect, useRef } from 'react';
import { useCopy, useLang } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';

/** Confirm step for ending a quiz early. Esc or "keep going" changes nothing. */
const FinishNowDialog = ({ answered, total, onConfirm, onCancel }) => {
  const t = useCopy(quizCopy).quiz;
  const { dir } = useLang();
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  // Focus starts on the safe choice, and Tab stays between the two buttons.
  useEffect(() => {
    cancelRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onCancelRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      e.preventDefault();
      const next = document.activeElement === cancelRef.current ? confirmRef : cancelRef;
      next.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="unanswered-popup-overlay">
      <div
        className="unanswered-popup finish-now-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-now-title"
        aria-describedby="finish-now-body"
        dir={dir}
      >
        <h3 id="finish-now-title">{t.finishNowTitle}</h3>
        <p id="finish-now-body">{t.finishNowBody(answered, total)}</p>
        <div className="finish-now-actions">
          <button type="button" ref={confirmRef} className="nav-button next-button" onClick={onConfirm}>
            {t.finishNowConfirm}
          </button>
          <button type="button" ref={cancelRef} className="nav-button prev-button" onClick={onCancel}>
            {t.finishNowCancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishNowDialog;
