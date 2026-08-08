import React from 'react';
import LegalDoc from './LegalDoc.jsx';
import { useCopy } from '../../i18n';
import legalCopy from '../../i18n/copy/legal.js';

const RefundPolicy = () => <LegalDoc doc={useCopy(legalCopy).refund} />;

export default RefundPolicy;
