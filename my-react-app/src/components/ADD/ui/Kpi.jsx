import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../common/Icon.jsx';
import './ui.css';

/**
 * A single headline number tile. Used for every "strip" of KPIs across the
 * admin panel (money, subscribers, users) so they share one visual language
 * instead of each page inventing its own stat-card markup.
 *
 * @param {string} icon - Icon name (see common/Icon.jsx)
 * @param {string} label
 * @param {string|number} value
 * @param {string} [sub] - small line under the value
 * @param {'positive'|'negative'|'neutral'|'warning'} [tone]
 * @param {string} [to] - if set, the tile is clickable and navigates here
 */
const Kpi = ({ icon, label, value, sub, tone = 'neutral', to }) => {
    const navigate = useNavigate();
    const clickable = !!to;
    return (
        <div
            className={`admin-kpi admin-kpi--${tone}${clickable ? ' is-clickable' : ''}`}
            onClick={clickable ? () => navigate(to) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
        >
            {icon && (
                <span className="admin-kpi-ic"><Icon name={icon} size={18} /></span>
            )}
            <div className="admin-kpi-body">
                <span className="admin-kpi-value"><bdi>{value}</bdi></span>
                <span className="admin-kpi-label">{label}</span>
                {sub && <span className="admin-kpi-sub">{sub}</span>}
            </div>
        </div>
    );
};

export default Kpi;
