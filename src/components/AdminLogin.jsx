import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiService from '../services/api';

const AdminLogin = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await ApiService.login(credentials);
      setSuccess('Login successful!');
      setIsLoggedIn(true);
      setUser(response.user);
      // Show admin dashboard after successful login
      setTimeout(() => {
        setShowAdminDashboard(true);
      }, 1000);
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
      setShowAdminDashboard(false);
      setSuccess('Logged out successfully');
      onClose();
    } catch (err) {
      setError('Logout failed');
    }
  };

  const testApiConnection = async () => {
    try {
      const health = await ApiService.healthCheck();
      setSuccess(`Backend is connected! Status: ${health.status}`);
    } catch (err) {
      setError(`Backend connection failed: ${err.message}`);
    }
  };

  // Admin Dashboard Component
  const AdminDashboard = () => (
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
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          zIndex: 1001,
          width: '90%',
          maxWidth: '500px',
          minWidth: '300px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#ff003c' }}>Admin Dashboard</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </div>
      
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', opacity: 0.8 }}>
        Welcome, <strong>{user?.username}</strong>! Manage your website content here.
      </p>

      <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
      </motion.button>

      {success && (
        <p style={{ color: '#4CAF50', fontSize: '12px', marginTop: '10px' }}>
          {success}
        </p>
      )}
      {error && (
        <p style={{ color: '#f44336', fontSize: '12px', marginTop: '10px' }}>
          {error}
        </p>
      )}
    </motion.div>
  );

  // Login Modal Component
  const LoginModal = () => (
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
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'white',
        zIndex: 1001,
        width: '90%',
        maxWidth: '400px',
        minWidth: '280px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#ff003c' }}>Admin Login</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </div>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.type === 'password') {
                e.preventDefault();
              }
            }}
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
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin(e);
              }
            }}
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
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
      </form>

      {error && (
        <p style={{ color: '#f44336', fontSize: '12px', marginTop: '10px' }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: '#4CAF50', fontSize: '12px', marginTop: '10px' }}>
          {success}
        </p>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7, textAlign: 'center' }}>
        <p style={{ margin: '5px 0' }}>Default credentials:</p>
        <p style={{ margin: '5px 0' }}>Username: <strong>admin</strong></p>
        <p style={{ margin: '5px 0' }}>Password: <strong>admin123</strong></p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
              background: 'rgba(0,0,0,0.7)',
              zIndex: 1000
            }}
          />
          
          {/* Modal Content */}
          {showAdminDashboard ? <AdminDashboard /> : <LoginModal />}
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminLogin; 