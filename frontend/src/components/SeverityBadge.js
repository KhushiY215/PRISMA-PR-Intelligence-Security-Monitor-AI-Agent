import React from 'react';

const COLORS = {

  CRITICAL: {
    bg: '#ff475720',
    color: '#ff4757',
    border: '#ff475755'
  },

  HIGH: {
    bg: '#ff7f5020',
    color: '#ff7f50',
    border: '#ff7f5055'
  },

  MEDIUM: {
    bg: '#ffa50220',
    color: '#ffa502',
    border: '#ffa50255'
  },

  LOW: {
    bg: '#2ed57320',
    color: '#2ed573',
    border: '#2ed57355'
  }

};

export default function SeverityBadge({
  severity
}) {

  const style =
    COLORS[severity] || COLORS.LOW;

  return (

    <span
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {severity}
    </span>
  );
}