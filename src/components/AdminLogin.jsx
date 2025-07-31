import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApiService from '../services/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
      setSuccess('Logged out successfully');
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

  if (isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-panel"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.9)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          zIndex: 1000,
          minWidth: '300px'
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#ff003c' }}>Admin Panel</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
          Welcome, <strong>{user?.username}</strong>!
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testApiConnection}
            style={{
              background: '#ff003c',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Test API
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-login"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.9)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'white',
        zIndex: 1000,
        minWidth: '250px'
      }}
    >
      <h3 style={{ margin: '0 0 15px 0', color: '#ff003c' }}>Admin Login</h3>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '100%',
            background: '#ff003c',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.7 : 1
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
      <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.7 }}>
        <p style={{ margin: '5px 0' }}>Default credentials:</p>
        <p style={{ margin: '5px 0' }}>Username: admin</p>
        <p style={{ margin: '5px 0' }}>Password: admin123</p>
      </div>
    </motion.div>
  );
};

export default AdminLogin; 