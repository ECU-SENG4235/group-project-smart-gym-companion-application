const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./userdb.db", (err) => {
    if (err) {
        console.error("Error connecting to SQLite database:", err);
    } else {
        console.log("Connected to SQLite database");
    }
});


app.get("/api/data", (req, res) => {
    db.all("SELECT id, email FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: "Server error" });
        } else {
            res.json(rows);
        }
    });
});

app.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.run(query, [email, password], function (err) {
        if (err) {
            return res.status(500).json({ message: "User registration failed" });
        }
        res.status(201).json({ message: "User registered successfully", userId: this.lastID });
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
