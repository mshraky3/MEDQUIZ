import React from 'react';
import GuideArticle from './GuideArticle.jsx';
import { useCopy } from '../../i18n';
import guidesCopy from '../../i18n/copy/guides.js';

const SmleHighYieldTopicsGuide = () => <GuideArticle guide={useCopy(guidesCopy).highYield} />;

export default SmleHighYieldTopicsGuide;
