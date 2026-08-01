import React from 'react';
import LegalDoc from './LegalDoc.jsx';
import { useCopy } from '../../i18n';
import legalCopy from '../../i18n/copy/legal.js';

const Terms = () => <LegalDoc doc={useCopy(legalCopy).terms} />;

export default Terms;
