import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const UnderConstruction = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 0, 60, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(125, 42, 232, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          zIndex: 10
        }}
      >
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <img 
            src="/logos/logo.PNG" 
            alt="KIIK 69 Logo" 
            style={{
              height: 'clamp(80px, 15vw, 120px)',
              width: 'auto',
              marginBottom: '2rem',
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
            }}
          />
        </motion.div>

        {/* Main Message */}
        <motion.h1 
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #ff003c 50%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 0, 60, 0.5)'
          }}
        >
          🚧 Our website is currently under construction
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: '#cccccc',
            marginBottom: '3rem',
            lineHeight: 1.6
          }}
        >
          We'll be back online soon with a brand new experience!
        </motion.p>

        {/* Opening Hours */}
        <motion.div 
          variants={itemVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <motion.div
            variants={pulseVariants}
            animate="animate"
            style={{
              display: 'inline-block',
              fontSize: '2rem',
              marginBottom: '1rem'
            }}
          >
            ⏰
          </motion.div>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 4vw, 2rem)',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#ff003c'
          }}>
            Opening Hours
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#ffffff',
            margin: 0
          }}>
            11 AM to 12 AM
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem'
          }}
        >
          <motion.a
            href="tel:+919274696969"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              background: 'rgba(255, 0, 60, 0.1)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#ffffff',
              border: '1px solid rgba(255, 0, 60, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <FaPhone style={{ fontSize: '1.2rem' }} />
            <span>+91 92746 96969</span>
          </motion.a>

          <motion.a
            href="https://maps.app.goo.gl/jMMuHgGinp6JUSmHA"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              background: 'rgba(125, 42, 232, 0.1)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#ffffff',
              border: '1px solid rgba(125, 42, 232, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <FaMapMarkerAlt style={{ fontSize: '1.2rem' }} />
            <span>Find Us</span>
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <motion.a
            href="https://www.instagram.com/kiik69sportsbar.gachibowli"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              borderRadius: '50%',
              textDecoration: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              boxShadow: '0 4px 15px rgba(220, 39, 67, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <FaInstagram />
          </motion.a>

          <motion.a
            href="https://maps.app.goo.gl/jMMuHgGinp6JUSmHA"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              background: 'linear-gradient(45deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%)',
              borderRadius: '50%',
              textDecoration: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <FaMapMarkerAlt />
          </motion.a>
        </motion.div>

        {/* Footer Message */}
        <motion.p 
          variants={itemVariants}
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            color: '#888888',
            margin: 0,
            fontStyle: 'italic'
          }}
        >
          Stay tuned for our brand new website! 🍻
        </motion.p>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @media (max-width: 768px) {
          *:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UnderConstruction; 