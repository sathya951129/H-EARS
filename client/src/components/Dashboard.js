import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ setView }) {
  const [requests, setRequests] = useState([]);

  // Fetch running rows from database endpoint mapping
  const fetchLiveData = () => {
    axios.get('http://127.0.0.1:5001/api/requests')
      .then(response => setRequests(response.data))
      .catch(error => console.error("Data pipeline broken:", error));
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  // Transmit action choices right into the Node routing loops
  const processWorkflowAction = (dbId, actionType) => {
    axios.put(`http://127.0.0.1:5001/api/requests/${dbId}/action`, { action: actionType })
      .then(response => {
        alert(response.data.message);
        fetchLiveData(); // Automatically reload screen to watch structural items transition
      })
      .catch(error => console.error("Action transmission failure:", error));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a365d' }}>H-EARS Dashboard</h1>
          <p style={{ margin: 0, color: '#718096' }}>Tier-3 Connected Workspace Security Panel</p>
        </div>
        <div>
          <button onClick={() => setView('newRequest')} style={{ padding: '12px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Create New Request
          </button>
        </div>
      </div>

      <h3 style={{ color: '#2d3748' }}>Active System Access Tracking Matrices ({requests.length})</h3>
      {requests.map((req) => (
        <div key={req.id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span><strong>Tracker:</strong> {req.id} — <span style={{color: '#3182ce', fontWeight: 'bold'}}>{req.employeeName}</span></span>
            <span><strong>Created:</strong> {req.date}</span>
            <span style={{ color: req.tier === 0 ? '#e53e3e' : req.tier === 5 ? '#38a169' : '#dd6b20', fontWeight: 'bold' }}>
              {req.status}
            </span>
          </div>

          <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '15px', backgroundColor: '#f7fafc', padding: '10px', borderRadius: '4px' }}>
            <strong>Provision Targets:</strong> {req.system || 'None Selected'}
          </div>
          
          {/* Visual Step Stepper Progress Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px', borderBottom: '1px solid #f7fafc', paddingBottom: '15px' }}>
            <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 1 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 1 ? '✓' : req.tier === 1 ? '⏳' : '⚪'} Dept Head</div>
            <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 2 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 2 ? '✓' : req.tier === 2 ? '⏳' : '⚪'} Division Head</div>
            <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 3 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 3 ? '✓' : req.tier === 3 ? '⏳' : '⚪'} FC</div>
            <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 4 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 4 ? '✓' : req.tier === 4 ? '⏳' : '⚪'} GM</div>
          </div>

          {/* Context Panel Buttons: Only render if item hasn't reached endpoint execution state blocks */}
          {req.tier > 0 && req.tier < 5 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
              <button onClick={() => processWorkflowAction(req.dbId, 'reject')} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Reject Access
              </button>
              <button onClick={() => processWorkflowAction(req.dbId, 'approve')} style={{ padding: '8px 16px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Approve Step →
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default Dashboard;