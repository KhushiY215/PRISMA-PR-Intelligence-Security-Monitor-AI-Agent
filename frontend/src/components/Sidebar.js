import React from 'react';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'reviews', label: 'Reviews', icon: '⬡' },
  { id: 'simulate', label: 'Simulate PR', icon: '⬡' },
  { id: 'settings', label: 'Settings', icon: '⬡' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoMark}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <polygon points="11,2 20,7 20,15 11,20 2,15 2,7" stroke="#5b5bf6" strokeWidth="1.5" fill="none"/>
            <polygon points="11,6 16,9 16,13 11,16 6,13 6,9" fill="#5b5bf6" opacity="0.4"/>
            <circle cx="11" cy="11" r="2" fill="#7c7cff"/>
          </svg>
        </div>
        <div>
          <div style={styles.logoName}>PRISMA</div>
          <div style={styles.logoSub}>AI Code Review Agent</div>
        </div>
      </div>

      {/* Status dot */}
      <div style={styles.statusBar}>
        <div style={styles.statusDot}>
          <div style={styles.statusRing} />
        </div>
        <span style={styles.statusText}>Agent Active</span>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...styles.navItem,
              ...(active === item.id ? styles.navItemActive : {}),
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={styles.navIcon}>
              {item.id === 'dashboard' && (
                <>
                  <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                </>
              )}
              {item.id === 'reviews' && (
                <>
                  <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="13" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M14.8 12.8 16 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </>
              )}
              {item.id === 'simulate' && (
                <>
                  <path d="M8 2v12M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 14h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </>
              )}
              {item.id === 'settings' && (
                <>
                  <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </>
              )}
            </svg>
            <span>{item.label}</span>
            {active === item.id && <div style={styles.activeBar} />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={styles.sidebarFooter}>
        <div style={styles.footerBadge}>
          <span style={styles.footerBadgeText}></span>
        </div>
        <span style={styles.footerText}>Platform By Khushi</span>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    height: '100vh',
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'sticky',
    top: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 20px 24px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  logoMark: {
    width: 36,
    height: 36,
    background: 'var(--accent-glow)',
    border: '1px solid var(--border-accent)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoName: {
    fontFamily: 'cursive',
    fontWeight: 500,
    fontSize: 18,
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 20px',
    margin: '8px 12px',
    background: '#66bb6a08',
    border: '1px solid #66bb6a20',
    borderRadius: 8,
  },
  statusDot: {
    position: 'relative',
    width: 8,
    height: 8,
  },
  statusRing: {
    position: 'absolute',
    inset: 0,
    background: 'var(--success)',
    borderRadius: '50%',
    boxShadow: '0 0 6px var(--success)',
    animation: 'pulse-ring 2s ease infinite',
  },
  statusText: {
    fontSize: 11,
    color: 'var(--success)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
  },
  nav: {
    flex: 1,
    padding: '12px 12px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    textAlign: 'left',
    transition: 'all 0.15s ease',
    letterSpacing: '0.1px',
  },
  navItemActive: {
    background: 'var(--accent-glow)',
    color: 'var(--accent-bright)',
    fontWeight: 500,
  },
  navIcon: {
    flexShrink: 0,
    opacity: 0.7,
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: '25%',
    height: '50%',
    width: 2,
    background: 'var(--accent-bright)',
    borderRadius: '2px 0 0 2px',
  },
  sidebarFooter: {
    padding: '16px 20px 0',
    borderTop: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  footerBadge: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 6px',
  },
  footerBadgeText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text-muted)',
  },
  footerText: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
};
