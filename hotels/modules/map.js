let map;
let autocomplete;

export function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.7392, lng: -104.9903 }, // Default to Denver
        zoom: 12
    });

    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('hotel-search'), {
            types: ['lodging'], // Search for hotels only
            fields: ['place_id', 'name', 'geometry', 'formatted_address', 'photos'] 
        }
    );

    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15); 
    } 
}

export async function searchHotels(searchTerm) {
    // ... (Use Google Maps Places API to search for hotels)
}

// modules/map.js (continued)

// ... (previous code from searchHotels and displayMarkers)

// Function to handle marker clicks and show hotel details
function handleMarkerClick(hotel) {
    showHotelDetails(hotel); 
}

// Function to display hotel details with additional information
export async function showHotelDetails(hotel) {
    // Fetch place details using Places API
    const request = {
        placeId: hotel.place_id, 
        fields: ['name', 'formatted_address', 'rating', 'website', 'review', 'photos']
    };

    const service = new google.maps.places.PlacesService(map);

    service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Create a modal element (using Bootstrap or custom)
            const modal = `
                <div class="modal fade" id="hotelModal" tabindex="-1" aria-labelledby="hotelModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg"> 
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="hotelModalLabel">${place.name}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row"> 
                                    <div class="col-md-6"> 
                                        <img src="${place.photos[0].getUrl()}" alt="${place.name}" class="img-fluid">
                                    </div>
                                    <div class="col-md-6"> 
                                        <p><strong>Address:</strong> ${place.formatted_address}</p>
                                        <p><strong>Rating:</strong> ${place.rating} stars</p> 
                                        <p><strong>Website:</strong> <a href="${place.website}" target="_blank">${place.website}</a></p>
                                        <h6>Reviews:</h6>
                                        <div id="reviews-container">
                                            </div> 
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Book Now</button> 
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add the modal to the DOM
            document.body.innerHTML += modal;

            // Display reviews
            const reviewsContainer = document.getElementById('reviews-container');
            if (place.reviews) {
                place.reviews.forEach(review => {
                    const reviewElement = `
                        <p>${review.text}</p>
                        <p><strong>Rating:</strong> ${review.rating} stars - by ${review.author_name}</p>
                    `;
                    reviewsContainer.innerHTML += reviewElement;
                });
            } else {
                reviewsContainer.innerHTML = "<p>No reviews available.</p>";
            }

            // Initialize the Bootstrap modal
            const hotelModal = new bootstrap.Modal(document.getElementById('hotelModal'));
            hotelModal.show();
        } else {
            console.error("Error fetching place details:", status);
            // ... (Handle error, e.g., display an error message to the user)
        }
    });
}

// ... (Rest of the code)

// modules/map.js

// ... (previous code)

export async function showHotelDetails(placeId) {
    // ... (fetch place details as before)

    try {
        const place = await fetchPlaces(request, service); 

        // Display the modal with hotel details
        displayHotelDetails(place); // Call the function from ui.js

        // Add a booking button click handler
        const bookNowButton = document.querySelector('#hotelModal .btn-primary');
        bookNowButton.onclick = () => handleBooking(place); 

    } catch (error) { 
        // ... (error handling)
    }
}

// Function to handle the "Book Now" button click
async function handleBooking(place) {
    // 1. Get user information (if logged in)
    const user = getUserProfile(); // From auth.js

    // 2. Create booking data object
    const bookingData = {
        userId: user ? user.id : null, // Associate with user if logged in
        hotel: {
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address
            // ... other relevant details
        },
        // ... (add booking date, number of guests, etc.)
    };

    // 3. Store booking data (e.g., in IndexedDB)
    try {
        await addBooking(bookingData); // From storage.js
        // ... (Optionally display a success message to the user)
    } catch (error) {
        // ... (Handle error - e.g., display an error message)
    }
}

// ... (rest of the map.js code)


// modules/map.js

// ... (previous code)

export function initMap() {
    // ... (map and autocomplete initialization)

    // Get user's location (if allowed)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation); 

                // Add a marker for the user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE, 
                        scale: 8,
                        fillColor: '#4285F4', // Google blue
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    }
                });
            },
            (error) => {
                console.error("Error getting user's location:", error);
                // ... (Handle error, e.g., use a default location)
            }
        );
    } else {
        // ... (Browser doesn't support geolocation)
    }
}

// ... (rest of the map.js code)
