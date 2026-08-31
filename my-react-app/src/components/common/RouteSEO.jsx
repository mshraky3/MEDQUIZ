import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO.jsx';
import { getSeoConfig } from '../../seo/siteMetadata.js';

const RouteSEO = () => {
    const { pathname } = useLocation();
    // getSeoConfig reads the language out of the path itself: /en/x is the
    // English document, so its canonical, hreflang set and og:locale are a
    // property of the URL, not of whatever the toggle last said.
    return <SEO {...getSeoConfig(pathname)} />;
};

export default RouteSEO;