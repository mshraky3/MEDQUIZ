import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO.jsx';
import { getSeoConfig } from '../../seo/siteMetadata.js';

const RouteSEO = () => {
    const { pathname } = useLocation();
    return <SEO {...getSeoConfig(pathname)} />;
};

export default RouteSEO;