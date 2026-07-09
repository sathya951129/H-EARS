import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Edit State Management Tracking Locks
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Form Field Containers
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('Communications');
  const [position, setPosition] = useState('');
  const [empId, setEmpId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);

  const departmentOptions = [
    "Communications", "Digital Marketing", "Engineering", "Executive Office", 
    "Finance", "Food & Beverage", "Front office", "Health Club", "Housekeeping", 
    "Human Resources", "Information Technology", "Kitchen", "Procurement", 
    "Reservations", "Sales & Marketing", "Security", "Spa"
  ];

  const roleOptions = [
    "Division/Dept Head",
    "Financial Controller",
    "General Manager",
    "Requestor",
    "admin"
  ];

  const fetchUsersList = () => {
    axios.get('http://127.0.0.1:5001/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchUsersList(); }, []);

  const handleRoleCheckbox = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Trigger form state shift to edit mode and populate current data fields
  const handleStartEdit = (user) => {
    setIsEditing(true);
    setEditingUserId(user.id);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setDepartment(user.department);
    setPosition(user.position);
    setEmpId(user.emp_id);
    setEmail(user.email);
    setPassword(user.password || '');
    setSelectedRoles(user.roles);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingUserId(null);
    setFirstName(''); setLastName(''); setDepartment('Communications'); setPosition('');
    setEmpId(''); setEmail(''); setPassword(''); setSelectedRoles([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedRoles.length === 0) return alert("Select at least one platform role clearance mapping.");

    const payload = { firstName, lastName, department, position, empId, email, password, roles: selectedRoles };

    if (isEditing) {
      // Execute UPDATE via PUT Route
      axios.put(`http://127.0.0.1:5001/api/users/${editingUserId}`, payload)
        .then(res => {
          alert(res.data.message);
          handleCancelForm();
          fetchUsersList();
        })
        .catch(err => alert(err.response?.data?.error || "Update structural execution error"));
    } else {
      // Execute CREATE via POST Route
      axios.post('http://127.0.0.1:5001/api/users/new', payload)
        .then(res => {
          alert(res.data.message);
          handleCancelForm();
          fetchUsersList();
        })
        .catch(err => alert(err.response?.data?.error || "Creation error"));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Permanently delete user profile record? Access will be revoked immediately.")) {
      axios.delete(`http://127.0.0.1:5001/api/users/${id}`).then(res => { alert(res.data.message); fetchUsersList(); });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1a365d' }}>Identity & Access Management</h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Configure structural roles and clearance limits</p>
        </div>
        <button onClick={showForm ? handleCancelForm : () => setShowForm(true)} style={{ padding: '10px 16px', backgroundColor: showForm ? '#e53e3e' : '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? 'Cancel Operation' : '+ Create User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginTop: 0, color: isEditing ? '#dd6b20' : '#2d3748' }}>
            {isEditing ? `📝 Modifying Account Profile: ${firstName} ${lastName}` : '✨ New User Registration Form'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>First Name</label>
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Last Name</label>
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Position Title</label>
              <input type="text" required value={position} onChange={e => setPosition(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Employee ID</label>
              <input type="text" required value={empId} onChange={e => setEmpId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>System Password</label>
            <input type="text" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Assign password string" style={{ width: '50%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px', backgroundColor: '#f7fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', color: '#2d3748' }}>Assign Multi-Role Clearances</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {roleOptions.map(role => (
                <label key={role} style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#4a5568', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => handleRoleCheckbox(role)} style={{ marginRight: '8px' }} />
                  {role}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: isEditing ? '#dd6b20' : '#48bb78', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isEditing ? 'Save Modified Profiles' : 'Confirm Create User'}
          </button>
        </form>
      )}

      {/* Directory Grid Board */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '13px', color: '#4a5568' }}>
            <th style={{ padding: '12px' }}>Name / ID</th>
            <th style={{ padding: '12px' }}>Department & Position</th>
            <th style={{ padding: '12px' }}>Email & Password</th>
            <th style={{ padding: '12px' }}>Assigned Clearances</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Management Actions</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '14px' }}>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}><strong>{u.first_name} {u.last_name}</strong><div style={{ fontSize: '11px', color: '#a0aec0' }}>{u.emp_id}</div></td>
              <td style={{ padding: '12px' }}>{u.position}<div style={{ fontSize: '12px', color: '#718096' }}>{u.department}</div></td>
              <td style={{ padding: '12px', color: '#4a5568' }}>
                {u.email}
                <div style={{ fontSize: '11px', color: '#cbd5e0', fontFamily: 'monospace' }}>Key: {u.password}</div>
              </td>
              <td style={{ padding: '12px' }}>
                {u.roles.map(r => <span key={r} style={{ display: 'inline-block', backgroundColor: '#e2e8f0', color: '#2d3748', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginRight: '4px', marginBottom: '4px' }}>{r}</span>)}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                  <button onClick={() => handleStartEdit(u)} style={{ backgroundColor: 'transparent', border: 'none', color: '#3182ce', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(u.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#e53e3e', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersManagement;