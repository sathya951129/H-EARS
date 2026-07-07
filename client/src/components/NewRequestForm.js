import React from 'react';

function NewRequestForm({ setView }) {
  // Lists for mapping options cleanly
  const departments = [
    "Communications", "Digital Marketing", "Engineering", "Executive Office", 
    "Finance", "Food & Beverage", "Front office", "Health Club", "Housekeeping", 
    "Human Resources", "Information Technology", "Kitchen", "Procurement", 
    "Reservations", "Sales & Marketing", "Security", "Spa"
  ];

  const levels = [
    "Level 5 (Service Associate)", 
    "Level 4 (Service Leader)", 
    "Level 3 (Service Manager)", 
    "Level 2 (Senior Managers/Directors)", 
    "Level 1 (Excoms)"
  ];

  const systems = [
    "Windows Login", "Email", "Opera", "Infrasys", "Infrasys TMS", 
    "CheckSCM", "Minaba Roster", "Kunlun E-Signature", "S360 (Great)", 
    "S360 (EasyTask)", "S360 (EasyClean)", "S360 (Guestpedia)", 
    "Book360", "Panda", "Muses", "Book4Time"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("H-EARS Access Request submitted to the 4-tier routing engine!");
    setView('dashboard');
  };

  // Shared styles for inputs to keep things clean
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#2d3748', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      
      {/* Navigation Header */}
      <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', marginBottom: '24px', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center' }}>
        ← Back to Dashboard
      </button>
      
      <h2 style={{ color: '#1a365d', marginBottom: '6px', marginTop: 0 }}>Create New Access Request</h2>
      <p style={{ color: '#718096', marginTop: 0, marginBottom: '30px', fontSize: '14px' }}>Ensure all fields match the employee's official HR profile.</p>
      
      <form onSubmit={handleSubmit}>
        
        {/* Row 1: Hotel Code & Employee ID */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>1. Hotel Code</label>
            <select required style={inputStyle}>
              <option value="">-- Select Property --</option>
              <option value="RSR">RSR</option>
              <option value="GSH">GSH</option>
              <option value="Clustered">RSR & GSH (Clustered)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>7. Employee ID</label>
            <input type="text" placeholder="e.g. EMP-9981" required style={inputStyle} />
          </div>
        </div>

        {/* Row 2: First Name & Last Name */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>2. Employee First Name</label>
            <input type="text" placeholder="John" required style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>3. Employee Last Name</label>
            <input type="text" placeholder="Doe" required style={inputStyle} />
          </div>
        </div>

        {/* Row 3: Department & Designation */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>4. Department</label>
            <select required style={inputStyle}>
              <option value="">-- Select Department --</option>
              <option value="Communications" , "Digital Marketing" , "Engineering" , "Executive Office" , "Finance" , "Food & Beverage" , "Front office" , "Health Club" , "Housekeeping" , "Human Resources" , "Information Technology" , "Kitchen" , "Procurement" , "Reservations" , "Sales & Marketing", "Security" , "Spa">Communications</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>5. Designation / Job Title</label>
            <input type="text" placeholder="e.g. Duty Manager" required style={inputStyle} />
          </div>
        </div>

        {/* Row 4: Level & Direct Manager */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>6. Corporate Level</label>
            <select required style={inputStyle}>
              <option value="">-- Select Level --</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>9. Manager Name (Direct Report)</label>
            <input type="text" placeholder="e.g. Sarah Jenkins" required style={inputStyle} />
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

        {/* Section 8: System Access Matrix (3-Column Grid) */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ ...labelStyle, fontSize: '16px', marginBottom: '12px' }}>8. System Access Provisioning</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px', backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {systems.map((sys) => (
              <label key={sys} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#4a5568', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" value={sys} style={{ marginRight: '10px', width: '16px', height: '16px', cursor: 'pointer' }} />
                {sys}
              </label>
            ))}
          </div>
        </div>

        {/* Section 10: Remarks */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>10. Justification / Special Remarks</label>
          <textarea placeholder="Provide detailed remarks or compliance reasoning for cross-department system access provisioning..." rows="4" style={{ ...inputStyle, resize: 'vertical' }}></textarea>
        </div>

        {/* Section 11: File Upload */}
        <div style={{ marginBottom: '35px', padding: '15px', border: '2px dashed #cbd5e0', borderRadius: '8px', backgroundColor: '#fcfdfd' }}>
          <label style={labelStyle}>11. Upload Files (Deviations, Signed Manual Forms)</label>
          <input type="file" multiple style={{ fontSize: '14px', color: '#718096' }} />
        </div>

        {/* Submit Action Button */}
        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)' }}>
          Submit to 4-Tier Approval Workflow
        </button>
        
      </form>
    </div>
  );
}

export default NewRequestForm;