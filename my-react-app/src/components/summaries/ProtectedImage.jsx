import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../utils/apiClient';

/**
 * Fetches a single summary page as a blob through the authenticated API (so the
 * image never has a shareable/public URL), renders it as an object URL, and
 * revokes the URL on unmount / page change. Right-click and drag are disabled.
 */
const ProtectedImage = ({ slug, page, alt }) => {
    const [src, setSrc] = useState(null);
    const [status, setStatus] = useState('loading'); // loading | done | error
    const urlRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');

        const revoke = () => {
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
                urlRef.current = null;
            }
        };

        api.get(`/api/summaries/${slug}/page/${page}`, { responseType: 'blob' })
            .then((res) => {
                if (cancelled) return;
                revoke();
                const url = URL.createObjectURL(res.data);
                urlRef.current = url;
                setSrc(url);
                setStatus('done');
            })
            .catch(() => {
                if (cancelled) return;
                setStatus('error');
            });

        return () => {
            cancelled = true;
            revoke();
        };
    }, [slug, page]);

    if (status === 'error') {
        return <div className="summary-page-error">تعذّر تحميل هذه الصفحة. حاول مرة أخرى.</div>;
    }
    if (status === 'loading' || !src) {
        return <div className="summary-page-skeleton" aria-busy="true" />;
    }
    return (
        <img
            src={src}
            alt={alt || `صفحة ${page}`}
            className="summary-page-img"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
        />
    );
};

export default ProtectedImage;
