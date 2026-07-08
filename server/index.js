const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// In-Memory Array Array to track incoming items locally before database setup
let activeRequests = [
  { id: "REQ-001", system: "Opera, Windows Login", date: "2026-07-08", status: "Pending FC Approval", tier: 3 }
];

app.get('/api/requests', (req, res) => {
    res.json(activeRequests);
});

// Dynamic entry intercept mapping
app.post('/api/requests/new', (req, res) => {
    // Extract properties sent directly from React form state context
    const data = req.body;

    console.log("\n==============================================");
    console.log("📥 NEW INBOUND ACCESS REQUEST DISPATCHED:");
    console.log("==============================================");
    console.log(`🏨 Property Code:   ${data.hotelCode}`);
    console.log(`🆔 Employee ID:     ${data.employeeId}`);
    console.log(`👤 Name:            ${data.firstName} ${data.lastName}`);
    console.log(`🗂️ Department:      ${data.department}`);
    console.log(`💼 Title/Rank:      ${data.designation} (${data.corporateLevel})`);
    console.log(`🛡️ Direct Manager:  ${data.managerName}`);
    console.log(`🖥️ Apps Requested:  ${data.systemsAccess ? data.systemsAccess.join(", ") : 'None'}`);
    console.log(`📝 Remarks Context: ${data.remarks}`);
    console.log(`📎 Document Engine: ${data.fileAttached}`);
    console.log("==============================================\n");

    // Format item container to update tracker components visually
    const processedEntry = {
        id: `REQ-00${activeRequests.length + 1}`,
        system: data.systemsAccess && data.systemsAccess.length > 0 ? data.systemsAccess.join(", ") : "General Access",
        date: new Date().toISOString().split('T')[0],
        status: `Pending Approval: ${data.managerName} (Tier 1 Direct Report)`,
        tier: 1
    };

    activeRequests.push(processedEntry);

    // Return verification handshake straight back to React
    res.status(201).json({ 
      message: `Request for ${data.firstName} ${data.lastName} successfully routed to the 4-tier engine!`,
      data: processedEntry 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 H-EARS Live Integration engine running on http://localhost:${PORT}`);
});