import React from 'react';

function NewRequestForm({ setView }) {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>← Back to Dashboard</button>
      
      <h2 style={{ color: '#1a365d', marginBottom: '20px' }}>New Access Request Form</h2>
      
      <form onSubmit={(e) => { e.preventDefault(); alert("Request submitted successfully!"); setView('dashboard'); }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Employee ID</label>
            <input type="text" placeholder="EMP-1024" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Job Title / Designation</label>
            <input type="text" placeholder="Front Desk Agent" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Hotel Department</label>
          <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }}>
            <option>Front Office</option>
            <option>Food & Beverage (F&B)</option>
            <option>Housekeeping</option>
            <option>Finance / Accounting</option>
            <option>Human Resources</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Systems Required</label>
          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ marginRight: '8px' }} /> Opera PMS (Property Management System)
          </label>
          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ marginRight: '8px' }} /> Micros POS (Point of Sale)
          </label>
          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ marginRight: '8px' }} /> VingCard (Keycard Systems)
          </label>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Justification / Remarks</label>
          <textarea placeholder="Please state why this access is required..." rows="4" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}></textarea>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Submit to 4-Tier Approval Workflow
        </button>
      </form>
    </div>
  );
}

export default NewRequestForm;