const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001; // Using 5001 to avoid default Mac conflicts

app.use(cors());
app.use(express.json());

// A test route for your H-EARS backend
app.get('/api/status', (req, res) => {
    res.json({ message: "H-EARS Backend is running smoothly!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});