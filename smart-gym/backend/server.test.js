const request = require("supertest");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");


const app = express();
app.use(express.json());

const db = new sqlite3.Database(":memory:");

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "Email not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Incorrect password" });

        res.json({ message: "Login successful", user });
    });
});

beforeAll((done) => {
    db.serialize(() => {
        db.run("CREATE TABLE users (email TEXT, password TEXT)", done);
    });
});

afterAll((done) => {
    db.close(done);
});

describe("POST /login", () => {
    beforeEach((done) => {
        const hashedPassword = bcrypt.hashSync("password123", 10);
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", ["test@example.com", hashedPassword], done);
    });

    afterEach((done) => {
        db.run("DELETE FROM users", done);
    });

    it("should return 400 if email not found", async () => {
        const res = await request(app)
            .post("/login")
            .send({ email: "nonexistent@example.com", password: "password123" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email not found");
    });

    it("should return 401 if password is incorrect", async () => {
        const res = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "wrongpassword" });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("Incorrect password");
    });

    it("should return 200 if login is successful", async () => {
        const res = await request(app)
            .post("/login")
            .send({ email: "test@example.com", password: "password123" });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

    const app = express();
    app.use(express.json());

    const db = new sqlite3.Database(":memory:");

    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(400).json({ error: "Email not found" });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: "Incorrect password" });

            res.json({ message: "Login successful", user });
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

    beforeAll((done) => {
        db.serialize(() => {
            db.run("CREATE TABLE users (email TEXT, password TEXT)", done);
        });
    });

    afterAll((done) => {
        db.close(done);
    });

    describe("POST /login", () => {
        beforeEach((done) => {
            const hashedPassword = bcrypt.hashSync("password123", 10);
            db.run("INSERT INTO users (email, password) VALUES (?, ?)", ["test@example.com", hashedPassword], done);
        });

        afterEach((done) => {
            db.run("DELETE FROM users", done);
        });

        it("should return 400 if email not found", async () => {
            const res = await request(app)
                .post("/login")
                .send({ email: "nonexistent@example.com", password: "password123" });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Email not found");
        });

        it("should return 401 if password is incorrect", async () => {
            const res = await request(app)
                .post("/login")
                .send({ email: "test@example.com", password: "wrongpassword" });
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Incorrect password");
        });

        it("should return 200 if login is successful", async () => {
            const res = await request(app)
                .post("/login")
                .send({ email: "test@example.com", password: "password123" });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Login successful");
            expect(res.body.user).toHaveProperty("email", "test@example.com");
        });
    });

    describe("POST /signup", () => {
        afterEach((done) => {
            db.run("DELETE FROM users", done);
        });

        it("should return 400 if email already exists", async () => {
            const hashedPassword = bcrypt.hashSync("password123", 10);
            db.run("INSERT INTO users (email, password) VALUES (?, ?)", ["test@example.com", hashedPassword], async () => {
                const res = await request(app)
                    .post("/signup")
                    .send({ email: "test@example.com", password: "password123" });
                expect(res.statusCode).toBe(400);
                expect(res.body.error).toBe("Email already exists");
            });
        });

        it("should return 200 if signup is successful", async () => {
            const res = await request(app)
                .post("/signup")
                .send({ email: "newuser@example.com", password: "password123" });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Signup successful");
        });
    });
});
