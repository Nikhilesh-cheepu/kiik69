import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { loginUser } from '../lib/chatAuth';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      if (loginMethod === 'phone' && phoneInputRef.current) {
        setTimeout(() => phoneInputRef.current.focus(), 100);
      } else if (loginMethod === 'email' && emailInputRef.current) {
        setTimeout(() => emailInputRef.current.focus(), 100);
      }
    }
  }, [isOpen, loginMethod]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loginMethod === 'phone' && (!phone || phone.length < 10)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    if (loginMethod === 'email' && (!email || !email.includes('@'))) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const loginData = loginMethod === 'phone' ? { phone } : { email };
      const result = await loginUser(loginData);
      
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
    setPhone('');
    setEmail('');
    setError('');
    setSuccess('');
    setLoginMethod('phone');
    onClose();
  };

  const switchToPhone = () => {
    setLoginMethod('phone');
    setError('');
    setSuccess('');
  };

  const switchToEmail = () => {
    setLoginMethod('email');
    setError('');
    setSuccess('');
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
            zIndex: 1000,
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
              {/* Login Method Tabs */}
              <div style={{
                display: 'flex',
                marginBottom: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '4px'
              }}>
                <button
                  onClick={switchToPhone}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: loginMethod === 'phone' ? 'var(--color-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: loginMethod === 'phone' ? 'white' : 'var(--color-gray)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaPhone />
                  Phone
                </button>
                <button
                  onClick={switchToEmail}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: loginMethod === 'email' ? 'var(--color-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: loginMethod === 'email' ? 'white' : 'var(--color-gray)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaEnvelope />
                  Email
                </button>
              </div>

              <form onSubmit={handleLogin}>
                {loginMethod === 'phone' ? (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      marginBottom: '0.5rem'
                    }}>
                      Mobile Number
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
                        fontSize: '1.1rem'
                      }}>
                        <FaPhone />
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRight: 'none',
                          borderRadius: '12px 0 0 12px',
                          padding: '1rem 0.75rem',
                          color: 'var(--color-white)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          minWidth: '60px',
                          textAlign: 'center'
                        }}>
                          +91
                        </div>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          style={{
                            flex: 1,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0 12px 12px 0',
                            padding: '1rem 1rem 1rem 0.75rem',
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
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-gray)',
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      We'll automatically add the +91 country code for India
                    </p>
                  </div>
                ) : (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      marginBottom: '0.5rem'
                    }}>
                      Email Address
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
                        fontSize: '1.1rem'
                      }}>
                        <FaEnvelope />
                      </div>
                      <input
                        ref={emailInputRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
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
                  </div>
                )}

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
                  disabled={isLoading || (loginMethod === 'phone' ? phone.length < 10 : !email)}
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
                    opacity: isLoading || (loginMethod === 'phone' ? phone.length < 10 : !email) ? 0.6 : 1
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
