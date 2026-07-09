import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewRequestForm from './components/NewRequestForm';
import UsersManagement from './components/UsersManagement';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard'); // Options: dashboard, newRequest, users

  // Render Login wall if user token hasn't been instantiated
  if (!currentUser) {
    return <Login setCurrentUser={setCurrentUser} />;
  }

  const sidebarItemStyle = (targetView) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '6px',
    backgroundColor: view === targetView ? '#2b6cb0' : 'transparent',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '8px',
    transition: 'background-color 0.2s',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '14px'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f7fafc', fontFamily: 'sans-serif' }}>
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <div style={{ width: '260px', backgroundColor: '#1a365d', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <h2 style={{ color: 'white', margin: '0 0 30px 10px', fontSize: '22px', letterSpacing: '0.5px' }}>H-EARS Admin</h2>
          <nav>
            <button onClick={() => setView('dashboard')} style={sidebarItemStyle('dashboard')}>
              📋 Requests Dashboard
            </button>
            
            {/* USER MANAGEMENT TAB: Only renders if the active account contains the 'admin' identifier */}
            {currentUser.roles.includes('admin') && (
              <button onClick={() => setView('users')} style={sidebarItemStyle('users')}>
                👥 Users Management
              </button>
            )}
          </nav>
        </div>

        {/* PROFILE RECOGNITION DRAWER */}
        <div style={{ borderTop: '1px solid #2b6cb0', paddingTop: '20px', paddingLeft: '10px' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{currentUser.first_name} {currentUser.last_name}</div>
          <div style={{ color: '#90cdf4', fontSize: '12px', marginBottom: '12px', textTransform: 'capitalize' }}>
            {currentUser.roles.join(', ')}
          </div>
          <button onClick={() => { setCurrentUser(null); setView('dashboard'); }} style={{ width: '100%', padding: '8px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            Log Out
          </button>
        </div>
      </div>

      {/* 2. RIGHT CONTENT WORKSPACE */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', boxSizing: 'border-box' }}>
        {view === 'dashboard' && <Dashboard setView={setView} currentUser={currentUser} />}
        {view === 'newRequest' && <NewRequestForm setView={setView} />}
        {view === 'users' && currentUser.roles.includes('admin') && <UsersManagement />}
      </div>

    </div>
  );
}

export default App;