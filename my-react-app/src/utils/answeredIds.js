// The ids of the questions that got an answer. A timer that runs out submits the
// whole quiz for the score; only these are marked as seen and charged.
export const answeredIds = (answers) => answers.filter((a) => !!a.selected).map((a) => a.id);
