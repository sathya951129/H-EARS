import React from 'react';

function Login({ setView }) {
  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#1a365d', marginBottom: '6px' }}>H-EARS</h2>
      <p style={{ textAlign: 'center', color: '#718096', marginTop: '0', marginBottom: '24px' }}>Hotel Employee Access Request System</p>
      
      <form onSubmit={(e) => { e.preventDefault(); setView('dashboard'); }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Work Email</label>
          <input type="email" placeholder="name@hotel.com" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>Password</label>
          <input type="password" placeholder="••••••••" required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Login;