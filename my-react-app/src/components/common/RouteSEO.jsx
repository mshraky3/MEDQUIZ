import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO.jsx';
import { getSeoConfig } from '../../seo/siteMetadata.js';
import { useLang } from '../../i18n';

const RouteSEO = () => {
    const { pathname } = useLocation();
    const { lang } = useLang();
    return <SEO {...getSeoConfig(pathname, lang)} />;
};

export default RouteSEO;