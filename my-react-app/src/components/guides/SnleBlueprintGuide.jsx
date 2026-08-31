import React from 'react';
import GuideArticle from './GuideArticle.jsx';
import { useCopy } from '../../i18n';
import guidesCopy from '../../i18n/copy/guides.js';

const SnleBlueprintGuide = () => <GuideArticle guide={useCopy(guidesCopy).snleBlueprint} />;

export default SnleBlueprintGuide;
