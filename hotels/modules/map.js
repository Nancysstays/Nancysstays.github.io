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
