const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./userdb.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected");
    }
});

module.exports = db;
