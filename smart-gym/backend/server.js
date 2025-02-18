require("node_modules/dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpassword", 
    database: "userdb",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// User Registration Route
app.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "User registered successfully" });
    });
});

// Start Server
app.listen(8081, () => {
    console.log("Server running on port 8081");
});
