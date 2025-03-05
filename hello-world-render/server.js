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

// Get a specific listing by ID
app.get('/api/internet-listings/:id', async (req, res) => {
    const listingId = parseInt(req.params.id);  // Get the ID from the URL

    try {
        const result = await client.query('SELECT * FROM "internet-listings" WHERE id = $1', [listingId]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);  // Send the listing as a JSON response
        } else {
            res.status(404).send('Listing not found');
        }
    } catch (error) {
        console.error("Error fetching listing data:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Serve HTML pages
app.get("/", (req, res) => res.redirect("/internet-listing"));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/add", (req, res) => res.sendFile(path.join(__dirname, "public", "addListing.html")));
app.get("/internet-listing", (req, res) => res.sendFile(path.join(__dirname, "public", "internetListing.html")));
app.get("/format", (req, res) => res.sendFile(path.join(__dirname, "public", "format.html")));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.json());

// Route to handle saving custom CSS for card styling
app.post('/save-card-style', (req, res) => {
    const { customCSS } = req.body;

    // Save the custom CSS to the database (you can modify this to store it wherever you like)
    const query = 'INSERT INTO card_styles (css_code) VALUES ($1) RETURNING id';
    client.query(query, [customCSS])
        .then(result => {
            res.status(200).send({ message: 'CSS saved successfully' });
        })
        .catch(error => {
            console.error('Error saving CSS:', error);
            res.status(500).send({ message: 'Failed to save CSS' });
        });
});

// Handle adding a new listing
app.post('/api/add-listing', async (req, res) => {
    const { heading, image_url, speed, description, price, offer_Url } = req.body;

    // Validate input (optional)
    if (!heading || !image_url || !speed || !description || !price || !offer_Url) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Add the listing to your database (e.g., using PostgreSQL)
    try {
        const query = `
            INSERT INTO "internet-listings" (heading, image_url, speed, description, price, offer_url) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [heading, image_url, speed, description, price, offer_Url];
        const result = await client.query(query, values);

        // Respond with the newly added listing
        res.json({ success: true, message: 'Listing added successfully!', listing: result.rows[0] });
    } catch (error) {
        console.error('Error adding listing:', error);
        res.status(500).json({ success: false, message: 'Failed to add listing.' });
    }
});

// Handle edit listing page
app.get('/edit-listing/:id', (req, res) => {
    const listingId = req.params.id;  
    res.sendFile(path.join(__dirname, 'public', 'editListing.html'));
});
