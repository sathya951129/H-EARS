import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewRequestForm from './components/NewRequestForm';

function App() {
  // Use a string state to manage which "Screen" is visible
  const [view, setView] = useState('login');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', paddingTop: '20px' }}>
      {view === 'login' && <Login setView={setView} />}
      {view === 'dashboard' && <Dashboard setView={setView} />}
      {view === 'newRequest' && <NewRequestForm setView={setView} />}
    </div>
  );
}

export default App;