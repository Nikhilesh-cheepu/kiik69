import React, { useState, useEffect } from 'react';

const GAMES = [
  { emoji: '🀄', name: 'Carroms' },
  { emoji: '🎱', name: 'Pool' },
  { emoji: '⚽', name: 'Foosball' },
  { emoji: '🎳', name: 'Bowling' },
  { emoji: '🎯', name: 'Darts' },
  { emoji: '♟️', name: 'Chess' }
];

const GamesSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <section
      id="games-section"
      style={{
        padding: isMobile ? '1.5rem 1rem' : '2.5rem 1.5rem',
        background: '#0c0c0c',
        minHeight: 'auto'
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Bebas Neue, Arial Black, sans-serif',
            fontSize: isMobile ? '1.35rem' : 'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight: '400',
            color: '#fff',
            marginBottom: isMobile ? '0.75rem' : '1rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}
        >
          Games & Entertainment
        </h2>
        {!isMobile && (
          <p
            style={{
              fontFamily: 'Manrope, Inter, sans-serif',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.6)',
              margin: '0 auto 1rem',
              textAlign: 'center',
              lineHeight: 1.5
            }}
          >
            Challenge your friends while you eat and drink.
          </p>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? '0.5rem 0.75rem' : '0.6rem 1rem',
            marginTop: isMobile ? '0.75rem' : '1rem'
          }}
        >
          {GAMES.map((g, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: isMobile ? '0.35rem' : '0.5rem',
                padding: isMobile ? '0.35rem 0.6rem' : '0.45rem 0.75rem',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <span style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', lineHeight: 1 }}>{g.emoji}</span>
              <span
                style={{
                  fontFamily: 'Manrope, Inter, sans-serif',
                  fontSize: isMobile ? '0.75rem' : '0.85rem',
                  fontWeight: '500',
                  color: '#fff'
                }}
              >
                {g.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: isMobile ? '1.25rem' : '1.5rem', textAlign: 'center' }}>
          <a
            href="https://wa.me/919274696969?text=Hi! I'm interested in playing some games at KIIK 69. Can you tell me about the prices and availability?"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#25D366',
              color: '#fff',
              padding: isMobile ? '0.6rem 1.1rem' : '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontFamily: 'Manrope, Inter, sans-serif',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: '600',
              transition: 'opacity 0.2s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
