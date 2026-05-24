import React from 'react';

export default function ReviewCard({ review }) {

  const shortReview =
    review.review?.slice(0, 180) + '...';

  return (

    <div style={styles.card}>

      <div style={styles.top}>

        <div style={styles.badge}>
          {review.severity}
        </div>

        <div style={styles.repo}>
          {review.repo}
        </div>

        <div style={styles.pr}>
          PR #{review.pr_number}
        </div>

      </div>

      <div style={styles.preview}>
        {shortReview}
      </div>

      <div style={styles.footer}>
        Click to inspect inline diff →
      </div>

    </div>
  );
}

const styles = {

  card: {
    background: '#141427',
    border: '1px solid #26263d',
    borderRadius: 18,
    padding: 20,
    cursor: 'pointer',
    transition: '0.2s',
  },

  top: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  badge: {
    background: '#ff475720',
    color: '#ff6b81',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },

  repo: {
    color: 'white',
    fontWeight: 600,
  },

  pr: {
    color: '#888',
    fontSize: 13,
  },

  preview: {
    color: '#b8b8d1',
    lineHeight: 1.7,
    fontSize: 14,
  },

  footer: {
    marginTop: 16,
    color: '#7c7cff',
    fontSize: 13,
    fontWeight: 600,
  },
};