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
