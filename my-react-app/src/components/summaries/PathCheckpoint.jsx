import React, { useEffect, useRef, useState } from 'react';
import QuestionCard from './QuestionCard.jsx';
import Icon from '../common/Icon.jsx';

/**
 * Checkpoint that closes a milestone on the learning path.
 *
 * A recap of what was covered, two or three self-check questions pulled from the
 * milestone's own topics, and a "ready to continue" gate. The gate is a prompt,
 * not a lock — it never blocks access to anything; the next milestone (and every
 * other step) stays open whether or not the checkpoint is passed.
 */
const PathCheckpoint = ({ milestone, nextMilestone, passed, doneCount, onPass, onRedo }) => {
    const [answers, setAnswers] = useState({});   // question index -> was it correct
    const [passing, setPassing] = useState(false); // transient, drives the pass animation
    const passTimer = useRef(null);
    useEffect(() => () => clearTimeout(passTimer.current), []);

    const questions = milestone.checkpoint.questions;
    const answered = Object.keys(answers).length;
    const correct = Object.values(answers).filter(Boolean).length;
    const total = milestone.steps.length;
    const allRead = doneCount === total;

    const record = (i, isCorrect) => setAnswers((prev) => ({ ...prev, [i]: isCorrect }));

    const handlePass = () => {
        setPassing(true);
        onPass();
        clearTimeout(passTimer.current);
        passTimer.current = setTimeout(() => setPassing(false), 900);
    };

    const handleRedo = () => {
        setAnswers({});
        onRedo();
    };

    return (
        <div className={['path-row checkpoint-row', passed && 'is-passed', passing && 'is-passing'].filter(Boolean).join(' ')}>
            <div className="path-rail">
                <span className="path-node cp-node" aria-hidden="true">
                    <Icon name={passed ? 'check' : 'flag'} size={16} />
                </span>
            </div>

            <div className="checkpoint-card">
                <div className="cp-head">
                    <span className="cp-kicker">
                        <Icon name={passed ? 'check-circle' : 'help-circle'} size={14} />
                        {passed ? 'Checkpoint passed' : 'Checkpoint'}
                    </span>
                    <h3 className="cp-title">
                        {passed ? `${milestone.title} — done` : `Ready to leave ${milestone.title}?`}
                    </h3>
                    <p className="cp-recap">
                        You&rsquo;ve marked <b>{doneCount} of {total}</b> steps in this milestone as done.
                        {allRead
                            ? ' Check you can still answer these from memory before moving on.'
                            : ' Nothing is locked — you can continue now and come back to the rest whenever you like.'}
                    </p>
                </div>

                {questions.length > 0 && (
                    <div className="cp-quiz">
                        <p className="cp-prompt">{milestone.checkpoint.prompt}</p>
                        {questions.map((qq, i) => (
                            <div className="cp-q" key={`${qq.fromId}-${i}`}>
                                <span className="cp-q-from">From step: {qq.fromTitle}</span>
                                <QuestionCard
                                    question={qq}
                                    number={i + 1}
                                    className="cp-question-card"
                                    onAnswer={(isCorrect) => record(i, isCorrect)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="cp-foot">
                    <span className={`cp-score ${answered === questions.length && questions.length > 0 ? 'is-complete' : ''}`}>
                        {answered === 0
                            ? 'Not attempted yet'
                            : <><Icon name="target" size={13} /> {correct} of {answered} correct</>}
                    </span>

                    {passed ? (
                        <button type="button" className="cp-redo" onClick={handleRedo}>
                            <Icon name="refresh" size={15} /> Redo this check
                        </button>
                    ) : (
                        <button type="button" className="cp-pass" onClick={handlePass}>
                            {nextMilestone
                                ? <>I&rsquo;m ready — continue to {nextMilestone.title}</>
                                : <>I&rsquo;m ready — finish the path</>}
                            <Icon name="chevron-right" size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PathCheckpoint;
