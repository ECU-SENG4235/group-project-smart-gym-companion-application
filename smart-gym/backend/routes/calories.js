const express = require("express");
const router = express.Router();
const db = require("../db"); 
const authenticateUser = require("../middleware/authMiddleware");


router.post("/", authenticateUser, (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount) {
        return res.status(400).json({ error: "Please provide calorie amount" });
    }

    const date = new Date().toISOString().split("T")[0];
    const query = "INSERT INTO calories (user_id, date, amount) VALUES (?, ?, ?)";

    db.run(query, [userId, date, amount], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ 
            message: "Calories logged successfully!", 
            calorie: { id: this.lastID, date, amount } 
        });
    });
    }
);

router.get("/", authenticateUser, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = "SELECT * FROM calories WHERE user_id = ? ORDER BY date DESC";
        const [calories] = db.query(query, [userId]);

        res.json(calories);
    }
    catch (error) {
        console.error("Error fetching calories:", error);
        res.status(500).json({ error: "Database error" });
    }
});

router.get("/today", authenticateUser , (req, res) => {
    const userId = req.user.id; 
    const today = new Date().toISOString().split("T")[0]; 

    const query = "SELECT amount FROM calories WHERE user_id = ? AND date = ?";
    db.all(query, [userId, today], (err, calories) => {
        if (err) {
            console.error("Error fetching today's calories:", err);
            return res.status(500).json({ error: "Database error" });
        }
        const totalCalories = calories.reduce((acc, c) => acc + c.amount, 0);
        
        res.json({ totalCalories}); 
    });
})

module.exports = router;