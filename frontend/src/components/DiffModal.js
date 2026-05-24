import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import ReactDiffViewer from 'react-diff-viewer-continued';

export default function DiffModal({
  review,
  onClose
}) {

  if (!review) return null;

  return (

    <div style={styles.overlay}>

      <div style={styles.modal}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <h2 style={styles.title}>
              Inline PR Review
            </h2>

            <div style={styles.repo}>
              {review.repo} • PR #{review.pr_number}
            </div>

          </div>

          <button
            style={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* AI REVIEW */}

        <div style={styles.reviewContainer}>

          <div style={styles.reviewHeader}>
            AI Review Analysis
          </div>

          <div style={styles.reviewBox}>

            <ReactMarkdown

              remarkPlugins={[remarkGfm]}

              components={{

                h1: ({node, ...props}) => (
                  <h1 style={styles.h1} {...props} />
                ),

                h2: ({node, ...props}) => (
                  <h2 style={styles.h2} {...props} />
                ),

                h3: ({node, ...props}) => (
                  <h3 style={styles.h3} {...props} />
                ),

                p: ({node, ...props}) => (
                  <p style={styles.p} {...props} />
                ),

                li: ({node, ...props}) => (
                  <li style={styles.li} {...props} />
                ),

                table: ({node, ...props}) => (
                  <table style={styles.table} {...props} />
                ),

                th: ({node, ...props}) => (
                  <th style={styles.th} {...props} />
                ),

                td: ({node, ...props}) => (
                  <td style={styles.td} {...props} />
                ),

                code({
                  inline,
                  className,
                  children,
                  ...props
                }) {

                  const match =
                    /language-(\w+)/.exec(className || '');

                  return !inline ? (

                    <SyntaxHighlighter
                      style={oneDark}
                      language={match?.[1] || 'python'}
                      PreTag="div"
                    >

                      {String(children).replace(/\n$/, '')}

                    </SyntaxHighlighter>

                  ) : (

                    <code style={styles.inlineCode}>
                      {children}
                    </code>

                  );
                }

              }}

            >

              {review.review}

            </ReactMarkdown>

          </div>

        </div>

        {/* INLINE DIFFS */}

        {review.files?.map((file, idx) => {

          const patch = file.patch || '';

          const lines = patch.split('\n');

          const oldCode = lines
            .filter(line =>
              line.startsWith('-') &&
              !line.startsWith('---')
            )
            .map(line => line.substring(1))
            .join('\n');

          const newCode = lines
            .filter(line =>
              line.startsWith('+') &&
              !line.startsWith('+++')
            )
            .map(line => line.substring(1))
            .join('\n');

          return (

            <div
              key={idx}
              style={styles.fileBlock}
            >

              <div style={styles.fileHeader}>
                {file.filename}
              </div>

              <ReactDiffViewer
                oldValue={oldCode || 'No removed lines'}
                newValue={newCode || 'No added lines'}
                splitView={true}
                useDarkTheme={true}
                hideLineNumbers={false}
                leftTitle="Removed / Problematic"
                rightTitle="Added / Suggested"
              />

            </div>
          );
        })}

      </div>

    </div>
  );
}

const styles = {

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.82)',
    zIndex: 999999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 30,
  },

  modal: {
    width: '98%',
    maxWidth: '1700px',
    maxHeight: '92vh',
    overflowY: 'auto',
    background: '#0b1020',
    borderRadius: 24,
    border: '1px solid #252b42',
    padding: 32,
    scrollBehavior: 'smooth',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    
  },

  title: {
    color: 'white',
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
  },

  repo: {
    color: '#94a3b8',
    marginTop: 6,
    fontSize: 14,
  },

  closeBtn: {
    border: 'none',
    background: '#1e293b',
    color: 'white',
    width: 44,
    height: 44,
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 18,
  },

  reviewContainer: {
    marginBottom: 32,
  },

  reviewHeader: {
    color: 'white',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 18,
  },

  reviewBox: {
    background: '#151728',
    border: '1px solid #2a2d4f',
    borderRadius: 18,
    padding: 36,
    overflowX: 'auto',
  },

  h1: {
    color: 'white',
    fontSize: 30,
    marginBottom: 16,
  },

  h2: {
    color: '#dce3ff',
    fontSize: 24,
    marginTop: 30,
    marginBottom: 14,
  },

  h3: {
    color: '#b7c5ff',
    fontSize: 20,
    marginTop: 26,
    marginBottom: 12,
  },

  p: {
    color: '#cfd7ff',
    lineHeight: 1.9,
    marginBottom: 16,
    fontSize: 15,
  },

  li: {
    color: '#cfd7ff',
    marginBottom: 10,
    lineHeight: 1.8,
    fontSize: 15,
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 14,
  },

  th: {
    background: '#232745',
    color: 'white',
    textAlign: 'left',
    padding: 14,
    border: '1px solid #34395e',
  },

  td: {
    background: '#181b31',
    color: '#d6ddff',
    padding: 14,
    border: '1px solid #2f3457',
  },

  inlineCode: {
    background: '#242844',
    color: '#7ee787',
    padding: '3px 8px',
    borderRadius: 6,
    fontSize: 13,
  },

  fileBlock: {
    marginBottom: 36,
  },

  fileHeader: {
    color: '#8b9cff',
    fontWeight: 700,
    marginBottom: 14,
    fontSize: 16,
  },

};