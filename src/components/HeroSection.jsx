import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 0;
        }
        @media (min-width: 768px) {
          .hero-section { height: 100vh; }
          .hero-video-wrap { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
          .hero-video-wrap video { width: 100%; height: 100%; object-fit: cover; object-position: center; }
        }
        @media (max-width: 767px) {
          .hero-section { height: auto; min-height: 0; padding-top: 0; aspect-ratio: 9/16; max-height: 100vh; }
          .hero-video-wrap { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
          .hero-video-wrap video { width: 100%; height: 100%; object-fit: cover; object-position: center; }
        }
      `}</style>
      <section className="hero-section">
        <div
          className="hero-video-wrap"
          style={{
            zIndex: 1,
            background: '#0a0a0a'
          }}
        >
          <video autoPlay muted loop playsInline preload="auto">
            <source src="/hero%20.MP4" type="video/mp4" />
            <source src="/hero.MP4" type="video/mp4" />
            <source src="/videos/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.MP4" type="video/mp4" />
          </video>
        </div>

        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)',
          zIndex: 2, pointerEvents: 'none'
        }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(1.5rem, 4vw, 3rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            color: 'var(--color-white)',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            opacity: 0.9,
            textAlign: 'center',
            fontFamily: 'var(--font-body)'
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '0.25rem', fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}
          >
            ↓
          </motion.div>
          <span style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
            Scroll to explore
          </span>
        </motion.div>
      </section>
    </>
  );
};

export default HeroSection; 