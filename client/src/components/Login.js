import React, { useState } from 'react';
import axios from 'axios';

function Login({ setCurrentUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    axios.post('http://127.0.0.1:5001/api/auth/login', { email, password })
      .then(response => {
        // Save the verified user profile into global React state
        setCurrentUser(response.data.user);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Authentication network failure.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#1a365d', marginBottom: '8px', marginTop: 0 }}>H-EARS Portal</h2>
        <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Sign in to access your routing dashboard</p>
        
        {error && <div style={{ backgroundColor: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #fed7d7' }}>{error}</div>}
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#2d3748' }}>Corporate Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hotel.com" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#2d3748' }}>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          Secure Login
        </button>
      </form>
    </div>
  );
}

export default Login;