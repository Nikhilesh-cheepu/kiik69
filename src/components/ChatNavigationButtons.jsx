import React from 'react';
import { motion } from 'framer-motion';

const ChatNavigationButtons = ({ buttons, onButtonClick }) => {
  if (!buttons || buttons.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-4 space-y-3"
    >
      <div className="text-xs text-gray-300 mb-3 font-manrope text-center">
        💡 Quick navigation:
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {buttons.map((button, index) => (
          <motion.button
            key={index}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 8px 25px rgba(255, 0, 60, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onButtonClick(button.action)}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            <span className="text-lg mr-2">{button.icon}</span>
            {button.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatNavigationButtons;
