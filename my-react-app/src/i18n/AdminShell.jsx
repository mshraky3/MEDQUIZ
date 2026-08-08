import React, { useEffect } from 'react';
import { useLang } from './LanguageContext.jsx';

/**
 * Admin screens are English-only by design — they are operator tooling, not
 * product surface, and keeping one language there avoids maintaining a second
 * translation of copy only the owner ever reads.
 *
 * This pins the document to en/ltr for as long as an admin route is mounted
 * (without changing the visitor's saved site language) and renders its subtree
 * with dir="ltr" so admin CSS never has to care about the site direction.
 */
const AdminShell = ({ children }) => {
    const { pushEnglishOnly } = useLang();

    useEffect(() => pushEnglishOnly(), [pushEnglishOnly]);

    return <div dir="ltr" lang="en" className="admin-shell">{children}</div>;
};

export default AdminShell;
