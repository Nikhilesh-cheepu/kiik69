import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'admin@kiik69.com';
const ADMIN_PASS = 'kiikadmin123';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      localStorage.setItem('kiik69_admin_auth', 'true');
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div style={styles.bg}>
      <form style={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <h2 style={styles.title}>Admin Login</h2>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} type="submit">Login</button>
      </form>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(120deg, #18122b 0%, #2a003e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    background: 'rgba(30,30,40,0.82)',
    borderRadius: 24,
    boxShadow: '0 8px 40px #b47cff33, 0 2px 24px #ff3c7033',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 320,
    maxWidth: 360,
    width: '90vw',
    gap: 18,
  },
  title: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '2rem',
    marginBottom: 24,
    letterSpacing: 1.2,
    textShadow: '0 2px 12px #b47cff66, 0 1px 8px #fff2',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    margin: '8px 0',
    borderRadius: 12,
    border: 'none',
    outline: 'none',
    fontSize: '1.08rem',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    boxShadow: '0 0 12px #b47cff44',
    transition: 'box-shadow 0.3s',
    marginBottom: 8,
  },
  button: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 999,
    border: 'none',
    background: 'linear-gradient(90deg, #b47cff 0%, #ff3c70 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    marginTop: 18,
    boxShadow: '0 0 24px #b47cff44',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  error: {
    color: '#ff3c70',
    fontWeight: 600,
    margin: '8px 0',
    fontSize: '1rem',
  },
}; 