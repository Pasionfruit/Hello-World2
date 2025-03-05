document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch listings data from backend API
        const response = await fetch("/api/internet-listings");
        const listings = await response.json();

        // Log the data to check the structure
        console.log(listings); // This will show you the actual structure of the listings

        // Create and style the container to hold listings
        const listingsContainer = document.createElement("div");
        listingsContainer.style.display = "flex";
        listingsContainer.style.flexWrap = "wrap";
        listingsContainer.style.gap = "20px";
        listingsContainer.style.padding = "20px";

        // Loop through the listings and create a card for each
        listings.forEach(listing => {
            const card = document.createElement("div");
            card.style.border = "1px solid #ddd";
            card.style.padding = "10px";
            card.style.borderRadius = "8px";
            card.style.width = "200px";

            card.innerHTML = `
                <h3>${listing.heading}</h3>
                <img src="${listing.image_url}" alt="${listing.heading}" style="width: 100%; height: 100px; object-fit: cover;">
                <p>${listing.description}</p>
                <p>Speed: ${listing.speed}</p>
                <p>Price: $${listing.price}</p>
                <a href="${listing.offer_Url}" target="_blank">View Offer</a>
            `;

            listingsContainer.appendChild(card);
        });

        // Append the listings to the page
        document.body.appendChild(listingsContainer);
    } catch (error) {
        console.error("Error loading listings:", error);
        document.body.innerHTML += "<p>Failed to load listings.</p>";
    }
});
