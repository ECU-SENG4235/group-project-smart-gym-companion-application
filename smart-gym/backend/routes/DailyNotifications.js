const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/daily-tip", (req, res) => {
    db.get("SELECT tip FROM tips ORDER BY RANDOM() LIMIT 1", [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve tip" });
        }
        res.json({ tip: row ? row.tip : "No tips available." });
    });
});

module.exports = router;
