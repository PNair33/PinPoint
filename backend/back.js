const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(cors());

// Database setup
const db = new sqlite3.Database('./incidents.db', (err) => {
    if (err) console.error(err);
    else console.log("Connected to database");
});

db.run(`CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL, 
    longitude REAL, 
    type TEXT, 
    description TEXT
)`);

// API Routes
app.post('/api/incidents', (req, res) => {
    const { latitude, longitude, type, description } = req.body;
    db.run(`INSERT INTO incidents (latitude, longitude, type, description) VALUES (?, ?, ?, ?)`,
        [latitude, longitude, type, description], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

app.get('/api/incidents', (req, res) => {
    db.all("SELECT * FROM incidents", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
