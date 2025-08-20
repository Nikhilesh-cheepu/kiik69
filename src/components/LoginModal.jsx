import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaEnvelope, FaCheck } from 'react-icons/fa';
import { loginUser } from '../lib/chatAuth';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    // Check if it's a phone number (10 digits) or email
    const isPhone = /^\d{10}$/.test(identifier.replace(/\D/g, ''));
    const isEmail = identifier.includes('@') && identifier.includes('.');
    
    if (!isPhone && !isEmail) {
      setError('Please enter a valid 10-digit phone number or email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await loginUser({ identifier });
      
      setSuccess('Login successful!');
      setTimeout(() => {
        onLoginSuccess(result.user);
        onClose();
      }, 1000);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIdentifier('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem'
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'rgba(0, 0, 0, 0.95)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                color: 'var(--color-white)',
                margin: 0
              }}>
                Login to Chat
              </h2>
              <button
                onClick={handleClose}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--color-white)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--color-gray)',
                    marginBottom: '0.5rem'
                  }}>
                    Email or Phone Number
                  </label>
                  <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '1rem',
                      color: 'var(--color-gray)',
                      fontSize: '1.1rem',
                      zIndex: 1
                    }}>
                      {identifier.includes('@') ? <FaEnvelope /> : <FaPhone />}
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        const value = e.target.value;
                        setIdentifier(value);
                        // Auto-format phone numbers
                        if (/^\d+$/.test(value) && value.length <= 10) {
                          setIdentifier(value);
                        } else if (value.includes('@')) {
                          setIdentifier(value);
                        }
                      }}
                      placeholder="Enter email or 10-digit phone number"
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1rem 1rem 1rem 3rem',
                        color: 'var(--color-white)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid var(--color-primary)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 0, 60, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-gray)',
                    marginTop: '0.5rem',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {identifier.includes('@') 
                      ? 'We\'ll use your email as your unique identifier'
                      : 'We\'ll automatically add +91 country code for India'
                    }
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div style={{
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    color: '#ff6b6b',
                    fontSize: '0.9rem'
                  }}>
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div style={{
                    background: 'rgba(0, 255, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    color: '#51cf66',
                    fontSize: '0.9rem'
                  }}>
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !identifier.trim()}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--color-primary), rgba(255, 0, 60, 0.8))',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(255, 0, 60, 0.3)',
                    opacity: isLoading || !identifier.trim() ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 25px rgba(255, 0, 60, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 20px rgba(255, 0, 60, 0.3)';
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p style={{
                fontSize: '0.8rem',
                color: 'var(--color-gray)',
                textAlign: 'center',
                marginTop: '1rem',
                fontFamily: 'var(--font-body)'
              }}>
                No password required! Just enter your phone or email to start chatting.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
