import React, { useEffect, useState, useCallback } from 'react';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { api } from '../api';
import StatCard from '../components/StatCard';

const SEVERITY_COLORS = {
  CRITICAL: '#ff4757',
  HIGH: '#ff7043',
  MEDIUM: '#ffa726',
  LOW: '#26c6da',
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, lastRefresh]);

  const pieData = analytics?.severity_breakdown?.length
    ? analytics.severity_breakdown
    : [{ severity: 'No Data', count: 1 }];

  const barData = [
    { name: 'Critical', value: analytics?.critical_issues ?? 0, fill: SEVERITY_COLORS.CRITICAL },
    { name: 'High', value: analytics?.high_issues ?? 0, fill: SEVERITY_COLORS.HIGH },
    { name: 'Medium', value: analytics?.medium_issues ?? 0, fill: SEVERITY_COLORS.MEDIUM },
    { name: 'Low', value: analytics?.low_issues ?? 0, fill: SEVERITY_COLORS.LOW },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>PR Intelligence Security Monitor Agent</h1>
          <p style={styles.subtitle}>Real-time code quality check</p>
        </div>
        <button style={styles.refreshBtn} onClick={() => setLastRefresh(Date.now())}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7A5 5 0 1 1 7 2a5.05 5.05 0 0 1 3.5 1.4L12 2v4H8l1.6-1.6A3 3 0 1 0 10 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <span>⚠ Backend unreachable — </span>
          <span>{error}</span>
          <span style={styles.errorHint}> · Make sure the backend is running on port 8000</span>
        </div>
      )}

      {/* Stat Cards */}
      <div style={styles.statGrid}>
        <StatCard
          label="Total Reviews"
          value={analytics?.total_reviews}
          loading={loading}
          color="accent"
          sub="All time"
        />
        <StatCard
          label="Critical"
          value={analytics?.critical_issues}
          loading={loading}
          color="critical"
          sub="SQL injection, auth bypass"
        />
        <StatCard
          label="High"
          value={analytics?.high_issues}
          loading={loading}
          color="high"
          sub="Unsafe eval, injection"
        />
        <StatCard
          label="Medium"
          value={analytics?.medium_issues}
          loading={loading}
          color="medium"
          sub="Performance issues"
        />
        <StatCard
          label="Low"
          value={analytics?.low_issues}
          loading={loading}
          color="low"
          sub="Style, maintainability"
        />
      </div>

      {/* Charts row */}
      <div style={styles.chartsRow}>
        {/* Distribution Pie */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Severity Distribution</span>
          </div>
          <div style={styles.chartBody}>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 8 }} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="severity"
                  >
                    {pieData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={SEVERITY_COLORS[entry.severity] || '#5b5bf6'}
                        opacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}
                    formatter={(v, n) => [v, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Legend */}
            <div style={styles.legend}>
              {Object.entries(SEVERITY_COLORS).map(([sev, col]) => (
                <div key={sev} style={styles.legendItem}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{sev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Issues by Severity</span>
          </div>
          <div style={styles.chartBody}>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 8 }} />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barSize={28}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Repos Card */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Active Repositories</span>
          </div>
          <div style={styles.repoList}>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="skeleton" style={{ height: 36, borderRadius: 8, marginBottom: 8 }} />
              ))
            ) : analytics?.recent_repos?.length ? (
              analytics.recent_repos.map((repo, i) => (
                <div key={repo} style={{ ...styles.repoItem, animationDelay: `${i * 80}ms` }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" fill="#5b5bf6"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {repo}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>
                No reviews yet.<br />
                <span style={{ fontSize: 11 }}>Trigger a PR webhook to get started.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={styles.infoRow}>
        {FLOW_STEPS.map((step, i) => (
          <div key={i} style={{ ...styles.flowStep, animationDelay: `${i * 100}ms` }}>
            <div style={styles.flowNum}>{i + 1}</div>
            <div style={styles.flowText}>
              <div style={styles.flowTitle}>{step.title}</div>
              <div style={styles.flowDesc}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FLOW_STEPS = [
  { title: 'GitHub Webhook', desc: 'PR opened or synchronized triggers the agent' },
  { title: 'Fetch PR Diff', desc: 'File diffs pulled from GitHub API' },
  { title: 'AI Analysis', desc: 'Groq AI reviews for bugs, security, performance' },
  { title: 'Auto Comment', desc: 'Actionable review posted directly to the PR' },
];

const styles = {
  page: { padding: '28px 32px', maxWidth: 1280, animation: 'fadeIn 0.4s ease both' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontFamily: 'system-ui',
    marginBottom: 28,
  },
  title: {
    fontFamily: ' serif',
    fontSize:50,
    fontWeight: 600,
    letterSpacing: '-0.5px',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: 20,
    color: 'var(--text-muted)',
    marginTop: 3,
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'serif',
    transition: 'all 0.15s ease',
  },
  errorBanner: {
    background: '#ff475710',
    border: '1px solid #ff475730',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 12,
    color: 'var(--critical)',
    marginBottom: 20,
    fontFamily: 'var(--font-mono)',
  },
  errorHint: { color: 'var(--text-muted)' },
  statGrid: {
    display: 'flex',
    gap: 30,
    marginBottom: 40,
    flexWrap: 'wrap',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 56,
    marginBottom: 20,
  },
  chartCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    animation: 'fadeIn 0.4s ease both',
  },
  chartHeader: {
    padding: '14px 18px 0',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: 12,
  },
  chartTitle: {
    fontFamily: 'Garamond, serif',
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  chartBody: { padding: '12px 8px 16px' },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 14,
    flexWrap: 'wrap',
    marginTop: 8,
    padding: '0 16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  repoList: { padding: '14px 18px' },
  repoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 6,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    marginBottom: 6,
    animation: 'fadeIn 0.3s ease both',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  flowStep: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 18px',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    animation: 'fadeIn 0.4s ease both',
  },
  flowNum: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-accent)',
    color: 'var(--accent-bright)',
    fontFamily: 'sans-serif',
    fontWeight: 800,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  flowText: {},
  flowTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontFamily: 'sans-serif',
    marginBottom: 3,
  },
  flowDesc: {
    fontSize: 11,
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
};
