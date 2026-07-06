import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [backendMessage, setBackendMessage] = useState("Connecting to server...");

  useEffect(() => {
    // Fetch data from our Node.js backend
    axios.get('http://localhost:5001/api/status')
      .then(response => setBackendMessage(response.data.message))
      .catch(error => setBackendMessage("Could not connect to backend."));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>H-EARS System Dashboard</h1>
      <p>Backend Status: <strong>{backendMessage}</strong></p>
    </div>
  );
}

export default App;