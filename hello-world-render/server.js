require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection Pool

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});


pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Connection error", err));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Get listings from the database
app.get("/api/listings", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM listings");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// Serve HTML pages
app.get("/", (req, res) => res.redirect("/internet-listing"));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/add", (req, res) => res.sendFile(path.join(__dirname, "public", "addListing.html")));
app.get("/update", (req, res) => res.sendFile(path.join(__dirname, "public", "manageListing.html")));
app.get("/internet-listing", (req, res) => res.sendFile(path.join(__dirname, "public", "internetListing.html")));
app.get("/format", (req, res) => res.sendFile(path.join(__dirname, "public", "format.html")));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});