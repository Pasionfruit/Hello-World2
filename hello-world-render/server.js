require("dotenv").config();
const express = require("express");
const path = require("path");
const { Client } = require('pg');  // Only use Client here

const app = express();
const PORT = process.env.PORT || 3000;

// Create the PostgreSQL client instance
const client = new Client({
    connectionString: process.env.DATABASE_URL,  // Or specify your connection string here
    ssl: { rejectUnauthorized: false }
});

// Connect to the database
client.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Connection error", err));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Get listings from the database
app.get("/api/internet-listings", async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM "internet-listings"');
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