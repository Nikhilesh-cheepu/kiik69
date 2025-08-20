import React from 'react';
import { motion } from 'framer-motion';

const ChatNavigationButtons = ({ buttons, onButtonClick }) => {
  if (!buttons || buttons.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      style={{
        marginTop: '1rem',
        marginBottom: '1rem'
      }}
    >
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--color-gray)',
        marginBottom: '1rem',
        fontFamily: 'var(--font-body)',
        textAlign: 'center',
        opacity: 0.8
      }}>
        💡 Quick navigation:
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {buttons.map((button, index) => (
          <motion.button
            key={index}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 8px 25px rgba(255, 0, 60, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onButtonClick(button.action)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--color-white)',
              background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.8), rgba(255, 0, 60, 0.6))',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(255, 0, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{button.icon}</span>
            {button.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatNavigationButtons;
