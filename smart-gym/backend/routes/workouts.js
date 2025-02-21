const express = require("express");
const router = express.Router();
const db = require("../db"); 
const authenticateUser = require("../middleware/authMiddleware"); // Ensure user is authenticated

// POST: Log a workout
router.post("/", authenticateUser, (req, res) => {
    const { type, duration } = req.body;
    const userId = req.user.id;

    if (!type || !duration) {
        return res.status(400).json({ error: "Please provide workout type and duration" });
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const query = "INSERT INTO workouts (user_id, date, type, duration) VALUES (?, ?, ?, ?)";

    db.run(query, [userId, date, type, duration], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ 
            message: "Workout logged successfully!", 
            workout: { id: this.lastID, date, type, duration } 
        });
    });
});


// GET: Fetch user's workout history
router.get("/", authenticateUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = "SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC";
        const [workouts] = await db.query(query, [userId]);

        res.json(workouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// GET: Fetch today's workouts
router.get("/today", authenticateUser, async (req, res) => {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    try {
        const query = "SELECT type, duration FROM workouts WHERE user_id = ? AND date = ?";
        const [workouts] = await db.query(query, [userId, today]);

        res.json({ workouts });
    } catch (error) {
        console.error("Error fetching today's workouts:", error);
        res.status(500).json({ error: "Database error" });
    }
});


module.exports = router;
