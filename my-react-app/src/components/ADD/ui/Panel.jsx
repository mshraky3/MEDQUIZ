import React from 'react';
import Icon from '../../common/Icon.jsx';
import './ui.css';

/**
 * Section card with a title/subtitle/actions header. The generic wrapper
 * behind every admin section (money, subscribers, charts, tables) so pages
 * stop re-implementing the same header markup.
 */
const Panel = ({ icon, title, subtitle, actions, wide, className = '', children }) => (
    <section className={`admin-panel${wide ? ' admin-panel--wide' : ''} ${className}`}>
        {(title || actions) && (
            <div className="admin-panel-head">
                <div>
                    {title && (
                        <h2>{icon && <Icon name={icon} size={17} />} {title}</h2>
                    )}
                    {subtitle && <span className="admin-panel-sub">{subtitle}</span>}
                </div>
                {actions && <div className="admin-panel-actions">{actions}</div>}
            </div>
        )}
        {children}
    </section>
);

export default Panel;
