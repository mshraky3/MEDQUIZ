import React from 'react';
import GuideArticle from './GuideArticle.jsx';
import { useCopy } from '../../i18n';
import guidesCopy from '../../i18n/copy/guides.js';

const SmleStudyPlanGuide = () => <GuideArticle guide={useCopy(guidesCopy).studyPlan} />;

export default SmleStudyPlanGuide;
