import React from 'react';

// Modern Timeline Design - Updated 2024
const TimingsSection = () => {
  return (
    <section id="timings-section" style={{
      padding: '3rem 2rem',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'radial-gradient(circle at 20% 80%, rgba(255, 0, 60, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 255, 100, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Premium Badge */}
        <div style={{
          background: 'linear-gradient(135deg, #ff003c, #ff6b9d)',
          borderRadius: '50px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          padding: '0.8rem 2rem',
          display: 'inline-block',
          margin: '0 auto 2rem',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 8px 32px rgba(255, 0, 60, 0.3)'
        }}>
          <span style={{
            color: '#ffffff',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            fontWeight: '700',
            fontFamily: 'Bebas Neue, Arial Black, sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>⏰ Timings</span>
        </div>

        {/* Main Title */}
        <h2 style={{
          fontFamily: 'Bebas Neue, Arial Black, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '1.5rem',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
          letterSpacing: '0.02em'
        }}>OPENING HOURS</h2>

        {/* Description */}
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto 4rem',
          lineHeight: '1.6'
        }}>
          Plan your visit with our convenient timings and experience the ultimate sports bar atmosphere
        </p>

        {/* Modern Timeline Container */}
        <div style={{
          position: 'relative',
          padding: '2rem 0'
        }}>
          
          {/* Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '3px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
            transform: 'translateX(-50%)',
            borderRadius: '2px'
          }} />

          {/* Sunday - Thursday Timeline Item */}
          <div style={{
            position: 'relative',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Timeline Dot */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00ff64, #00cc51)',
              border: '4px solid rgba(0, 0, 0, 0.8)',
              boxShadow: '0 0 20px rgba(0, 255, 100, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
              zIndex: 2
            }} />
            
            {/* Content Container - Centered on timeline */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
              transition: 'all 0.3s ease'
            }}>
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0, 255, 100, 0.2), rgba(0, 255, 100, 0.1))',
                border: '2px solid rgba(0, 255, 100, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}>🕐</span>
              </div>

              {/* Text Content */}
              <div style={{
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontFamily: 'Bebas Neue, Arial Black, sans-serif',
                  fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.02em'
                }}>SUN-THU</h3>
                
                <div style={{
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
                  color: '#00ff64',
                  fontWeight: '700',
                  fontFamily: 'Bebas Neue, Arial Black, sans-serif',
                  lineHeight: '1.1',
                  textShadow: '0 2px 8px rgba(0, 255, 100, 0.4)',
                  letterSpacing: '0.02em'
                }}>11:00 AM - 11:30 PM</div>
              </div>
            </div>
          </div>

          {/* Friday & Saturday Timeline Item */}
          <div style={{
            position: 'relative',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Timeline Dot */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff003c, #ff6b9d)',
              border: '4px solid rgba(0, 0, 0, 0.8)',
              boxShadow: '0 0 20px rgba(255, 0, 60, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
              zIndex: 2
            }} />
            
            {/* Content Container - Centered on timeline */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
              transition: 'all 0.3s ease'
            }}>
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.2), rgba(255, 0, 60, 0.1))',
                border: '2px solid rgba(255, 0, 60, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}>🕛</span>
              </div>

              {/* Text Content */}
              <div style={{
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontFamily: 'Bebas Neue, Arial Black, sans-serif',
                  fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.02em'
                }}>FRI & SAT</h3>
                
                <div style={{
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
                  color: '#ff003c',
                  fontWeight: '700',
                  fontFamily: 'Bebas Neue, Arial Black, sans-serif',
                  lineHeight: '1.1',
                  textShadow: '0 2px 8px rgba(255, 0, 60, 0.4)',
                  letterSpacing: '0.02em'
                }}>11:00 AM - 12:30 AM</div>
              </div>
            </div>
          </div>

          {/* Final Timeline Dot */}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '0',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
            zIndex: 2
          }} />
        </div>

        {/* Bottom Decoration */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem'
          }}>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #ff003c)'
            }} />
            <span style={{
              color: '#ffffff',
              fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              letterSpacing: '0.02em'
            }}>Ready to experience KIIK 69?</span>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #ff003c, transparent)'
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimingsSection;
