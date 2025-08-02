import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveStatusBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const checkStatus = () => {
      // Get current time in Hyderabad timezone (IST)
      const now = new Date();
      const hyderabadTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      const hours = hyderabadTime.getHours();
      const minutes = hyderabadTime.getMinutes();
      
      // Format time for display
      const timeString = hyderabadTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      setCurrentTime(timeString);
      
      // Check if open (11 AM to 12 AM)
      const isCurrentlyOpen = hours >= 11 || hours === 0;
      setIsOpen(isCurrentlyOpen);
    };

    // Check immediately
    checkStatus();
    
    // Check every minute
    const interval = setInterval(checkStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const statusVariants = {
    open: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    closed: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    open: {
      boxShadow: [
        '0 0 20px rgba(34, 197, 94, 0.3)',
        '0 0 30px rgba(34, 197, 94, 0.5)',
        '0 0 20px rgba(34, 197, 94, 0.3)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    closed: {
      boxShadow: [
        '0 0 20px rgba(239, 68, 68, 0.3)',
        '0 0 30px rgba(239, 68, 68, 0.5)',
        '0 0 20px rgba(239, 68, 68, 0.3)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.75rem 0'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Status Indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'open' : 'closed'}
            variants={statusVariants}
            initial="initial"
            animate={isOpen ? "open" : "closed"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              background: isOpen 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isOpen ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: isOpen ? 'var(--color-secondary)' : 'var(--color-accent)',
              fontWeight: '600',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)'
            }}
          >
            <motion.div
              variants={glowVariants}
              animate={isOpen ? "open" : "closed"}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isOpen ? 'var(--color-secondary)' : 'var(--color-accent)'
              }}
            />
            <span>
              {isOpen ? '✅ OPEN NOW' : '⛔ CLOSED NOW'}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Current Time */}
        <div style={{
          color: 'var(--color-white)',
          fontSize: '0.8rem',
          opacity: 0.7,
          fontWeight: '400',
          fontFamily: 'var(--font-body)'
        }}>
          {currentTime} IST
        </div>

        {/* Opening Hours */}
        <div style={{
          color: 'var(--color-white)',
          fontSize: '0.8rem',
          opacity: 0.7,
          fontWeight: '400',
          fontFamily: 'var(--font-body)'
        }}>
          Hours: 11 AM - 12 AM
        </div>
      </div>
    </motion.div>
  );
};

export default LiveStatusBar; 