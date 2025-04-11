const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/personal-plan', authenticateUser, (req, res) => {
    const { type, duration} = req.body
    const userId = req.user.id;

    if (!type || !duration) {
        return res.status(400).json({ error: 'Please provide workout type and duration' });
    }

    const query = 'INSERT INTO workoutplans (user_id, type, duration, repititions ) VALUES (?, ?, ?, ?)';
    db.run(query, [userId, type, duration], function (err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({
            message: 'Workout plan created successfully!',
            workoutPlan: { id: this.lastID, type, duration }
        });
    });
})

router.get('/personal-plan', authenticateUser, (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM workoutplans WHERE user_id = ?';
    db.all(query, [userId], (err, workoutPlans) => {
        if (err) {
            console.error('Error fetching workout plans:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ workoutPlans });
    });
});

module.exports = router;