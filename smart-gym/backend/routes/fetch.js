// backend/routes/fetch.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Your database connection

// Example route to fetch users
router.get('/users', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users'); // Example query
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
