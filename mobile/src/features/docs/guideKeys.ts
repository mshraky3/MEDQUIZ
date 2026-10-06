/** Which key of the guides copy holds each study guide, by its URL slug. Pure, so it can be tested. */
export const GUIDE_KEYS: Record<string, 'howToUseBank' | 'studyPlan' | 'wrongQuestions' | 'vsPrometric' | 'highYield'> = {
  'how-to-use-a-question-bank': 'howToUseBank',
  'smle-study-plan': 'studyPlan',
  'wrong-questions-method': 'wrongQuestions',
  'smle-vs-prometric-differences': 'vsPrometric',
  'smle-high-yield-topics': 'highYield',
};
export const GUIDE_SLUGS = Object.keys(GUIDE_KEYS);
