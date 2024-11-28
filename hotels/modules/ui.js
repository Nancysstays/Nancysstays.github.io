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

// modules/ui.js

// ... (previous code)

// Function to display booking history in a dedicated section
export function displayBookingHistory(bookings) {
    const historyContainer = document.getElementById('booking-history'); 
    historyContainer.innerHTML = ''; // Clear previous bookings

    if (bookings.length === 0) {
        historyContainer.innerHTML = '<p>No bookings found.</p>';
        return;
    }

    const bookingsList = document.createElement('ul');
    bookings.forEach(booking => {
        const bookingItem = `
            <li>
                <strong>${booking.hotel.name}</strong>
                <p>${booking.hotel.address}</p>
                <p>Booking ID: ${booking.id}</p> 
                <button class="btn btn-danger btn-sm delete-booking" data-booking-id="${booking.id}">Cancel</button> 
            </li>
        `;
        bookingsList.innerHTML += bookingItem;
    });

    historyContainer.appendChild(bookingsList);

    // Add event listeners for "Cancel" buttons
    const deleteButtons = document.querySelectorAll('.delete-booking');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.dataset.bookingId;
            // ... (Call a function to delete the booking from IndexedDB and update the UI)
            deleteBooking(bookingId)
                .then(() => {
                    // Update the booking history display
                    getAllBookings()
                        .then(updatedBookings => {
                            displayBookingHistory(updatedBookings);
                        });
                });
        });
    });
}

// ... (rest of the ui.js code)

// modules/ui.js

// ... (previous code)

export function displayResults(results) {
    // ... (Clear previous results)

    results.forEach(hotel => {
        const hotelCard = `
            <div class="hotel-card">
                <h3>${hotel.name}</h3>
                <p>${hotel.formatted_address}</p>
                ${hotel.distance ? `<p>Distance: ${hotel.distance.toFixed(2)} km</p>` : ''} 
                <img src="${hotel.photos[0].getUrl()}" alt="${hotel.name}">
            </div>
        `;
        resultsContainer.innerHTML += hotelCard;
    });
}

// ... (rest of the ui.js code)
// modules/ui.js

// ... (previous code)

export function displayResults(results) {
    // ... (Clear previous results)

    // Create a list element for the results
    const resultsList = document.createElement('ul');
    resultsList.classList.add('list-group'); // Add Bootstrap list group class

    results.forEach(hotel => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item'); 

        const hotelCard = `
            <div class="hotel-card">
                <h3>${hotel.name}</h3>
                <p>${hotel.formatted_address}</p>
                ${hotel.distance ? `<p>Distance: ${hotel.distance.toFixed(2)} km</p>` : ''}
                <img src="${hotel.photos[0].getUrl()}" alt="${hotel.name}" class="img-fluid"> 
            </div>
        `;
        listItem.innerHTML = hotelCard;
        resultsList.appendChild(listItem); 
    });

    resultsContainer.appendChild(resultsList); 
}

// ... (rest of the ui.js code)
