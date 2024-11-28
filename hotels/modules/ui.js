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

// modules/ui.js

// ... (previous code)

// Function to display hotel details in the modal
export function displayHotelDetails(place) { 
    const modalBody = document.querySelector('#hotelModal .modal-body');
    modalBody.innerHTML = ''; // Clear previous content

    const hotelInfo = `
        <div class="row">
            <div class="col-md-6">
                <div id="hotel-carousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${place.photos.map((photo, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${photo.getUrl()}" class="d-block w-100" alt="${place.name}">
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#hotel-carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#hotel-carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div class="col-md-6">
                <p><strong>Address:</strong> ${place.formatted_address}</p>
                ${place.rating ? `<p><strong>Rating:</strong> ${place.rating} stars</p>` : ''}
                ${place.website ? `<p><strong>Website:</strong> <a href="${place.website}" target="_blank">${place.website}</a></p>` : ''}
                ${place.international_phone_number ? `<p><strong>Phone:</strong> ${place.international_phone_number}</p>` : ''}
                <p><strong>Status:</strong> ${place.business_status}</p> 
                <h6>Reviews:</h6>
                <div id="reviews-container"></div>
            </div>
        </div>
    `;

    modalBody.innerHTML = hotelInfo;

    // Display reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (place.reviews) {
        place.reviews.forEach(review => {
            // ... (add review elements as before) 
        });
    } else {
        reviewsContainer.innerHTML = "<p>No reviews available.</p>";
    }
}

// ... (rest of the ui.js code)
