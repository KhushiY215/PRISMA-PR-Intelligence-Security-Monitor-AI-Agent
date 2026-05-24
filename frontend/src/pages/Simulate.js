import React, { useState } from 'react';
import { api } from '../api';
import SeverityBadge from '../components/SeverityBadge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SAMPLE_PAYLOAD = {
  action: 'opened',
  repository: { full_name: 'your-org/your-repo' },
  pull_request: { number: 42 },
};

export default function Simulate() {
  const [repo, setRepo] = useState('your-org/your-repo');
  const [prNumber, setPrNumber] = useState('42');
  const [action, setAction] = useState('opened');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const payload = {
        action,
        repository: { full_name: repo },
        pull_request: { number: parseInt(prNumber, 10) || 1 },
      };
      const data = await api.triggerWebhook(payload);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Simulate PR</h1>
        <p style={styles.subtitle}>Manually trigger the AI review agent for any pull request</p>
      </div>

      <div style={styles.layout}>
        {/* Form */}
        <div style={styles.formCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Webhook Payload</span>
            <span style={styles.cardBadge}>POST /webhook/github</span>
          </div>

          <div style={styles.formBody}>
            <Field label="Repository" hint="format: owner/repo">
              <input
                style={styles.input}
                value={repo}
                onChange={e => setRepo(e.target.value)}
                placeholder="your-org/your-repo"
              />
            </Field>

            <Field label="PR Number">
              <input
                style={styles.input}
                type="number"
                value={prNumber}
                onChange={e => setPrNumber(e.target.value)}
                placeholder="42"
              />
            </Field>

            <Field label="Action">
              <div style={styles.radioGroup}>
                {['opened', 'synchronize'].map(a => (
                  <label key={a} style={styles.radioLabel}>
                    <input
                      type="radio"
                      value={a}
                      checked={action === a}
                      onChange={() => setAction(a)}
                      style={styles.radio}
                    />
                    <span style={styles.radioText}>{a}</span>
                  </label>
                ))}
              </div>
            </Field>

            {/* JSON Preview */}
            <div style={styles.jsonPreview}>
              <div style={styles.jsonLabel}>Preview</div>
              <pre style={styles.jsonCode}>
                {JSON.stringify({ action, repository: { full_name: repo }, pull_request: { number: parseInt(prNumber) || 0 } }, null, 2)}
              </pre>
            </div>

            <button
              style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
              onClick={handleSubmit}
              disabled={loading || !repo || !prNumber}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Running AI Review…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polygon points="3,2 11,7 3,12" fill="currentColor"/>
                  </svg>
                  Trigger Review
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        <div style={styles.resultCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Response</span>
            {result && <span style={styles.successBadge}>✓ Success</span>}
          </div>

          <div style={styles.resultBody}>
            {error && (
              <div style={styles.errorBox}>
                <div style={styles.errorTitle}>Error</div>
                <div style={styles.errorText}>{error}</div>
                <div style={styles.errorHints}>
                  <b>Troubleshoot:</b>
                  <ul>
                    <li>Ensure backend is running: <code>uvicorn app.main:app --reload</code></li>
                    <li>Check that GITHUB_TOKEN and GROQ_API_KEY are set in <code>.env</code></li>
                    <li>Make sure the repo and PR number exist on GitHub</li>
                  </ul>
                </div>
              </div>
            )}

            {loading && (
              <div style={styles.loadingState}>
                <div style={styles.loadingSpinner} />
                <div style={styles.loadingSteps}>
                  {['Fetching PR diff from GitHub…', 'Sending code to Groq AI…', 'Generating review comments…', 'Posting to PR…'].map((step, i) => (
                    <div key={i} style={{ ...styles.loadingStep, animationDelay: `${i * 800}ms` }}>
                      <div style={styles.loadingDot} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && !loading && (
              <div style={styles.successBox}>
                <div style={styles.successIcon}>✓</div>
                <div>
                  <div style={styles.successTitle}>Review Completed</div>
                  <div style={styles.successText}>{result.message}</div>
                  <div style={styles.successMeta}>
                    The AI review has been posted as a comment on PR #{prNumber} in <strong>{repo}</strong>.
                    Go to the Reviews tab to see the stored analysis.
                  </div>
                </div>
              </div>
            )}

            {!error && !loading && !result && (
              <div style={styles.placeholder}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.2">
                  <circle cx="20" cy="20" r="18" stroke="var(--text-muted)" strokeWidth="1.5"/>
                  <polygon points="15,13 28,20 15,27" fill="var(--text-muted)"/>
                </svg>
                <span style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 10 }}>
                  Submit the form to trigger a review
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={styles.infoCard}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>Setup Guide</span>
        </div>
        <div style={styles.infoGrid}>
          {SETUP_STEPS.map((step, i) => (
            <div key={i} style={styles.infoStep}>
              <div style={styles.infoNum}>{i + 1}</div>
              <div>
                <div style={styles.infoTitle}>{step.title}</div>
                <code style={styles.infoCode}>{step.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
        {label} {hint && <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 10, color: 'var(--text-muted)', opacity: 0.7 }}>· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

const SETUP_STEPS = [
  { title: 'Create .env file in backend/', code: 'GITHUB_TOKEN=ghp_... \nGROQ_API_KEY=gsk_...' },
  { title: 'Install dependencies', code: 'pip install -r requirements.txt' },
  { title: 'Start backend server', code: 'cd backend && uvicorn app.main:app --reload' },
  { title: 'Add webhook in GitHub', code: 'Payload URL: http://your-server/webhook/github' },
];

const styles = {
  page: { padding: '28px 32px', maxWidth: 1100, animation: 'fadeIn 0.4s ease both' },
  header: { marginBottom: 24 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.8px' },
  subtitle: { fontSize: 13, color: 'var(--text-muted)', marginTop: 3 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  formCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  resultCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '14px 18px',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cardBadge: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-bright)', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', borderRadius: 4, padding: '2px 7px' },
  successBadge: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--success)', background: 'var(--success-bg)', border: '1px solid #66bb6a30', borderRadius: 4, padding: '2px 7px' },
  formBody: { padding: '20px 20px 24px' },
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
    transition: 'border-color 0.15s',
  },
  radioGroup: { display: 'flex', gap: 8 },
  radioLabel: { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },
  radio: { accentColor: 'var(--accent)' },
  radioText: { fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' },
  jsonPreview: {
    background: 'var(--bg-base)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 8,
    marginBottom: 18,
    overflow: 'hidden',
  },
  jsonLabel: { padding: '6px 12px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  jsonCode: {
    padding: '12px 14px',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: 0,
    overflow: 'auto',
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    transition: 'opacity 0.15s, transform 0.15s',
    letterSpacing: '0.3px',
  },
  submitBtnLoading: { opacity: 0.7, cursor: 'not-allowed' },
  spinner: {
    width: 13,
    height: 13,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  resultBody: {
    padding: '20px',
    minHeight: 240,
    display: 'flex',
    flexDirection: 'column',
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    alignItems: 'center',
    paddingTop: 20,
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    border: '2px solid var(--border)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingSteps: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
  loadingStep: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    animation: 'fadeIn 0.4s ease both',
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
    animation: 'pulse-ring 1.5s ease infinite',
  },
  errorBox: {
    background: 'var(--critical-bg)',
    border: '1px solid #ff475730',
    borderRadius: 8,
    padding: '14px 16px',
  },
  errorTitle: { fontSize: 12, fontWeight: 700, color: 'var(--critical)', marginBottom: 4, fontFamily: 'var(--font-display)' },
  errorText: { fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--critical)', marginBottom: 10 },
  errorHints: {
    fontSize: 11,
    color: 'var(--text-muted)',
    lineHeight: 1.8,
  },
  successBox: {
    display: 'flex',
    gap: 14,
    background: 'var(--success-bg)',
    border: '1px solid #66bb6a30',
    borderRadius: 8,
    padding: '16px',
  },
  successIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#66bb6a20',
    border: '1px solid #66bb6a40',
    color: 'var(--success)',
    fontFamily: 'var(--font-mono)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  successTitle: { fontSize: 14, fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-display)', marginBottom: 4 },
  successText: { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 },
  successMeta: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 },
  infoCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, padding: '8px' },
  infoStep: { padding: '14px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' },
  infoNum: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-accent)',
    color: 'var(--accent-bright)',
    fontSize: 10,
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTitle: { fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 },
  infoCode: { display: 'block', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
};
