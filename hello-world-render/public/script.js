document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch listings data from backend API
        const response = await fetch("/api/internet-listings");
        const listings = await response.json();

        // Log the data to check the structure
        console.log(listings); // This will show you the actual structure of the listings

        // Optionally, you can process or display the data in another way, like appending to a table
        // For example, you can send this data to a table or use it elsewhere
    } catch (error) {
        console.error("Error loading listings:", error);
        document.body.innerHTML += "<p>Failed to load listings.</p>";
    }
});

async function loadSavedCSS() {
    try {
        const response = await fetch('/get-card-style');
        const data = await response.json();

        const cssCode = data.customCSS;
        if (cssCode) {
            // Apply the saved CSS to all cards
            const listingCards = document.querySelectorAll('.card');
            listingCards.forEach(card => {
                card.setAttribute('style', cssCode);
            });
        }
    } catch (error) {
        console.error('Error loading saved CSS:', error);
    }
}

// Load saved CSS when the page is loaded
loadSavedCSS();
