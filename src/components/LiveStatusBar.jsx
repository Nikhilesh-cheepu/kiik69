import React, { useState, useEffect } from 'react';

const LiveStatusBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hyderabadTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const hours = hyderabadTime.getHours();
      setIsOpen(hours >= 11 || hours === 0);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.5rem 1rem'
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            background: isOpen ? '#166534' : 'rgba(185, 28, 28, 0.4)',
            border: `1px solid ${isOpen ? '#22c55e' : 'rgba(239, 68, 68, 0.5)'}`,
            color: isOpen ? '#86efac' : '#fca5a5',
            fontWeight: '600',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'currentColor',
              flexShrink: 0
            }}
          />
          {isOpen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span style={{ fontSize: '0.65rem' }}>●</span>
          )}
          <span>{isOpen ? 'OPEN NOW' : 'CLOSED'}</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
          Hours: 11 AM – 12 AM
        </span>
      </div>
    </div>
  );
};

export default LiveStatusBar; 