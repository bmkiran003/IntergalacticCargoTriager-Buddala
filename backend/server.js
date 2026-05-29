const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Business Rule 3: System Override Middleware
// Express lowercases headers automatically, so we check 'x-system-override'
app.use((req, res, next) => {
    if (req.headers['x-system-override'] === 'true') {
        return res.status(418).send('System override denied.');
    }
    next();
});

// GET /api/cargo endpoint
app.get('/api/cargo', (req, res) => {
    // Navigate up one directory to read the JSON file from the monorepo root
    const dataPath = path.join(__dirname, '..', 'Task 1 - Buddala - Parser.json');
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading data:", err);
            return res.status(500).json({ error: "Failed to read cargo data." });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Cargo API listening at http://localhost:${PORT}`);
});