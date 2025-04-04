const express = require("express");
const router = express.Router();
const db = require("../db"); 
const authenticateUser = require("../middleware/authMiddleware");
const { route } = require("./challenges");

router.get("/", authenticateUser, (req, res) => {
    db.all(`SELECT * FROM goals`, [], (err, goals) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ goals})
    })
})

router.get("/user", authenticateUser, (req, res) => {
    const userId = req.user.id;

    db.all(`SELECT g.*, g.title, g.description, g.duration
        FROM user_goals ug
        JOIN goals g ON ug.goal_id = g.id
        WHERE ug.user_id = ?`,
        [userId],
        (err, userGoals) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: err.message });
            }
            console.log("User goals found:", userGoals);
            res.json({ userGoals });
        }
    );
})

router.get("/:goalId", authenticateUser, (req, res) => {
    const { goalId } = req.params;

    db.get(
        `SELECT * FROM goals WHERE id = ?`,
        [goalId],
        (err, goal) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (!goal) {
                return res.status(404).json({ error: "Goal not found" });
            }
            
            res.json(goal);
        }
    )
})

module.exports = router;