import React, { useState, useEffect } from 'react';

const TimingsSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <section id="timings-section" className="timings-section" style={{
      padding: isMobile ? '1.5rem 1rem' : '3rem 2rem',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255, 0, 60, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 255, 100, 0.08) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(135deg, #ff003c, #ff6b9d)',
          borderRadius: '50px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          padding: isMobile ? '0.5rem 1.25rem' : '0.8rem 2rem',
          display: 'inline-block',
          margin: '0 auto 1rem',
          position: 'relative', left: '50%', transform: 'translateX(-50%)',
          boxShadow: '0 8px 32px rgba(255, 0, 60, 0.3)'
        }}>
          <span style={{
            color: '#fff', fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 2.5vw, 1.1rem)',
            fontWeight: '700', fontFamily: 'Bebas Neue, Arial Black, sans-serif',
            letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>⏰ Timings</span>
        </div>
        <h2 style={{
          fontFamily: 'Bebas Neue, Arial Black, sans-serif',
          fontSize: isMobile ? '1.5rem' : 'clamp(2.5rem, 6vw, 4rem)',
          color: '#fff', textAlign: 'center', marginBottom: isMobile ? '0.75rem' : '1.5rem',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)', letterSpacing: '0.02em'
        }}>OPENING HOURS</h2>
        {!isMobile && (
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center', maxWidth: '700px',
            margin: '0 auto 2rem', lineHeight: '1.6'
          }}>Plan your visit with our convenient timings and experience the ultimate sports bar atmosphere</p>
        )}

        {/* Opening hours: compact grid on mobile, timeline on desktop */}
        {isMobile ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              background: 'rgba(0,255,100,0.1)', border: '1px solid rgba(0,255,100,0.3)', borderRadius: '12px',
              padding: '1rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🕐</div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#fff', letterSpacing: '0.02em' }}>SUN–THU</div>
              <div style={{ fontSize: '0.85rem', color: '#00ff64', fontWeight: '700' }}>11:00 AM – 11:30 PM</div>
            </div>
            <div style={{
              background: 'rgba(255,0,60,0.1)', border: '1px solid rgba(255,0,60,0.3)', borderRadius: '12px',
              padding: '1rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🕛</div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#fff', letterSpacing: '0.02em' }}>FRI & SAT</div>
              <div style={{ fontSize: '0.85rem', color: '#ff003c', fontWeight: '700' }}>11:00 AM – 12:30 AM</div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', padding: '2rem 0' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: '3px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
              transform: 'translateX(-50%)', borderRadius: '2px'
            }} />
            {[
              { icon: '🕐', title: 'SUN-THU', time: '11:00 AM - 11:30 PM', color: '#00ff64', gradient: 'linear-gradient(135deg, #00ff64, #00cc51)' },
              { icon: '🕛', title: 'FRI & SAT', time: '11:00 AM - 12:30 AM', color: '#ff003c', gradient: 'linear-gradient(135deg, #ff003c, #ff6b9d)' }
            ].map((item, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                  width: '20px', height: '20px', borderRadius: '50%', background: item.gradient,
                  border: '4px solid rgba(0,0,0,0.8)', boxShadow: `0 0 20px ${item.color}40`, zIndex: 2
                }} />
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  maxWidth: '500px', width: '100%'
                }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: `${item.color}20`, border: `2px solid ${item.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                  }}><span style={{ fontSize: '2.5rem' }}>{item.icon}</span></div>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', color: '#fff', margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                  <div style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', color: item.color, fontWeight: '700', fontFamily: 'Bebas Neue' }}>{item.time}</div>
                </div>
              </div>
            ))}
            <div style={{
              position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
              width: '16px', height: '16px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
              border: '3px solid rgba(255,255,255,0.2)', zIndex: 2
            }} />
          </div>
        )}

        {!isMobile && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #ff003c)' }} />
              <span style={{ color: '#fff', fontSize: 'clamp(1.1rem, 2.8vw, 1.3rem)', fontFamily: 'Bebas Neue', letterSpacing: '0.02em' }}>Ready to experience KIIK 69?</span>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #ff003c, transparent)' }} />
            </div>
          </div>
        )}

        {/* Bowling Costs - compact on mobile */}
        <div style={{
          marginTop: isMobile ? '2rem' : '5rem',
          paddingTop: isMobile ? '1.5rem' : '4rem',
          borderTop: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #00ff64, #00cc51)',
            borderRadius: '50px', border: '2px solid rgba(255,255,255,0.2)',
            padding: isMobile ? '0.5rem 1rem' : '0.8rem 2rem',
            display: 'inline-block', margin: '0 auto 1rem', position: 'relative', left: '50%', transform: 'translateX(-50%)',
            boxShadow: '0 8px 32px rgba(0, 255, 100, 0.3)'
          }}>
            <span style={{
              color: '#000', fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 2.5vw, 1.1rem)',
              fontWeight: '700', fontFamily: 'Bebas Neue', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>🎳 Bowling</span>
          </div>
          <h2 style={{
            fontFamily: 'Bebas Neue', fontSize: isMobile ? '1.25rem' : 'clamp(2rem, 5vw, 3rem)',
            color: '#fff', textAlign: 'center', marginBottom: isMobile ? '1rem' : '1.5rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)', letterSpacing: '0.02em'
          }}>BOWLING PRICING</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? '0.75rem' : '2rem',
            marginTop: isMobile ? '0' : '2rem',
            maxWidth: '900px',
            margin: isMobile ? '0 auto' : '2rem auto 0'
          }}>
            {/* Friday - Sunday & Holidays Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.15), rgba(255, 0, 60, 0.05))',
              border: '2px solid rgba(255, 0, 60, 0.3)',
              borderRadius: isMobile ? '12px' : '20px',
              padding: isMobile ? '0.75rem' : '2rem',
              boxShadow: '0 8px 32px rgba(255, 0, 60, 0.2)'
            }}>
              <h3 style={{
                fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.9rem' : 'clamp(1.5rem, 3.5vw, 2rem)',
                color: '#ff003c', marginBottom: isMobile ? '0.5rem' : '1.5rem', textAlign: 'center', letterSpacing: '0.02em'
              }}>FRI–SUN & HOLIDAYS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.5rem' : '1rem' }}>
                <div style={{ padding: isMobile ? '0.5rem' : '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.75rem' : '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>Per Head</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: isMobile ? '0.9rem' : 'clamp(1.2rem, 3vw, 1.5rem)', color: '#ff003c', fontWeight: '700' }}>₹400/-</div>
                </div>
                <div style={{ padding: isMobile ? '0.5rem' : '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.75rem' : '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>30 min</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: isMobile ? '0.9rem' : '1.2rem', color: '#ff003c', fontWeight: '700' }}>₹1,500/-</div>
                  <div style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Max 4</div>
                </div>
                <div style={{ padding: isMobile ? '0.5rem' : '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.75rem' : '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>60 min</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: isMobile ? '0.9rem' : '1.2rem', color: '#ff003c', fontWeight: '700' }}>₹3,000/-</div>
                  <div style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Max 8</div>
                </div>
              </div>
            </div>

            {/* Monday - Thursday Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 100, 0.15), rgba(0, 255, 100, 0.05))',
              border: '2px solid rgba(0, 255, 100, 0.3)',
              borderRadius: isMobile ? '12px' : '20px',
              padding: isMobile ? '0.75rem' : '2rem',
              boxShadow: '0 8px 32px rgba(0, 255, 100, 0.2)'
            }}>
              <h3 style={{
                fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.9rem' : 'clamp(1.5rem, 3.5vw, 2rem)',
                color: '#00ff64', marginBottom: isMobile ? '0.5rem' : '1.5rem', textAlign: 'center', letterSpacing: '0.02em'
              }}>MON–THU</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.5rem' : '1rem' }}>
                <div style={{ padding: isMobile ? '0.5rem' : '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.75rem' : '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>Per Head</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: isMobile ? '0.9rem' : 'clamp(1.2rem, 3vw, 1.5rem)', color: '#00ff64', fontWeight: '700' }}>₹300/-</div>
                </div>
                <div style={{ padding: isMobile ? '0.5rem' : '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.75rem' : '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>30 min</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: isMobile ? '0.9rem' : '1.2rem', color: '#00ff64', fontWeight: '700' }}>₹1,100/-</div>
                  <div style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Max 4</div>
                </div>
                <div style={{ padding: isMobile ? '0.5rem' : '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: isMobile ? '0.75rem' : '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>60 min</div>
                  <div style={{ fontFamily: 'Manrope', fontSize: isMobile ? '0.9rem' : '1.2rem', color: '#00ff64', fontWeight: '700' }}>₹2,200/-</div>
                  <div style={{ fontSize: isMobile ? '0.7rem' : '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Max 8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimingsSection;
