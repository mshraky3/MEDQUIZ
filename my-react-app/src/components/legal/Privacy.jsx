import React from 'react';
import LegalDoc from './LegalDoc.jsx';
import { useCopy } from '../../i18n';
import legalCopy from '../../i18n/copy/legal.js';

const Privacy = () => <LegalDoc doc={useCopy(legalCopy).privacy} />;

export default Privacy;
