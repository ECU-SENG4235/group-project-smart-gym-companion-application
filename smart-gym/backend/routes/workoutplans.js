const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/personal-plan', authenticateUser, (req, res) => {
    const userId = req.user.id;
    const workouts = req.body;
    
    // Validate that we received an array
    if (!Array.isArray(workouts) || workouts.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of workouts' });
    }
    
    // Prepare for multiple inserts
    const insertPromises = workouts.map(workout => {
        const { type, duration, repititions } = workout;
        
        // Validate each workout
        if (!type || !duration) {
            return Promise.reject('Each workout requires type and duration');
        }
        
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO workoutplans (user_id, type, duration, repititions) VALUES (?, ?, ?, ?)';
            db.run(query, [userId, type, duration, repititions], function(err) {
                if (err) {
                    console.error('Database error:', err.message);
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        type,
                        duration,
                        repititions
                    });
                }
            });
        });
    });
    
    // Execute all inserts
    Promise.all(insertPromises)
        .then(results => {
            res.status(201).json({
                message: 'Workout plan created successfully!',
                workoutPlans: results
            });
        })
        .catch(error => {
            console.error('Error creating workout plans:', error);
            res.status(400).json({ error: 'Failed to create workout plans: ' + error });
        });
});

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