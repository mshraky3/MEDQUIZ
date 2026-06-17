import React from 'react';
import './Spinner.css';

/**
 * The single, canonical loading spinner for the whole app.
 *
 * Replaces the previously scattered, inconsistent spinners (orbital variants,
 * border spinners, per-page @keyframes spin). Uses collision-free `sqb-*`
 * class names so it can never be distorted by other stylesheets.
 *
 * Props:
 *  - size: 'sm' | 'md' | 'lg'   (default 'md')
 *  - label: optional text shown beside / under the spinner
 *  - fullScreen: center it in a tall padded block (page-level loading)
 */
const Spinner = ({ size = 'md', label, fullScreen = false }) => {
    const spinner = (
        <span className={`sqb-spinner sqb-spinner-${size}`} role="status" aria-label={label || 'جاري التحميل'}>
            <span className="sqb-spinner-ring" />
            <span className="sqb-spinner-ring" />
            <span className="sqb-spinner-core" />
        </span>
    );

    if (fullScreen) {
        return (
            <div className="sqb-loading-screen">
                {spinner}
                {label && <p className="sqb-loading-label">{label}</p>}
            </div>
        );
    }

    if (label) {
        return (
            <span className="sqb-loading-inline">
                {spinner}
                <span className="sqb-loading-label">{label}</span>
            </span>
        );
    }

    return spinner;
};

export default Spinner;
