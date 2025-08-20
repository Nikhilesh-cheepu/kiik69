import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPhone, FaKey, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { requestOTP, verifyOTP } from '../lib/chatAuth';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const phoneInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      if (step === 'phone' && phoneInputRef.current) {
        setTimeout(() => phoneInputRef.current.focus(), 100);
      } else if (step === 'otp' && otpInputRef.current) {
        setTimeout(() => otpInputRef.current.focus(), 100);
      }
    }
  }, [isOpen, step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await requestOTP(phone);
      setStep('otp');
      setCountdown(60); // 60 second countdown
      setSuccess('OTP sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyOTP(phone, otp);
      setSuccess('Login successful!');
      setTimeout(() => {
        onLoginSuccess(result.user);
        onClose();
      }, 1000);
    } catch (error) {
      setError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');

    try {
      await requestOTP(phone);
      setCountdown(60);
      setSuccess('OTP resent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
    setSuccess('');
    setCountdown(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                {step === 'otp' && (
                  <button
                    onClick={handleBackToPhone}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-gray)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--color-white)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--color-gray)';
                      e.target.style.background = 'none';
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                )}
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--color-white)',
                  margin: 0
                }}>
                  {step === 'phone' ? 'Login to Chat' : 'Verify OTP'}
                </h2>
              </div>
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
              {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit}>
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

                  <button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
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
                      boxShadow: '0 4px 20px rgba(255, 0, 60, 0.3)'
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
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOTPSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      marginBottom: '0.5rem'
                    }}>
                      Enter 6-digit OTP sent to {phone}
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
                        <FaKey />
                      </div>
                      <input
                        ref={otpInputRef}
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter OTP"
                        maxLength={6}
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
                          transition: 'all 0.3s ease',
                          letterSpacing: '0.5em',
                          textAlign: 'center'
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

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
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
                      marginBottom: '1rem'
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
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isLoading}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      color: countdown > 0 ? 'var(--color-gray)' : 'var(--color-white)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (countdown === 0 && !isLoading) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.borderColor = 'var(--color-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </button>
                </form>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#ff6b6b',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(0, 255, 0, 0.1)',
                    border: '1px solid rgba(0, 255, 0, 0.3)',
                    borderRadius: '8px',
                    color: '#51cf66',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaCheck />
                  {success}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
