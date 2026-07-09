import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ setView, currentUser }) {
  const [requests, setRequests] = useState([]);

  const fetchLiveData = () => {
    const rolesParam = currentUser?.roles ? currentUser.roles.join(',') : '';
    // Added userEmail parameter to the API request string below
    axios.get(`http://127.0.0.1:5001/api/requests?userRoles=${rolesParam}&userDept=${currentUser?.department || ''}&userEmail=${currentUser?.email || ''}`)
      .then(response => setRequests(response.data))
      .catch(error => console.error("Pipeline breakdown:", error));
  };

  useEffect(() => {
    fetchLiveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processWorkflowAction = (dbId, actionType) => {
    axios.put(`http://127.0.0.1:5001/api/requests/${dbId}/action`, { action: actionType })
      .then(response => {
        alert(response.data.message);
        fetchLiveData();
      })
      .catch(error => console.error("Routing fault:", error));
  };

  return (
    <div style={{ padding: '10px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a365d' }}>H-EARS Dashboard</h1>
          <p style={{ margin: 0, color: '#718096' }}>Tier-3 Connected Workspace Security Panel</p>
        </div>
        <div>
          {/* Unlocks submission if the account contains a designated structural requestor role mapping */}
          {(currentUser.roles.includes('Requestor') || currentUser.roles.includes('Division/Dept Head') || currentUser.roles.includes('admin')) && (
            <button onClick={() => setView('newRequest')} style={{ padding: '12px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              + Create New Request
            </button>
          )}
        </div>
      </div>

      <h3 style={{ color: '#2d3748' }}>Active Access Routing Operations ({requests.length})</h3>
      {requests.length === 0 ? (
        <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>No active requests within your operational profile boundaries.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span><strong>Tracker:</strong> {req.id} — <span style={{color: '#3182ce', fontWeight: 'bold'}}>{req.employeeName}</span> (<span style={{fontSize: '12px', color: '#718096'}}>{req.department}</span>)</span>
              <span><strong>Created:</strong> {req.date}</span>
              <span style={{ color: req.tier === 0 ? '#e53e3e' : req.tier === 4 ? '#38a169' : '#dd6b20', fontWeight: 'bold' }}>
                {req.status}
              </span>
            </div>

            <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '15px', backgroundColor: '#f7fafc', padding: '10px', borderRadius: '4px' }}>
              <strong>Provision Targets:</strong> {req.system || 'None Selected'}
            </div>
            
            {/* Visual Step Stepper Progress Indicators (3 Clear Levels) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px', borderBottom: '1px solid #f7fafc', paddingBottom: '15px' }}>
              <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 1 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 1 ? '✓' : req.tier === 1 ? '⏳' : '⚪'} Division/Dept Head</div>
              <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 2 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 2 ? '✓' : req.tier === 2 ? '⏳' : '⚪'} Financial Controller</div>
              <div style={{ flex: 1, textAlign: 'center', color: req.tier >= 3 ? '#48bb78' : '#a0aec0', fontWeight: 'bold' }}>{req.tier > 3 ? '✓' : req.tier === 3 ? '⏳' : '⚪'} General Manager</div>
            </div>

            {/* Render Context Action Buttons matching Tier Authorization Blocks */}
            {req.tier > 0 && req.tier < 4 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                
                {/* Level 1: Only rendered if active user matches the form field's department cluster */}
                {req.tier === 1 && currentUser.roles.includes('Division/Dept Head') && currentUser.department === req.department && (
                  <>
                    <button onClick={() => processWorkflowAction(req.dbId, 'reject')} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                    <button onClick={() => processWorkflowAction(req.dbId, 'approve')} style={{ padding: '8px 16px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve Dept Block →</button>
                  </>
                )}

                {/* Level 2: Financial Controller Global Trigger Gate */}
                {req.tier === 2 && currentUser.roles.includes('Financial Controller') && (
                  <>
                    <button onClick={() => processWorkflowAction(req.dbId, 'reject')} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                    <button onClick={() => processWorkflowAction(req.dbId, 'approve')} style={{ padding: '8px 16px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve Fiscal Clear →</button>
                  </>
                )}

                {/* Level 3: General Manager Exec Signature Gate */}
                {req.tier === 3 && currentUser.roles.includes('General Manager') && (
                  <>
                    <button onClick={() => processWorkflowAction(req.dbId, 'reject')} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                    <button onClick={() => processWorkflowAction(req.dbId, 'approve')} style={{ padding: '8px 16px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Final GM Sign-Off ✓</button>
                  </>
                )}

              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;