/**
 * "Finish now and see my result": what a quiz that ends early is made of.
 *
 * Everything downstream (score, topics, the saved session, the attempts, the
 * seen-question rows and the free-question charge) is built from the two values
 * returned here, so an unanswered question can reach none of them. Answers are
 * keyed by position, so questions and answers are always cut down TOGETHER and
 * re-numbered in one pass (see the answer-pairing incident of 3-4 Nov 2026).
 */

const hasAnswer = (answers, index) => !!answers[index];

export const countAnswered = (questions, answers) =>
  questions.reduce((n, _, index) => n + (hasAnswer(answers, index) ? 1 : 0), 0);

/**
 * @param {Array}  questions  the quiz's questions, in the order shown
 * @param {object} answers    position -> chosen option text
 * @param {boolean} finishedEarly  false returns both inputs untouched
 * @returns {{questions: Array, answers: object}}
 */
export function submittedSet(questions, answers, finishedEarly) {
  if (!finishedEarly) return { questions, answers };
  const keptQuestions = [];
  const keptAnswers = {};
  questions.forEach((question, index) => {
    if (!hasAnswer(answers, index)) return;
    keptAnswers[keptQuestions.length] = answers[index];
    keptQuestions.push(question);
  });
  return { questions: keptQuestions, answers: keptAnswers };
}

/**
 * Offer the button once something is answered. Not on the final-review exam,
 * and not where the ordinary "Finish the quiz" button already does the same
 * thing (last question, nothing left blank).
 */
export function canFinishEarly({ questions, answers, currentIndex, isFinalQuiz }) {
  if (isFinalQuiz) return false;
  const answered = countAnswered(questions, answers);
  if (answered === 0) return false;
  return !(answered === questions.length && currentIndex === questions.length - 1);
}
