import React, { useState } from 'react';

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || 'http://localhost:8000');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Configure your AI Code Review Agent</p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Backend Connection</div>
        <div style={styles.card}>
          <Field label="Backend API URL">
            <input style={styles.input} value={apiUrl} onChange={e => setApiUrl(e.target.value)} />
            <div style={styles.hint}>Default: http://localhost:8000 — set REACT_APP_API_URL in frontend/.env</div>
          </Field>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Environment Variables</div>
        <div style={styles.card}>
          <div style={styles.envNote}>
            These must be set in <code style={styles.code}>backend/.env</code> — they are never sent to this dashboard.
          </div>
          <div style={styles.envTable}>
            {ENV_VARS.map(v => (
              <div key={v.key} style={styles.envRow}>
                <code style={styles.envKey}>{v.key}</code>
                <span style={styles.envDesc}>{v.desc}</span>
                <a href={v.link} target="_blank" rel="noreferrer" style={styles.envLink}>Get →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Severity Classification</div>
        <div style={styles.card}>
          <div style={styles.envNote}>How the backend classifies review severity (see <code style={styles.code}>app/api/github.py</code>):</div>
          <div style={styles.sevTable}>
            {SEV_RULES.map(r => (
              <div key={r.level} style={styles.sevRow}>
                <span style={{ ...styles.sevBadge, background: r.bg, color: r.color, border: `1px solid ${r.border}` }}>{r.level}</span>
                <code style={styles.sevCondition}>{r.condition}</code>
                <span style={styles.sevDesc}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Architecture</div>
        <div style={styles.card}>
          <div style={styles.archGrid}>
            {ARCH.map((item, i) => (
              <div key={i} style={styles.archItem}>
                <div style={styles.archIcon}>{item.icon}</div>
                <div style={styles.archLabel}>{item.label}</div>
                <div style={styles.archValue}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const ENV_VARS = [
  { key: 'GITHUB_TOKEN', desc: 'GitHub personal access token with repo scope', link: 'https://github.com/settings/tokens' },
  { key: 'GROQ_API_KEY', desc: 'Groq API key for LLM inference', link: 'https://console.groq.com' },
];

const SEV_RULES = [
  { level: 'CRITICAL', condition: '"sql injection" in review', desc: 'Detects SQL injection vulnerabilities', color: '#ff4757', bg: '#ff475715', border: '#ff475730' },
  { level: 'HIGH', condition: '"eval" in review', desc: 'Detects unsafe eval() usage', color: '#ff7043', bg: '#ff704315', border: '#ff704330' },
  { level: 'MEDIUM', condition: '"performance" in review', desc: 'Detects performance bottlenecks', color: '#ffa726', bg: '#ffa72615', border: '#ffa72630' },
  { level: 'LOW', condition: 'default', desc: 'Style, maintainability issues', color: '#26c6da', bg: '#26c6da15', border: '#26c6da30' },
];

const ARCH = [
  { icon: '⚡', label: 'Framework', value: 'FastAPI + Uvicorn' },
  { icon: '🤖', label: 'AI Model', value: 'Groq (openai/gpt-oss-120b)' },
  { icon: '🔗', label: 'Integration', value: 'GitHub Webhooks API' },
  { icon: '💾', label: 'Storage', value: 'JSON file (app/storage/reviews.json)' },
  { icon: '🛡', label: 'Auth', value: 'GitHub Bearer Token' },
  { icon: '🎨', label: 'Frontend', value: 'React 18 + Recharts' },
];

const styles = {
  page: { padding: '28px 32px', maxWidth: 800, animation: 'fadeIn 0.4s ease both' },
  header: { marginBottom: 28 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.8px' },
  subtitle: { fontSize: 13, color: 'var(--text-muted)', marginTop: 3 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 8, fontWeight: 600 },
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' },
  input: {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
    outline: 'none',
    marginBottom: 4,
  },
  hint: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 },
  envNote: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.6 },
  code: { fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' },
  envTable: { display: 'flex', flexDirection: 'column', gap: 6 },
  envRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' },
  envKey: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-bright)', minWidth: 160 },
  envDesc: { fontSize: 12, color: 'var(--text-secondary)', flex: 1 },
  envLink: { fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' },
  sevTable: { display: 'flex', flexDirection: 'column', gap: 6 },
  sevRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' },
  sevBadge: { padding: '2px 8px', borderRadius: 10, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: 72, textAlign: 'center' },
  sevCondition: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', minWidth: 200 },
  sevDesc: { fontSize: 12, color: 'var(--text-secondary)', flex: 1 },
  archGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  archItem: { padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' },
  archIcon: { fontSize: 18, marginBottom: 6 },
  archLabel: { fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)', marginBottom: 3 },
  archValue: { fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' },
};
