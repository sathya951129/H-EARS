import React from 'react';

function Dashboard({ setView }) {
  // Mock data representing a typical submission tracking step
  const mockRequests = [
    { id: "REQ-001", system: "Opera PMS", date: "2026-07-06", status: "Pending FC Approval", tier: 3 }
  ];

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a365d' }}>H-EARS Dashboard</h1>
          <p style={{ margin: 0, color: '#718096' }}>Track and manage active hotel application requests</p>
        </div>
        <div>
          <button onClick={() => setView('newRequest')} style={{ padding: '12px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>
            + Create New Request
          </button>
          <button onClick={() => setView('login')} style={{ padding: '12px 20px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <h3 style={{ color: '#2d3748' }}>Active Trackers</h3>
      {mockRequests.map((req) => (
        <div key={req.id} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f7fafc', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span><strong>ID:</strong> {req.id} ({req.system})</span>
            <span><strong>Submitted:</strong> {req.date}</span>
            <span style={{ color: '#dd6b20', fontWeight: 'bold' }}>{req.status}</span>
          </div>

          {/* DevOps Visual: A beautiful progress step bar representing the 4-tier chain */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '20px' }}>
            <div style={{ flex: 1, textBreak: 'break-all', textAlign: 'center', color: '#48bb78', fontWeight: 'bold' }}>✓ Dept Head</div>
            <div style={{ flex: 1, textAlign: 'center', color: '#48bb78', fontWeight: 'bold' }}>✓ Division Head</div>
            <div style={{ flex: 1, textAlign: 'center', color: '#dd6b20', fontWeight: 'bold' }}>⏳ Financial Controller</div>
            <div style={{ flex: 1, textAlign: 'center', color: '#a0aec0' }}>⚪ General Manager</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;