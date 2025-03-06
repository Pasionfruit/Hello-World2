require("dotenv").config();
const express = require("express");
const path = require("path");
const { Client } = require('pg');  // Only use Client here

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Handle adding a new listing
app.post('/api/add-listing', async (req, res) => {
    const { heading, image_url, speed, description, price, offer_url, card_style } = req.body;

    // Validate input (optional)
    if (!heading || !image_url || !speed || !description || !price || !offer_url) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Add the listing to your database (e.g., using PostgreSQL)
    try {
        const query = `
            INSERT INTO "internet-listings" (heading, image_url, speed, description, price, offer_url, card_style) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [heading, image_url, speed, description, price, offer_url, card_style];
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

app.put('/api/internet-listings/:id', async (req, res) => {
    const listingId = parseInt(req.params.id);
    const { heading, image_url, speed, description, price, offer_url, card_style } = req.body;

    try {
        const query = `
            UPDATE "internet-listings" 
            SET heading = $1, image_url = $2, speed = $3, description = $4, price = $5, offer_url = $6, card_style = $7
            WHERE id = $8
            RETURNING *;
        `;
        const values = [heading, image_url, speed, description, price, offer_url, listingId, card_style];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Listing updated successfully!', listing: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (error) {
        console.error("Error updating the listing:", error);
        res.status(500).json({ error: "Failed to update the listing" });
    }
});

// Delete a specific listing by ID
app.delete('/api/internet-listings/:id', async (req, res) => {
    const listingId = parseInt(req.params.id);  // Get the ID from the URL

    try {
        const result = await client.query('DELETE FROM "internet-listings" WHERE id = $1 RETURNING *', [listingId]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Listing deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({ message: 'Failed to delete the listing' });
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