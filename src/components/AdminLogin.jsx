import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiService from '../services/api';

const AdminLogin = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login({ username, password });
      setIsLoggedIn(true);
      setUser(response.user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      setIsLoggedIn(false);
      setUser(null);
      onClose();
    } catch (err) {
      setError('Logout failed');
    }
  };

  const testApiConnection = async () => {
    try {
      const health = await ApiService.healthCheck();
      setError(`Backend connected! Status: ${health.status}`);
    } catch (err) {
      setError(`Backend connection failed: ${err.message}`);
    }
  };

  // Admin Dashboard
  if (isLoggedIn) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                zIndex: 1000
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.95)',
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                zIndex: 1001,
                width: '90vw',
                maxWidth: '500px',
                minWidth: '300px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#ff003c' }}>Admin Dashboard</h2>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Logout
                </button>
              </div>
              
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', opacity: 0.8 }}>
                Welcome, <strong>{user?.username}</strong>! Manage your website content here.
              </p>

              <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                <button
                  style={{
                    background: '#ff003c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  📋 Manage Menu Items
                </button>
                
                <button
                  style={{
                    background: '#ff003c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  📅 Manage Events
                </button>
                
                <button
                  style={{
                    background: '#ff003c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  🖼️ Manage Gallery
                </button>
                
                <button
                  style={{
                    background: '#ff003c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  📧 View Contact Messages
                </button>
              </div>

              <button
                onClick={testApiConnection}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  width: '100%'
                }}
              >
                Test Backend Connection
              </button>

              {error && (
                <p style={{ color: '#f44336', fontSize: '12px', marginTop: '10px' }}>
                  {error}
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Login Modal
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 1000
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.95)',
              padding: '30px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              zIndex: 1001,
              width: '90vw',
              maxWidth: '400px',
              minWidth: '300px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#ff003c' }}>Admin Login</h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  color: 'white',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '44px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '44px'
                }}
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%',
                background: '#ff003c',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: loading ? 0.7 : 1,
                minHeight: '44px'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && (
              <p style={{ color: '#f44336', fontSize: '12px', marginTop: '10px' }}>
                {error}
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminLogin; 