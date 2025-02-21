const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const workoutRoutes = require("./routes/workouts");
const fetchRoutes = require("./routes/fetch");

app.use(express.json());
app.use(cors());
app.use("/api/workouts", workoutRoutes);


const db = new sqlite3.Database("./userdb.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
});

module.exports = db;


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "Email not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "your_secret_key", { expiresIn: '1h' });

        res.json({ message: "Login successful", token, user });
    });
});


app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (user) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Signup successful" });
        });
    });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

