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
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          marginTop: '3rem',
          maxWidth: '800px',
          margin: '3rem auto 0 auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🀄</div>
            <h3 style={{
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              fontSize: '1.25rem',
              color: '#ffffff',
              marginBottom: '0.5rem'
            }}>Carroms</h3>
            <p style={{
              fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
              fontSize: '0.9rem',
              color: '#888888',
              lineHeight: '1.4'
            }}>Classic carrom board game for 2-4 players</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎱</div>
            <h3 style={{
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              fontSize: '1.25rem',
              color: '#ffffff',
              marginBottom: '0.5rem'
            }}>Pool</h3>
            <p style={{
              fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
              fontSize: '0.9rem',
              color: '#888888',
              lineHeight: '1.4'
            }}>Professional pool table with cues and balls</p>
          </div>
        </div>

        {/* WhatsApp CTA Button */}
        <div style={{
          marginTop: '4rem',
          textAlign: 'center'
        }}>
          <a
            href="https://wa.me/919274696969?text=Hi! I'm interested in playing some games at KIIK 69. Can you tell me about the prices and availability?"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#ffffff',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.3s ease',
              border: '2px solid transparent',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.3)';
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Chat on WhatsApp
          </a>
          
          <p style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#888888',
            fontFamily: 'Manrope, Inter, Segoe UI, Arial, sans-serif'
          }}>
            Get instant pricing and game availability
          </p>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
