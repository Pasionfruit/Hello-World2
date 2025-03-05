document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/listings");
        const listings = await response.json();

        const listingsContainer = document.getElementById("listings-container") || document.createElement("div");
        listingsContainer.id = "listings-container";
        listingsContainer.innerHTML = ""; // Clear existing content
        listingsContainer.style.display = "flex";
        listingsContainer.style.flexWrap = "wrap";
        listingsContainer.style.gap = "20px";
        listingsContainer.style.padding = "20px";

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
                <a href="${listing.offer_url}" target="_blank">View Offer</a>
            `;

            listingsContainer.appendChild(card);
        });

        document.body.appendChild(listingsContainer);
    } catch (error) {
        console.error("Error loading listings:", error);
        document.body.innerHTML += "<p>Failed to load listings.</p>";
    }
});
