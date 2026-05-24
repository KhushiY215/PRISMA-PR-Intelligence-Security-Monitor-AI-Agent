import React from 'react';

export default function StatCard({ label, value, sub, color, loading, icon }) {
  const colorMap = {
    critical: { bg: 'var(--critical-bg)', border: '#ff475730', text: 'var(--critical)' },
    high: { bg: 'var(--high-bg)', border: '#ff704330', text: 'var(--high)' },
    medium: { bg: 'var(--medium-bg)', border: '#ffa72630', text: 'var(--medium)' },
    low: { bg: 'var(--low-bg)', border: '#26c6da30', text: 'var(--low)' },
    accent: { bg: 'var(--accent-glow)', border: 'var(--border-accent)', text: 'var(--accent-bright)' },
    default: { bg: 'var(--bg-elevated)', border: 'var(--border)', text: 'var(--text-primary)' },
  };
  const c = colorMap[color] || colorMap.default;

  return (
    <div style={{ ...styles.card, background: c.bg, border: `1px solid ${c.border}` }}>
      <div style={styles.top}>
        <span style={styles.label}>{label}</span>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      </div>
      {loading ? (
        <div className="skeleton" style={{ height: 36, width: '60%', marginTop: 6 }} />
      ) : (
        <div style={{ ...styles.value, color: c.text }}>{value ?? '—'}</div>
      )}
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  );
}

const styles = {
  card: {
    borderRadius: 'var(--radius)',
    padding: '18px 20px',
    flex: 1,
    minWidth: 140,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    cursor: 'default',
    animation: 'fadeIn 0.4s ease both',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
  },
  value: {
    fontFamily: 'var(--font-display)',
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1.1,
    marginTop: 6,
    letterSpacing: '-1px',
  },
  sub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
};
