import React, { useState, useEffect } from 'react';

const BowlingPricing = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const friSun = [
    { label: 'Per Head', price: '₹400/-' },
    { label: '30 min', price: '₹1,500/-', sub: 'Max 4' },
    { label: '60 min', price: '₹3,000/-', sub: 'Max 8' }
  ];
  const monThu = [
    { label: 'Per Head', price: '₹300/-' },
    { label: '30 min', price: '₹1,100/-', sub: 'Max 4' },
    { label: '60 min', price: '₹2,200/-', sub: 'Max 8' }
  ];

  return (
    <section
      id="bowling-pricing"
      style={{
        padding: isMobile ? '1.25rem 1rem' : '1.5rem 1.5rem',
        background: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Bebas Neue, Arial Black, sans-serif',
            fontSize: isMobile ? '1rem' : '1.15rem',
            color: '#fff',
            marginBottom: isMobile ? '0.75rem' : '1rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}
        >
          🎳 Bowling pricing
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr',
            gap: isMobile ? '0.6rem' : '1rem'
          }}
        >
          <div
            style={{
              background: 'rgba(255,0,60,0.12)',
              border: '1px solid rgba(255,0,60,0.25)',
              borderRadius: '10px',
              padding: isMobile ? '0.65rem' : '1rem'
            }}
          >
            <div
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: isMobile ? '0.8rem' : '0.95rem',
                color: '#ff003c',
                letterSpacing: '0.04em',
                marginBottom: isMobile ? '0.4rem' : '0.6rem',
                textAlign: 'center'
              }}
            >
              Fri–Sun & Holidays
            </div>
            {friSun.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: i < friSun.length - 1 ? (isMobile ? '0.3rem' : '0.4rem') : 0,
                  fontSize: isMobile ? '0.7rem' : '0.85rem',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'Manrope, sans-serif'
                }}
              >
                <span>{row.label}{row.sub && ` · ${row.sub}`}</span>
                <span style={{ fontWeight: '700', color: '#ff003c' }}>{row.price}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: 'rgba(0,255,100,0.1)',
              border: '1px solid rgba(0,255,100,0.25)',
              borderRadius: '10px',
              padding: isMobile ? '0.65rem' : '1rem'
            }}
          >
            <div
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: isMobile ? '0.8rem' : '0.95rem',
                color: '#22c55e',
                letterSpacing: '0.04em',
                marginBottom: isMobile ? '0.4rem' : '0.6rem',
                textAlign: 'center'
              }}
            >
              Mon–Thu
            </div>
            {monThu.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: i < monThu.length - 1 ? (isMobile ? '0.3rem' : '0.4rem') : 0,
                  fontSize: isMobile ? '0.7rem' : '0.85rem',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'Manrope, sans-serif'
                }}
              >
                <span>{row.label}{row.sub && ` · ${row.sub}`}</span>
                <span style={{ fontWeight: '700', color: '#22c55e' }}>{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BowlingPricing;
