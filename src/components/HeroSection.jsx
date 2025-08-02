import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const pulseVariants = {
    animate: {
      y: [0, 10, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
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
        zIndex: 1
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          onLoadedData={() => setIsVideoLoaded(true)}
          poster="/videos/home-poster.jpg"
        >
          <source src="/videos/home.mp4" type="video/mp4" />
          <source src="/videos/home-optimized.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)',
        zIndex: 2
      }} />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVideoLoaded ? "visible" : "hidden"}
        style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          color: 'var(--color-white)',
          padding: '0 1rem',
          maxWidth: '900px',
          width: '100%'
        }}
      >
        {/* Brand Name - Single Line */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: '2rem'
          }}
        >
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: '400',
            color: 'var(--color-primary)',
            letterSpacing: '0.05em',
            lineHeight: 0.9,
            textShadow: '0 4px 20px rgba(255, 0, 60, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.8)',
            WebkitTextFillColor: 'var(--color-primary)',
            wordSpacing: '0.1em'
          }}>
            KIIK69 SPORTS BAR
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: '400',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff003c 50%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          THE ULTIMATE EXPERIENCE
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
            marginBottom: '3rem',
            fontWeight: '400',
            opacity: 0.9,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            lineHeight: 1.4,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em'
          }}
        >
          Bowling. Beer. Beats. All in One Place.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #ff1a4d 100%)',
            color: 'var(--color-white)',
            border: 'none',
            padding: '1.2rem 3.5rem',
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            fontWeight: '400',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(255, 0, 60, 0.4)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '4rem'
          }}
          onClick={() => {
            // Scroll to contact section or open booking modal
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label="Book your table at KIIK69 Sports Bar"
        >
          <span style={{
            position: 'relative',
            zIndex: 2
          }}>
            Book Your Table
          </span>
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              backgroundSize: '200% 100%'
            }}
            animate={{
              backgroundPosition: ['-200% 0', '200% 0']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.button>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          color: 'var(--color-white)',
          fontSize: '0.9rem',
          opacity: 0.8,
          textAlign: 'center',
          fontFamily: 'var(--font-body)'
        }}
      >
        <motion.div
          variants={pulseVariants}
          animate="animate"
          style={{ 
            marginBottom: '0.5rem',
            fontSize: '1.5rem'
          }}
        >
          ↓
        </motion.div>
        <span style={{
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontSize: '0.8rem'
        }}>
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
};

export default HeroSection; 