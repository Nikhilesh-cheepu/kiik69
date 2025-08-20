import React from 'react';

const GamesSection = () => {
  return (
    <section style={{
      padding: '80px 2rem',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      minHeight: '60vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Bebas Neue, Arial Black, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: '400',
          color: '#ff003c',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: '0 4px 20px rgba(255, 0, 60, 0.3)'
        }}>
          GAMES & ENTERTAINMENT
        </h2>

        <p style={{
          fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
          lineHeight: 1.6,
          color: '#ffffff',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 3rem auto',
          fontWeight: '400'
        }}>
          Challenge your friends to exciting games while enjoying great food and drinks!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '0.5rem'
            }}>Carroms</h3>
            <p style={{
              fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
              fontSize: '1rem',
              color: '#888888',
              marginBottom: '1rem'
            }}>Classic carrom board game for 2-4 players</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎱</div>
            <h3 style={{
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '0.5rem'
            }}>Pool</h3>
            <p style={{
              fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
              fontSize: '1rem',
              color: '#888888',
              marginBottom: '1rem'
            }}>Professional pool table with cues and balls</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
            <h3 style={{
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              fontSize: '1.5rem',
              color: '#ffffff',
              marginBottom: '0.5rem'
            }}>Foosball</h3>
            <p style={{
              fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
              fontSize: '1rem',
              color: '#888888',
              marginBottom: '1rem'
            }}>Fast-paced table football game</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
