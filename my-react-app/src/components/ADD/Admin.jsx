import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import AdminNavbar from './AdminNavbar.jsx';

const API = import.meta.env.VITE_API;

// Simple animated number component
const AnimatedNumber = ({ value, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

// Mini Bar Chart Component
const MiniBarChart = ({ data, dataKey, labelKey, color = '#22d3ee', height = 120 }) => {
  if (!data || data.length === 0) return <div className="no-chart-data">No data available</div>;

  const maxValue = Math.max(...data.map(d => Number(d[dataKey]) || 0));

  return (
    <div className="mini-bar-chart" style={{ height }}>
      {data.map((item, idx) => {
        const value = Number(item[dataKey]) || 0;
        const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div key={idx} className="mini-bar-item">
            <div className="mini-bar-wrapper">
              <div
                className="mini-bar"
                style={{
                  height: `${barHeight}%`,
                  background: color
                }}
              >
                <span className="mini-bar-value">{value}</span>
              </div>
            </div>
            <span className="mini-bar-label">{item[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
};

// Line Chart Component
const LineChart = ({ data, dataKey, labelKey, color = '#22d3ee', height = 150 }) => {
  if (!data || data.length === 0) return <div className="no-chart-data">No data available</div>;

  const values = data.map(d => Number(d[dataKey]) || 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1 || 1)) * 100;
    const y = 100 - ((values[idx] - minValue) / range) * 80 - 10;
    return { x, y, value: values[idx], label: item[labelKey] };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} 100 L 0 100 Z`;

  return (
    <div className="line-chart" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#gradient-${dataKey})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} className="chart-point">
            <title>{p.label}: {p.value}</title>
          </circle>
        ))}
      </svg>
      <div className="line-chart-labels">
        {points.filter((_, i) => i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)).map((p, i) => (
          <span key={i} style={{ left: `${p.x}%` }}>{p.label}</span>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data, valueKey, labelKey, colors, size = 120 }) => {
  if (!data || data.length === 0) return <div className="no-chart-data">No data</div>;

  const total = data.reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0);
  const defaultColors = ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'];
  const chartColors = colors || defaultColors;

  let cumulative = 0;
  const segments = data.map((item, idx) => {
    const value = Number(item[valueKey]) || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const startAngle = (cumulative / 100) * 360;
    cumulative += percentage;
    const endAngle = (cumulative / 100) * 360;
    return { ...item, percentage, startAngle, endAngle, color: chartColors[idx % chartColors.length] };
  });

  const createArcPath = (startAngle, endAngle, radius, innerRadius) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    const x3 = 50 + innerRadius * Math.cos(endRad);
    const y3 = 50 + innerRadius * Math.sin(endRad);
    const x4 = 50 + innerRadius * Math.cos(startRad);
    const y4 = 50 + innerRadius * Math.sin(startRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="donut-chart-container">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {segments.map((seg, idx) => (
          <path
            key={idx}
            d={createArcPath(seg.startAngle, seg.endAngle - 0.5, 45, 28)}
            fill={seg.color}
            className="donut-segment"
          >
            <title>{seg[labelKey]}: {seg[valueKey]} ({seg.percentage.toFixed(1)}%)</title>
          </path>
        ))}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="donut-center-text">
          {total}
        </text>
      </svg>
      <div className="donut-legend">
        {segments.slice(0, 5).map((seg, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color" style={{ background: seg.color }} />
            <span className="legend-label">{seg[labelKey]}</span>
            <span className="legend-value">{seg.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Progress Ring Component
const ProgressRing = ({ value, max = 100, size = 80, strokeWidth = 8, color = '#22d3ee' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="progress-ring-value">{percentage.toFixed(0)}%</div>
    </div>
  );
};

// Horizontal Bar Chart
const HorizontalBarChart = ({ data, valueKey, labelKey, color = '#22d3ee' }) => {
  if (!data || data.length === 0) return <div className="no-chart-data">No data</div>;

  const maxValue = Math.max(...data.map(d => Number(d[valueKey]) || 0));

  return (
    <div className="horizontal-bar-chart">
      {data.slice(0, 6).map((item, idx) => {
        const value = Number(item[valueKey]) || 0;
        const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div key={idx} className="h-bar-item">
            <div className="h-bar-info">
              <span className="h-bar-label">{item[labelKey]}</span>
              <span className="h-bar-value">{value.toLocaleString()}</span>
            </div>
            <div className="h-bar-track">
              <div className="h-bar-fill" style={{ width: `${width}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Activity Heatmap (by hour)
const HourlyHeatmap = ({ data, valueKey = 'count' }) => {
  if (!data || data.length === 0) return <div className="no-chart-data">No data</div>;

  const hours = Array.from({ length: 24 }, (_, i) => {
    const found = data.find(d => Number(d.hour) === i);
    return { hour: i, count: found ? Number(found[valueKey]) : 0 };
  });

  const maxValue = Math.max(...hours.map(h => h.count));

  return (
    <div className="hourly-heatmap">
      <div className="heatmap-grid">
        {hours.map((h, idx) => {
          const intensity = maxValue > 0 ? h.count / maxValue : 0;
          return (
            <div
              key={idx}
              className="heatmap-cell"
              style={{
                background: `rgba(34, 211, 238, ${intensity * 0.8 + 0.1})`,
                opacity: intensity > 0 ? 1 : 0.3
              }}
              title={`${h.hour}:00 - ${h.count} activities`}
            >
              <span className="heatmap-hour">{h.hour}</span>
            </div>
          );
        })}
      </div>
      <div className="heatmap-labels">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/admin/stats`);
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Auto refresh every 2 minutes
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Process chart data
  const processedLoginData = useMemo(() => {
    if (!stats?.charts?.loginsByDay) return [];
    return stats.charts.loginsByDay.map(d => ({
      ...d,
      label: formatDate(d.date),
      count: Number(d.count)
    }));
  }, [stats]);

  const processedUserGrowth = useMemo(() => {
    if (!stats?.charts?.userGrowth) return [];
    return stats.charts.userGrowth.map(d => ({
      ...d,
      label: formatDate(d.week),
      count: Number(d.count)
    }));
  }, [stats]);

  const processedQuizGrowth = useMemo(() => {
    if (!stats?.charts?.quizGrowth) return [];
    return stats.charts.quizGrowth.map(d => ({
      ...d,
      label: formatDate(d.week),
      count: Number(d.count)
    }));
  }, [stats]);

  const adminCards = [
    {
      icon: '👤',
      title: 'User Management',
      description: 'Add new user accounts and manage existing users',
      buttonText: 'Manage Users',
      path: '/ADD_ACCOUNT'
    },
    {
      icon: '❓',
      title: 'Question Bank',
      description: 'Add new questions and manage the question database',
      buttonText: 'Add Questions',
      path: '/ADDQ'
    },
    {
      icon: '📚',
      title: 'Question Library',
      description: 'View and browse all questions in the database',
      buttonText: 'View All Questions',
      path: '/Bank'
    },
    {
      icon: '🔗',
      title: 'Temp Signup Links',
      description: 'Create and manage temporary signup links for free accounts',
      buttonText: 'Manage Links',
      path: '/TEMP_LINKS'
    }
  ];

  if (loading) {
    return (
      <div className="admin-page-wrapper">
        <AdminNavbar />
        <div className="admin-container">
          <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-wrapper">
        <AdminNavbar />
        <div className="admin-container">
          <div className="dashboard-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => setRefreshKey(k => k + 1)}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};

  return (
    <div className="admin-page-wrapper">
      <AdminNavbar />
      <div className="admin-container dashboard-view">

        {/* Quick Actions */}
        <div className="quick-actions-row">
          {adminCards.map((card, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => navigate(card.path)}
            >
              <span className="quick-action-icon">{card.icon}</span>
              <span className="quick-action-label">{card.title}</span>
            </button>
          ))}
          <button
            className="quick-action-btn refresh-btn"
            onClick={() => setRefreshKey(k => k + 1)}
          >
            <span className="quick-action-icon">🔄</span>
            <span className="quick-action-label">Refresh</span>
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="stats-grid-main">
          <div className="stat-card-large primary">
            <div className="stat-card-header">
              <span className="stat-icon">👥</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-value-large">
              <AnimatedNumber value={overview.totalUsers} />
            </div>
            <div className="stat-meta">
              <span className="stat-badge positive">+{overview.newUsersWeek} this week</span>
              <span className="stat-badge neutral">{overview.activeUsers} active (7d)</span>
            </div>
          </div>

          <div className="stat-card-large secondary">
            <div className="stat-card-header">
              <span className="stat-icon">📝</span>
              <span className="stat-label">Total Quizzes</span>
            </div>
            <div className="stat-value-large">
              <AnimatedNumber value={overview.totalQuizzes} />
            </div>
            <div className="stat-meta">
              <span className="stat-badge positive">{overview.quizzesToday} today</span>
              <span className="stat-badge neutral">{overview.quizzesThisWeek} this week</span>
            </div>
          </div>

          <div className="stat-card-large tertiary">
            <div className="stat-card-header">
              <span className="stat-icon">✅</span>
              <span className="stat-label">Questions Answered</span>
            </div>
            <div className="stat-value-large">
              <AnimatedNumber value={overview.totalQuestionsAnswered} />
            </div>
            <div className="stat-meta">
              <span className="stat-badge neutral">~{overview.avgQuestionsPerQuiz} per quiz</span>
            </div>
          </div>

          <div className="stat-card-large highlight">
            <div className="stat-card-header">
              <span className="stat-icon">🎯</span>
              <span className="stat-label">Avg Accuracy</span>
            </div>
            <div className="stat-value-large">
              <AnimatedNumber value={overview.avgAccuracy} suffix="%" />
            </div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${overview.avgAccuracy}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="stats-grid-secondary">
          <div className="stat-card-small">
            <div className="stat-icon-small">🟢</div>
            <div className="stat-info">
              <span className="stat-value-small">{overview.onlineNow}</span>
              <span className="stat-label-small">Online Now</span>
            </div>
          </div>
          <div className="stat-card-small">
            <div className="stat-icon-small">📈</div>
            <div className="stat-info">
              <span className="stat-value-small">{overview.newUsersMonth}</span>
              <span className="stat-label-small">New Users (30d)</span>
            </div>
          </div>
          <div className="stat-card-small">
            <div className="stat-icon-small">🔄</div>
            <div className="stat-info">
              <span className="stat-value-small">{overview.retentionRate}%</span>
              <span className="stat-label-small">Retention Rate</span>
            </div>
          </div>
          <div className="stat-card-small">
            <div className="stat-icon-small">✔️</div>
            <div className="stat-info">
              <span className="stat-value-small">{overview.completionRate}%</span>
              <span className="stat-label-small">Quiz Completion</span>
            </div>
          </div>
          <div className="stat-card-small warning">
            <div className="stat-icon-small">⚠️</div>
            <div className="stat-info">
              <span className="stat-value-small">{overview.suspiciousCount}</span>
              <span className="stat-label-small">Suspicious Users</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Login Activity Chart */}
          <div className="chart-card wide">
            <div className="chart-header">
              <h3>📊 Login Activity (Last 14 Days)</h3>
            </div>
            <LineChart
              data={processedLoginData}
              dataKey="count"
              labelKey="label"
              color="#22d3ee"
              height={160}
            />
          </div>

          {/* Growth Charts */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>👥 User Growth (8 Weeks)</h3>
            </div>
            <MiniBarChart
              data={processedUserGrowth}
              dataKey="count"
              labelKey="label"
              color="#4ade80"
              height={100}
            />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>📝 Quiz Activity (8 Weeks)</h3>
            </div>
            <MiniBarChart
              data={processedQuizGrowth}
              dataKey="count"
              labelKey="label"
              color="#f59e0b"
              height={100}
            />
          </div>

          {/* Device & Browser Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>📱 Device Distribution</h3>
            </div>
            <DonutChart
              data={stats?.charts?.deviceStats || []}
              valueKey="count"
              labelKey="device_type"
              colors={['#22d3ee', '#06b6d4', '#0891b2']}
              size={100}
            />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>🌐 Browser Usage</h3>
            </div>
            <HorizontalBarChart
              data={stats?.charts?.browserStats || []}
              valueKey="count"
              labelKey="browser"
              color="#818cf8"
            />
          </div>

          {/* Hourly Activity Heatmap */}
          <div className="chart-card wide">
            <div className="chart-header">
              <h3>🕐 Activity by Hour (30 Days)</h3>
            </div>
            <HourlyHeatmap
              data={stats?.charts?.hourlyActivity || []}
              valueKey="count"
            />
          </div>

          {/* Topic Performance */}
          <div className="chart-card wide">
            <div className="chart-header">
              <h3>📚 Questions by Topic</h3>
            </div>
            <HorizontalBarChart
              data={stats?.quizzesByTopic || []}
              valueKey="count"
              labelKey="topic"
              color="#22d3ee"
            />
          </div>

          {/* Accuracy Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>🎯 User Accuracy Distribution</h3>
            </div>
            <DonutChart
              data={stats?.charts?.accuracyDistribution || []}
              valueKey="user_count"
              labelKey="range"
              colors={['#ef4444', '#f59e0b', '#4ade80', '#22d3ee']}
              size={100}
            />
          </div>
        </div>

        {/* Leaderboards & Activity Section */}
        <div className="tables-section">
          {/* Top Users */}
          <div className="table-card">
            <div className="table-header">
              <h3>🏆 Top Users by Activity</h3>
            </div>
            <div className="mini-table">
              {stats?.topUsers?.slice(0, 8).map((user, idx) => (
                <div key={user.id} className="mini-table-row">
                  <span className="rank-badge">{idx + 1}</span>
                  <div className="user-info-mini">
                    <span className="username">{user.username}</span>
                    <span className="user-stats">{user.quiz_count} quizzes • {user.avg_accuracy || 0}% avg</span>
                  </div>
                  <span className="questions-count">{user.total_questions_answered || 0} Q</span>
                </div>
              ))}
              {(!stats?.topUsers || stats.topUsers.length === 0) && (
                <div className="empty-state">No user activity yet</div>
              )}
            </div>
          </div>

          {/* Recent Logins */}
          <div className="table-card">
            <div className="table-header">
              <h3>🔐 Recent Logins</h3>
            </div>
            <div className="mini-table">
              {stats?.recentLogins?.slice(0, 8).map((login, idx) => (
                <div key={idx} className="mini-table-row">
                  <div className="login-info">
                    <span className="username">{login.username}</span>
                    <span className="login-device">
                      {login.device_type === 'mobile' ? '📱' : '💻'} {login.browser}
                    </span>
                  </div>
                  <div className="login-meta">
                    <span className="login-time">{formatTimeAgo(login.login_time)}</span>
                    {login.is_suspicious && <span className="suspicious-badge">⚠️</span>}
                  </div>
                </div>
              ))}
              {(!stats?.recentLogins || stats.recentLogins.length === 0) && (
                <div className="empty-state">No login history</div>
              )}
            </div>
          </div>

          {/* Suspicious Activity */}
          <div className="table-card warning-card">
            <div className="table-header">
              <h3>⚠️ Suspicious Activity</h3>
              <button
                className="view-all-btn"
                onClick={() => navigate('/ADD_ACCOUNT')}
              >
                View All →
              </button>
            </div>
            <div className="mini-table">
              {stats?.suspiciousUsers?.slice(0, 5).map((user, idx) => (
                <div key={idx} className="mini-table-row suspicious">
                  <div className="user-info-mini">
                    <span className="username">{user.username}</span>
                    <span className="suspicious-reason">{user.reasons}</span>
                  </div>
                  <div className="suspicious-stats">
                    <span className="ip-count">{user.unique_ips} IPs</span>
                    <span className="device-count">{user.unique_devices} devices</span>
                  </div>
                </div>
              ))}
              {(!stats?.suspiciousUsers || stats.suspiciousUsers.length === 0) && (
                <div className="empty-state success">✅ No suspicious activity detected</div>
              )}
            </div>
          </div>

          {/* Topic Accuracy */}
          <div className="table-card">
            <div className="table-header">
              <h3>📊 Topic Performance</h3>
            </div>
            <div className="mini-table">
              {stats?.charts?.accuracyByTopic?.slice(0, 6).map((topic, idx) => (
                <div key={idx} className="mini-table-row">
                  <span className="topic-name">{topic.topic}</span>
                  <div className="accuracy-bar-container">
                    <div className="accuracy-bar">
                      <div
                        className="accuracy-fill"
                        style={{
                          width: `${topic.avg_accuracy || 0}%`,
                          background: topic.avg_accuracy >= 70 ? '#4ade80' : topic.avg_accuracy >= 50 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="accuracy-value">{topic.avg_accuracy || 0}%</span>
                  </div>
                </div>
              ))}
              {(!stats?.charts?.accuracyByTopic || stats.charts.accuracyByTopic.length === 0) && (
                <div className="empty-state">No topic data</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with last update time */}
        <div className="dashboard-footer">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>Auto-refresh every 2 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default Admin;
