const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hears_db',
    password: 'your_password_here', // ⚠️ Replace with your actual database master password
    port: 5432,
});

// Authentication Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials." });
        res.json({ user: result.rows[0] });
    } catch (err) { res.status(500).json({ error: "Auth fault" }); }
});

// ==========================================================
// 🛡️ STRICT DATA-LEVEL SEGREGATION ENGINE
// ==========================================================
app.get('/api/requests', async (req, res) => {
    const { userRoles, userDept, userEmail } = req.query;
    const rolesArray = userRoles ? userRoles.split(',') : [];

    try {
        let queryText = 'SELECT * FROM access_requests';
        let conditions = [];
        let queryParams = [];

        // Condition A: If the user is an Admin/IT, bypass all filters completely
        if (rolesArray.includes('admin')) {
            // No conditions added -> can view everything globally
        } else {
            let roleConditions = [];

            // 1. Requestors: Double-Lock (Must be created by them AND must match their exact department)
            if (rolesArray.includes('Requestor')) {
                queryParams.push(userEmail);
                queryParams.push(userDept);
                roleConditions.push(`(created_by = $${queryParams.length - 1} AND department = $${queryParams.length})`);
            }

            // 2. Division/Dept Heads: Only see items pending under them (Tier 1) AND approved historical items in their department (Tier >= 1)
            if (rolesArray.includes('Division/Dept Head')) {
                queryParams.push(userDept);
                roleConditions.push(`(department = $${queryParams.length} AND tier >= 1)`);
            }

            // 3. Financial Controllers: Only see items pending under them (Tier 2) AND approved items (Tier >= 2)
            if (rolesArray.includes('Financial Controller')) {
                roleConditions.push(`tier >= 2`);
            }

            // 4. General Managers: Only see items pending under them (Tier 3) AND approved items (Tier >= 3)
            if (rolesArray.includes('General Manager')) {
                roleConditions.push(`tier >= 3`);
            }

            // Compile the role rules together inside a secure OR statement
            if (roleConditions.length > 0) {
                conditions.push(`(${roleConditions.join(' OR ')})`);
            } else {
                conditions.push('1=0'); // Safeguard: If user has no valid roles, return nothing
            }
        }

        if (conditions.length > 0) {
            queryText += ' WHERE ' + conditions.join(' AND ');
        }
        queryText += ' ORDER BY id DESC';

        const result = await pool.query(queryText, queryParams);
        const formatted = result.rows.map(row => ({
            dbId: row.id, id: `REQ-00${row.id}`,
            employeeName: `${row.first_name} ${row.last_name}`, department: row.department,
            system: row.systems_access.join(", "), date: row.created_at.toISOString().split('T')[0],
            status: row.status, tier: row.tier
        }));
        res.json(formatted);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: "Data segregation query crash" }); 
    }
});

// Create Request: Records who logged in and initialized the form entry
app.post('/api/requests/new', async (req, res) => {
    const data = req.body;
    const queryText = `
        INSERT INTO access_requests (hotel_code, employee_id, first_name, last_name, department, designation, corporate_level, manager_name, systems_access, remarks, created_by, status, tier)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending Division/Dept Head Approval', 1) RETURNING id;
    `;
    try {
        const result = await pool.query(queryText, [
            data.hotelCode, data.employeeId, data.firstName, data.lastName, data.department, 
            data.designation, data.corporateLevel, data.managerName, data.systemsAccess, data.remarks, data.createdBy
        ]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (err) { res.status(500).json({ error: "Post failure" }); }
});

// Workflow Action Router (3-Tier Structure)
app.put('/api/requests/:id/action', async (req, res) => {
    const dbId = req.params.id;
    const { action } = req.body;
    try {
        const check = await pool.query('SELECT status, tier FROM access_requests WHERE id = $1', [dbId]);
        if (check.rows.length === 0) return res.status(404).json({ error: "Record missing" });
        const record = check.rows[0];
        let nextTier = record.tier;
        let nextStatus = record.status;

        if (action === 'reject') {
            nextTier = 0;
            nextStatus = 'Rejected / Access Revoked';
        } else if (action === 'approve') {
            if (record.tier === 1) { nextTier = 2; nextStatus = 'Pending FC Approval'; } 
            else if (record.tier === 2) { nextTier = 3; nextStatus = 'Pending GM Approval'; } 
            else if (record.tier === 3) { nextTier = 4; nextStatus = 'Fully Approved & Provisioned'; }
        }
        await pool.query('UPDATE access_requests SET tier = $1, status = $2 WHERE id = $3', [nextTier, nextStatus, dbId]);
        res.json({ message: "Workflow step updated." });
    } catch (err) { res.status(500).json({ error: "Workflow error" }); }
});

// User Directory Controls (CRUD)
app.get('/api/users', async (req, res) => {
    try {
        const resu = await pool.query('SELECT * FROM users ORDER BY id DESC');
        res.json(resu.rows);
    } catch (err) { res.status(500).json({ error: "Read fault" }); }
});

app.post('/api/users/new', async (req, res) => {
    const u = req.body;
    try {
        await pool.query('INSERT INTO users (first_name, last_name, department, position, emp_id, email, password, roles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [u.firstName, u.lastName, u.department, u.position, u.empId, u.email, u.password, u.roles]);
        res.status(201).json({ message: "User allocated cleanly!" });
    } catch (err) { res.status(500).json({ error: "Profile write error" }); }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.json({ message: "User deleted cleanly." });
    } catch (err) { res.status(500).json({ error: "Delete error" }); }
});

app.listen(PORT, () => console.log(`🚀 H-EARS Segregated RBAC Engine active on port ${PORT}`));