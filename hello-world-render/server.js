const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));

// Dummy listings data
const listings = [
    {
        id: 1,
        heading: "Fast Car",
        image_url: "https://via.placeholder.com/150",
        speed: "200 mph",
        description: "A super fast sports car.",
        price: "$100,000",
        offer_Url: "#"
    },
    {
        id: 2,
        heading: "Luxury Car",
        image_url: "https://via.placeholder.com/150",
        speed: "180 mph",
        description: "Luxury and speed combined.",
        price: "$150,000",
        offer_Url: "#"
    },
    {
        id: 3,
        heading: "Eco Car",
        image_url: "https://via.placeholder.com/150",
        speed: "120 mph",
        description: "Eco-friendly and stylish.",
        price: "$40,000",
        offer_Url: "#"
    },
    {
        id: 4,
        heading: "Family Car",
        image_url: "https://via.placeholder.com/150",
        speed: "140 mph",
        description: "Perfect for road trips.",
        price: "$50,000",
        offer_Url: "#"
    }
];

// API route for listings data
app.get("/api/listings", (req, res) => {
    res.json(listings);
});

// Serve the static HTML for the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "listing.html"));
});

// Serve the static HTML for the admin page
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Serve React frontend for listings page
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get("/listings", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
