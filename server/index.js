const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Configure the PostgreSQL Connection Pool
// ⚠️ Ensure your real password replaces 'your_password_here'
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hears_db',
    password: 'Wira$6924', 
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) return console.error('❌ Database connection failure:', err.stack);
    console.log('🔌 Successfully linked to the PostgreSQL database (hears_db)');
    release();
});

// 1. GET Route: Fetch live requests with tracking metrics
app.get('/api/requests', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM access_requests ORDER BY id DESC');
        
        const formattedRequests = result.rows.map(row => ({
            dbId: row.id, 
            id: `REQ-00${row.id}`,
            employeeName: `${row.first_name} ${row.last_name}`,
            department: row.department,
            system: row.systems_access.join(", "),
            date: row.created_at.toISOString().split('T')[0],
            status: row.status,
            tier: row.tier
        }));
        
        res.json(formattedRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database read failure" });
    }
});

// 2. POST Route: Submit a brand new entry
app.post('/api/requests/new', async (req, res) => {
    const data = req.body;
    const queryText = `
        INSERT INTO access_requests (
            hotel_code, employee_id, first_name, last_name, department, 
            designation, corporate_level, manager_name, systems_access, remarks, file_attached
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;
    `;
    const values = [
        data.hotelCode, data.employeeId, data.firstName, data.lastName, data.department,
        data.designation, data.corporateLevel, data.managerName, data.systemsAccess, data.remarks, data.fileAttached
    ];

    try {
        const result = await pool.query(queryText, values);
        res.status(201).json({ message: `Request successfully initialized!`, id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Write failure" });
    }
});

// 3. PUT Route: The 4-Tier Workflow Routing State Machine
app.put('/api/requests/:id/action', async (req, res) => {
    const dbId = req.params.id;
    const { action } = req.body; // Expects 'approve' or 'reject'

    try {
        // FIXED: Removed the non-existent 'current_name' field from the query statement below
        const checkResult = await pool.query('SELECT status, tier, first_name, last_name FROM access_requests WHERE id = $1', [dbId]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Target request record not found" });
        }

        const currentRecord = checkResult.rows[0];
        let nextTier = currentRecord.tier;
        let nextStatus = currentRecord.status;

        if (action === 'reject') {
            nextTier = 0;
            nextStatus = 'Rejected / Access Revoked';
        } else if (action === 'approve') {
            // Calculate state shifts sequentially up the 4 tiers
            if (currentRecord.tier === 1) {
                nextTier = 2;
                nextStatus = 'Pending Division Head Approval';
            } else if (currentRecord.tier === 2) {
                nextTier = 3;
                nextStatus = 'Pending FC Approval';
            } else if (currentRecord.tier === 3) {
                nextTier = 4;
                nextStatus = 'Pending GM Approval';
            } else if (currentRecord.tier === 4) {
                nextTier = 5; 
                nextStatus = 'Fully Approved & Provisioned';
            }
        }

        // Commit calculated states back directly into the database row
        await pool.query(
            'UPDATE access_requests SET tier = $1, status = $2 WHERE id = $3',
            [nextTier, nextStatus, dbId]
        );

        res.json({ 
            message: `Workflow state calculated: Request for ${currentRecord.first_name} is now ${nextStatus}.` 
        });

    } catch (err) {
        console.error("State Engine Failure:", err);
        res.status(500).json({ error: "Failed to recalculate workflow metrics" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 H-EARS Advanced Routing Engine running on http://127.0.0.1:${PORT}`);
});