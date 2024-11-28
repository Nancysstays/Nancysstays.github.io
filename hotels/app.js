// Import modules
import { initAuth } from './modules/auth.js';
import { initMap, searchHotels } from './modules/map.js';
import { displayResults } from './modules/ui.js';

// Initialize
initAuth(); 
initMap();

// Event listeners
document.getElementById('hotel-search').addEventListener('input', () => {
    const searchTerm = document.getElementById('hotel-search').value;
    searchHotels(searchTerm)
        .then(results => {
            displayResults(results);
        }); 
});

// ... (previous code)

// Event listener for hotel selection from search results
resultsContainer.addEventListener('click', (event) => {
    // ... (Logic to identify the selected hotel from the results list)
    const selectedHotel = // ... ; 
    showHotelDetails(selectedHotel); 
});

// Event listener for marker clicks on the map
google.maps.event.addListener(map, 'click', function(event) {
    // Check if the click was on a marker
    if (event.placeId) {
        // Fetch details for the clicked marker
        const request = {
            placeId: event.placeId, 
            fields: ['name', 'formatted_address', 'photos'] 
        };

        const service = new google.maps.places.PlacesService(map);
        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                showHotelDetails(place);
            } else {
                // ... (Handle error)
            }
        });
    }
});
