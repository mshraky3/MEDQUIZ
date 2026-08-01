import React from 'react';
import LegalDoc from './LegalDoc.jsx';
import { useCopy } from '../../i18n';
import legalCopy from '../../i18n/copy/legal.js';

const About = () => <LegalDoc doc={useCopy(legalCopy).about} />;

export default About;
