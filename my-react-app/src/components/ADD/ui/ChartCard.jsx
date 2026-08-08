import React from 'react';
import Panel from './Panel.jsx';
import './ui.css';

/**
 * Panel + shared loading/empty/error states for a chart. The chart itself
 * (a recharts <ResponsiveContainer>...</ResponsiveContainer>, or any other
 * node) is passed as children — this component only owns the chrome around it.
 */
const ChartCard = ({
    icon, title, subtitle, actions, wide,
    loading, error, empty, emptyLabel = 'No data yet', height = 240,
    children,
}) => (
    <Panel icon={icon} title={title} subtitle={subtitle} actions={actions} wide={wide} className="admin-chart-card">
        <div style={{ height }}>
            {loading ? (
                <div className="admin-chart-state">Loading…</div>
            ) : error ? (
                <div className="admin-chart-state admin-chart-state--error">{error}</div>
            ) : empty ? (
                <div className="admin-chart-state">{emptyLabel}</div>
            ) : children}
        </div>
    </Panel>
);

export default ChartCard;
