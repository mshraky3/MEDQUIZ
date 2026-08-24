import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import './AdminLayout.css';

/**
 * Replaces AdminNavbar.jsx. Every /admin/* page renders through this —
 * previously ADDQ and Bank had NO nav at all (dead end, browser-back only),
 * and the rest each hand-rolled the same links. One layout, one nav.
 *
 * Grouped "easy access buttons": Insights (read the business) vs Manage
 * (change data). Groups are visually separated but every link is always
 * one click away — nothing is nested behind a menu.
 */
const GROUPS = [
    {
        label: 'Insights',
        links: [
            { path: '/admin', label: 'Overview', icon: 'home' },
            { path: '/admin/growth', label: 'Growth', icon: 'trending-up' },
            { path: '/admin/behavior', label: 'Behaviour', icon: 'brain' },
            { path: '/admin/accounting', label: 'Accounting', icon: 'bar-chart' },
        ],
    },
    {
        label: 'Manage',
        links: [
            { path: '/admin/users', label: 'Users', icon: 'user' },
            { path: '/admin/questions', label: 'Add Questions', icon: 'plus' },
            { path: '/admin/bank', label: 'Question Bank', icon: 'book-open' },
            { path: '/admin/reports', label: 'Reports', icon: 'flag' },
            { path: '/admin/links', label: 'Temp Links', icon: 'link' },
            { path: '/admin/email', label: 'Bulk Email', icon: 'send' },
        ],
    },
];

const ALL_LINKS = GROUPS.flatMap((g) => g.links);

/**
 * @param {boolean} [bare] - skip the white `.admin-container` padding/background
 * so a page that manages its own full-bleed background (e.g. QuestionReports'
 * dark theme) isn't boxed inside a white panel.
 */
const AdminLayout = ({ children, containerClassName = '', bare = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => (
        path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)
    );

    const handleGoBack = () => navigate('/');

    return (
        <div className="admin-page-wrapper">
            <nav className="admin-navbar">
                <div className="admin-navbar-content">
                    <div className="admin-navbar-brand">
                        <span className="admin-navbar-icon"><Icon name="settings" size={18} /></span>
                        <span className="admin-navbar-title">Admin Panel</span>
                    </div>

                    <div className="admin-navbar-groups">
                        {GROUPS.map((group) => (
                            <div className="admin-navbar-group" key={group.label}>
                                <span className="admin-navbar-group-label">{group.label}</span>
                                <div className="admin-navbar-group-links">
                                    {group.links.map((link) => (
                                        <button
                                            key={link.path}
                                            className={`admin-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                            onClick={() => navigate(link.path)}
                                        >
                                            <Icon name={link.icon} size={16} /> {link.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="admin-back-btn" onClick={handleGoBack}>
                        ← Site
                    </button>

                    <button
                        className="admin-menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
                    </button>
                </div>

                <div className={`admin-mobile-menu ${menuOpen ? 'open' : ''}`}>
                    {ALL_LINKS.map((link) => (
                        <button
                            key={link.path}
                            className={`admin-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={() => { navigate(link.path); setMenuOpen(false); }}
                        >
                            <span className="mobile-link-icon"><Icon name={link.icon} size={18} /></span>
                            {link.label}
                        </button>
                    ))}
                    <button className="admin-mobile-link back" onClick={() => { handleGoBack(); setMenuOpen(false); }}>
                        <span className="mobile-link-icon">←</span>
                        Back to site
                    </button>
                </div>
            </nav>

            {bare ? children : (
                <div className={`admin-container ${containerClassName}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
