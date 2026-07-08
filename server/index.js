const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import the PostgreSQL client package

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 1. Configure the PostgreSQL Connection Pool
// ⚠️ REPLACE 'your_password_here' WITH THE PASSWORD YOU SET DURING POSTGRESQL INSTALLATION!
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hears_db',
    password: 'Wira$6924', 
    port: 5432,
});

// Test the database connection on startup
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Database connection failure:', err.stack);
    }
    console.log('🔌 Successfully linked to the PostgreSQL database (hears_db)');
    release();
});

// 2. GET Route: Fetch live requests directly from PostgreSQL rows
app.get('/api/requests', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM access_requests ORDER BY id DESC');
        
        // Convert the database rows back into the exact JSON format React expects
        const formattedRequests = result.rows.map(row => ({
            id: `REQ-00${row.id}`,
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

// 3. POST Route: Insert a new request row into PostgreSQL safely
app.post('/api/requests/new', async (req, res) => {
    const data = req.body;

    const queryText = `
        INSERT INTO access_requests (
            hotel_code, employee_id, first_name, last_name, department, 
            designation, corporate_level, manager_name, systems_access, remarks, file_attached
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id;
    `;

    const values = [
        data.hotelCode, data.employeeId, data.firstName, data.lastName, data.department,
        data.designation, data.corporateLevel, data.managerName, data.systemsAccess, data.remarks, data.fileAttached
    ];

    try {
        const result = await pool.query(queryText, values);
        const newId = result.rows[0].id;

        res.status(201).json({ 
            message: `Request for ${data.firstName} ${data.lastName} successfully written to PostgreSQL with Row ID: ${newId}!`,
            id: newId
        });
    } catch (err) {
        console.error("Database insert failure:", err);
        res.status(500).json({ error: "Failed to write data to database" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 H-EARS Live Integration engine running on http://127.0.0.1:${PORT}`);
});