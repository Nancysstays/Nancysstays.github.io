export function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No hotels found.</p>';
        return;
    }

    results.forEach(hotel => {
        const hotelCard = `
            <div class="hotel-card">
                <h3>${hotel.name}</h3>
                <p>${hotel.formatted_address}</p>
                <img src="${hotel.photos[0].getUrl()}" alt="${hotel.name}"> 
            </div>
        `;
        resultsContainer.innerHTML += hotelCard;
    });
}

// ... (previous code)

// Remove the previous `showHotelDetails` function from this file, 
// as it's now in `map.js` and handles fetching details as well.

// ... (Rest of the code)
