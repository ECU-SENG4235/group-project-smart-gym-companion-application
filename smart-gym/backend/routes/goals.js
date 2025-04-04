const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authenticateUser  = require('../middleware/authMiddleware'); 

router.post("/", authenticateUser , (req, res) => { 
    const userId = req.user.id;
    const { title, description, duration } = req.body;  

    if (!title || !description || !duration) {
        return res.status(400).json({ error: "All fields are required" });
    }
    db.run(
        `INSERT INTO goals (title, description, duration, user_id) VALUES (?, ?, ?, ?)`,
        [title, description, duration, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                title,
                description,
                duration,
                user_id: userId
            });
        }
    );
});

router.delete("/:goalId", authenticateUser, (req, res) => {
    const goalId = req.params.goalId;
    const userId = req.user.id;

    db.run(
        `DELETE FROM goals WHERE id = ? AND user_id = ?`,
        [goalId, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Goal not found" });
            }
            res.status(204).send();
        }
    );
});

router.put("/:goalId/complete", authenticateUser, (req, res) => {
    const userId = req.user.id;
    const goalId = req.params.goalId;

    db.run(
        `UPDATE goals SET completed = 1 WHERE id = ? AND user_id = ?`,
        [goalId, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Goal not found" });
            }
            res.status(200).json({ message: "Goal marked as completed" });
        }
    )
})

router.get("/user", authenticateUser, (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT * FROM goals WHERE user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows);
        }
    );
});

module.exports = router;