import React, { useState } from 'react';
import axios from 'axios'; // Fixed: Using standard axios here now

function NewRequestForm({ setView }) {
  // Set up React State to capture all text and dropdown inputs
  const [formData, setFormData] = useState({
    hotelCode: '',
    employeeId: '',
    firstName: '',
    lastName: '',
    department: '',
    designation: '',
    corporateLevel: '',
    managerName: '',
    remarks: ''
  });

  // Set up a separate array state for the system checkboxes
  const [selectedSystems, setSelectedSystems] = useState([]);

  const departments = [
    "Communications", "Digital Marketing", "Engineering", "Executive Office", 
    "Finance", "Food & Beverage", "Front office", "Health Club", "Housekeeping", 
    "Human Resources", "Information Technology", "Kitchen", "Procurement", 
    "Reservations", "Sales & Marketing", "Security", "Spa"
  ];

  const levels = [
    "Level 5 (Service Associate)", "Level 4 (Service Leader)", 
    "Level 3 (Service Manager)", "Level 2 (Senior Managers/Directors)", 
    "Level 1 (Excoms)"
  ];

  const systems = [
    "Windows Login", "Email", "Opera", "Infrasys", "Infrasys TMS", 
    "CheckSCM", "Minaba Roster", "Kunlun E-Signature", "S360 (Great)", 
    "S360 (EasyTask)", "S360 (EasyClean)", "S360 (Guestpedia)", 
    "Book360", "Panda", "Muses", "Book4Time"
  ];

  // Helper to handle text/dropdown shifts
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to track checkbox ticking/unticking
  const handleCheckboxChange = (sysName) => {
    if (selectedSystems.includes(sysName)) {
      setSelectedSystems(selectedSystems.filter(item => item !== sysName));
    } else {
      setSelectedSystems([...selectedSystems, sysName]);
    }
  };

  // Handle Form Submission to Backend API
  const handleSubmit = (e) => {
    e.preventDefault();

    // Bundle all 11 fields together
    const completePayload = {
      ...formData,
      systemsAccess: selectedSystems,
      fileAttached: "mock_attached_file.pdf"
    };

    // Send data to Node.js backend using the clean import
    axios.post('http://localhost:5001/api/requests/new', completePayload)
      .then(response => {
        alert(`Success! ${response.data.message}`);
        setView('dashboard'); 
      })
      .catch(error => {
        console.error("Transmission error:", error);
        alert("Failed to send request to backend server.");
      });
  };

  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#2d3748', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      
      <button onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', marginBottom: '24px', fontWeight: 'bold', fontSize: '15px' }}>
        ← Back to Dashboard
      </button>
      
      <h2 style={{ color: '#1a365d', marginBottom: '6px', marginTop: 0 }}>Create New Access Request</h2>
      <p style={{ color: '#718096', marginTop: 0, marginBottom: '30px', fontSize: '14px' }}>Data will be live-streamed to Node.js API engine.</p>
      
      <form onSubmit={handleSubmit}>
        
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>1. Hotel Code</label>
            <select name="hotelCode" required value={formData.hotelCode} onChange={handleChange} style={inputStyle}>
              <option value="">-- Select Property --</option>
              <option value="RSR">RSR</option>
              <option value="GSH">GSH</option>
              <option value="RSR & GSH (Clustered)">RSR & GSH (Clustered)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>7. Employee ID</label>
            <input type="text" name="employeeId" placeholder="EMP-9981" required value={formData.employeeId} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>2. Employee First Name</label>
            <input type="text" name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>3. Employee Last Name</label>
            <input type="text" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>4. Department</label>
            <select name="department" required value={formData.department} onChange={handleChange} style={inputStyle}>
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>5. Designation / Job Title</label>
            <input type="text" name="designation" placeholder="Duty Manager" required value={formData.designation} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Row 4 */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>6. Corporate Level</label>
            <select name="corporateLevel" required value={formData.corporateLevel} onChange={handleChange} style={inputStyle}>
              <option value="">-- Select Level --</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>9. Manager Name (Direct Report)</label>
            <input type="text" name="managerName" placeholder="Sarah Jenkins" required value={formData.managerName} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

        {/* System Access Matrix */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ ...labelStyle, fontSize: '16px', marginBottom: '12px' }}>8. System Access Provisioning</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px', backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {systems.map((sys) => (
              <label key={sys} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#4a5568', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedSystems.includes(sys)} onChange={() => handleCheckboxChange(sys)} style={{ marginRight: '10px', width: '16px', height: '16px' }} />
                {sys}
              </label>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>10. Justification / Special Remarks</label>
          <textarea name="remarks" placeholder="Provide detailed remarks..." rows="4" value={formData.remarks} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '35px', padding: '15px', border: '2px dashed #cbd5e0', borderRadius: '8px', backgroundColor: '#fcfdfd' }}>
          <label style={labelStyle}>11. Upload Files (Deviations, Signed Manual Forms)</label>
          <input type="file" multiple disabled style={{ fontSize: '14px', color: '#718096' }} />
          <span style={{ fontSize: '12px', color: '#a0aec0', display: 'block', marginTop: '4px' }}>(Mock upload container enabled for UI deployment verification)</span>
        </div>

        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Submit to Live 4-Tier Node Engine
        </button>
        
      </form>
    </div>
  );
}

export default NewRequestForm;