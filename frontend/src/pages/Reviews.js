import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import ReviewCard from '../components/ReviewCard';
import SeverityBadge from '../components/SeverityBadge';
import DiffModal from '../components/DiffModal';
const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (severity !== 'ALL') params.severity = severity;
      if (debouncedSearch) params.repo = debouncedSearch;
      params.limit = 100;
      const data = await api.getReviews(params);
      setReviews(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [severity, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Reviews</h1>
          <p style={styles.subtitle}>
            {loading ? 'Loading…' : `${reviews.length} review${reviews.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button style={styles.refreshBtn} onClick={load}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M12 7A5 5 0 1 1 7 2a5.05 5.05 0 0 1 3.5 1.4L12 2v4H8l1.6-1.6A3 3 0 1 0 10 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reload
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {/* Severity tabs */}
        <div style={styles.tabs}>
          {SEVERITIES.map(s => (
            <button
              key={s}
              style={{ ...styles.tab, ...(severity === s ? styles.tabActive : {}) }}
              onClick={() => setSeverity(s)}
            >
              {s === 'ALL' ? 'All' : <SeverityBadge severity={s} />}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={styles.searchIcon}>
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 9.5 12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Filter by repo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBanner}>⚠ {error}</div>
      )}

      {/* List */}<div style={styles.list}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12}} />
          ))
        ) : reviews.length === 0 ? (
          <EmptyState severity={severity} search={search} />
        ) : (
          reviews.map((review, i) => (

            <div
              key={`${review.repo}-${review.pr_number}-${i}`}
              onClick={() => {

                console.log("OPENING REVIEW");
                console.log(review);

                setSelectedReview(review);

              }}
              style={{
                cursor: 'pointer',
              }}
              >
          
              <ReviewCard
                review={review}
                index={i}
              />
          
            </div>
          ))
        )}
      </div>

{selectedReview && (

  <DiffModal
    review={selectedReview}
    onClose={() => setSelectedReview(null)}
  />

)}

</div>
);
}

function EmptyState({ severity, search }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 0',
      gap: 12,
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
        <circle cx="24" cy="24" r="22" stroke="var(--text-muted)" strokeWidth="1.5"/>
        <path d="M16 24h16M24 16v16" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>
        No reviews found
        {(severity !== 'ALL' || search) && (
          <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting your filters</div>
        )}
      </div>
  </div>
);
}

const styles = {
  page: { padding: '28px 32px', maxWidth: 1500, animation: 'fadeIn 0.4s ease both' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 38,
    fontWeight: 500,
    letterSpacing: '-0.5px',
  },
  subtitle: { fontSize: 15, color: 'var(--text-muted)', marginTop: 3 },
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
    fontFamily: 'var(--font-body)',
  },
  filters: {
    display: 'flex',
    gap: 12,
    marginBottom: 18,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tabs: {
    display: 'flex',
    gap: 4,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    padding: '5px 12px',
    border: 'none',
    background: 'transparent',
    borderRadius: 7,
    cursor: 'pointer',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    color: 'var(--text-muted)',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 200,
    maxWidth: 320,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '8px 32px 8px 30px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-primary)',
    fontSize: 13,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  clearBtn: {
    position: 'absolute',
    right: 8,
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: 11,
    padding: '2px 4px',
  },
  errorBanner: {
    background: 'var(--critical-bg)',
    border: '1px solid #ff475730',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 12,
    color: 'var(--critical)',
    marginBottom: 16,
    fontFamily: 'var(--font-mono)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
};
