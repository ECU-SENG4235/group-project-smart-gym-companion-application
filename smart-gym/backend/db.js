const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./userdb.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected");
    }
});

module.exports = db;

const db = require('./server');

db.run(`CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tip TEXT NOT NULL
)`, (err) => {
    if (err) console.error("Error creating tips table:", err.message);
    else console.log("Tips table is ready.");
});

db.get("SELECT COUNT(*) AS count FROM tips", (err, row) => {
    if (row.count === 0) {
        const sampleTips = [
            "Stay hydrated throughout your workout!",
            "Consistency is key—small daily improvements lead to big results.",
            "Make exercise a habit, not a chore.",
            "Warm-up before workouts to prevent injuries.",
            "Don't compare your journey to others.",
            "Rest and recovery are just as important as training."
        ];
        sampleTips.forEach(tip => {
            db.run("INSERT INTO tips (tip) VALUES (?)", [tip], (err) => {
                if (err) console.error("Error inserting tip:", err.message);
            });
        });
    }
});

module.exports = db;
