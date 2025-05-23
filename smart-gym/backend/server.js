const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const cron = require("node-cron"); 

const app = express();
const PORT = 4000;
const calorieRoutes = require("./routes/calories");
const workoutRoutes = require("./routes/workouts");
const profileRoutes = require('./routes/profile');
const notificationRoutes = require("./routes/DailyNotifications");
const challengeRoutes = require("./routes/challenges");
const socialSharingRoutes = require("./routes/socialSharing");
const goalRoutes = require("./routes/goals");
const workoutPlansRoutes = require("./routes/workoutplans");

app.use(express.json());
app.use(cors());
app.use("/api/workouts", workoutRoutes);
app.use("/api/calories", calorieRoutes);
app.use("/api/DailyNotifications", notificationRoutes); 
app.use('/profile', profileRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/share", socialSharingRoutes); 
app.use("/api/goals", goalRoutes);
app.use("/api/workout-plans", workoutPlansRoutes);

const db = new sqlite3.Database("./new_userdb.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
});

module.exports = db;

cron.schedule("0 9 * * *", () => {
    db.get("SELECT tip FROM tips ORDER BY RANDOM() LIMIT 1", [], (err, row) => {
        if (!err && row) {
            console.log(`📢 Daily Motivation: ${row.tip}`);
        }
    });
}, {
    scheduled: true,
    timezone: "America/New_York"
});

db.run(`ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0`, [], (err) => {
    console.log("Ensuring users table has points column");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "Email not found" });

        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: "Incorrect password" });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "your_secret_key", { expiresIn: '1h' });
            res.json({ message: "Login successful", token, user });
        } catch (compareError) {
            res.status(500).json({ error: "Error verifying password" });
        }
    });
});

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message }); // Handle query error
        if (user) return res.status(400).json({ error: "Email already exists" });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (insertErr) => {
                if (insertErr) return res.status(500).json({ error: insertErr.message });
                res.json({ message: "Signup successful" });
            });
        } catch (hashError) {
            res.status(500).json({ error: "Error hashing password" });
        }
    });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));