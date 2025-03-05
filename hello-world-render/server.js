const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Dummy listings data
const listings = [
    { id: 1, heading: "Test 1", image_url: "https://via.placeholder.com/150", speed: "20 mbps", description: "A super fast sports car.", price: "100", offer_Url: "#" },
    { id: 2, heading: "Test 2", image_url: "https://via.placeholder.com/150", speed: "18 mbps", description: "Luxury and speed combined.", price: "150", offer_Url: "#" },
    { id: 3, heading: "Test 3", image_url: "https://via.placeholder.com/150", speed: "12 mbps", description: "Eco-friendly and stylish.", price: "40", offer_Url: "#" },
    { id: 4, heading: "Test 4", image_url: "https://via.placeholder.com/150", speed: "14 mbps", description: "Perfect for road trips.", price: "50", offer_Url: "#" }
];

app.get("/api/listings", (req, res) => {
    res.json(listings);
});

app.get("/", (req, res) => res.redirect("/listing"));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/add", (req, res) => res.sendFile(path.join(__dirname, "public", "addListing.html")));
app.get("/update", (req, res) => res.sendFile(path.join(__dirname, "public", "manageListing.html")));
app.get("/listing", (req, res) => res.sendFile(path.join(__dirname, "public", "listing.html")));
app.get("/format", (req, res) => res.sendFile(path.join(__dirname, "public", "format.html")));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
