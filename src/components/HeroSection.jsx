import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoExists, setVideoExists] = useState(true);

  useEffect(() => {
    // Check if video file exists
    const checkVideoExists = async () => {
      try {
        const response = await fetch('/videos/hero.mp4', { method: 'HEAD' });
        if (!response.ok) {
          setVideoExists(false);
          setIsVideoLoaded(true); // Show content immediately if video doesn't exist
        }
      } catch (error) {
        console.warn('Video file not found, using fallback background');
        setVideoExists(false);
        setIsVideoLoaded(true);
      }
    };

    checkVideoExists();

    // Show content after a delay, regardless of video status
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '6rem'
    }}>
      {/* Background Video */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' // Fallback background
      }}>
        {videoExists && !videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center',
              opacity: isVideoLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={(e) => {
              console.error('Video loading error:', e);
              setVideoError(true);
              setIsVideoLoaded(true); // Show content even if video fails
            }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Loading indicator */}
        {!isVideoLoaded && !videoError && videoExists && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--color-white)',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-body)',
            zIndex: 2
          }}>
            Loading...
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)',
        zIndex: 2
      }} />

      {/* Keep content wrapper empty so only video is shown */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVideoLoaded ? 'visible' : 'hidden'}
        style={{ position: 'relative', zIndex: 3 }}
      />

      {/* Scroll Indicator (restored) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          color: 'var(--color-white)',
          fontSize: '0.9rem',
          opacity: 0.85,
          textAlign: 'center',
          fontFamily: 'var(--font-body)'
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}
        >
          ↓
        </motion.div>
        <span style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection; 