import { getLocation } from './geolocation.js';
import './formHandler.js';
import './slideshow.js';
import './parallax.js';

// Initialize geolocation
getLocation();

const routes = {
    '/': 'search-form.html' // Default route
};

async function loadContent() {
    const path = window.location.pathname === '/' ? '/' : window.location.pathname;
    const route = routes[path];

    if (route) {
      try {
        const response = await fetch(route);
        const content = await response.text();
        document.getElementById('app').innerHTML = content;

        // Add any necessary scripts or styles specific to components here if needed
        // Example: loadComponentSpecificResources(route); 
      
      } catch (error) {
        console.error("Failed to load content:", error);
        document.getElementById('app').innerHTML = "<p>Error loading content.</p>";
      }
    } else {
        document.getElementById('app').innerHTML = "<p>404 - Page Not Found</p>";
    }
}


window.addEventListener('DOMContentLoaded', loadContent);

window.addEventListener('popstate', loadContent);  // Handle back/forward buttons

// Optional:  Intercept link clicks to handle routing internally
document.addEventListener('click', (event) => {
    const target = event.target.closest('a');

    if (target && target.href.startsWith(window.location.origin)) {
      event.preventDefault();
      window.history.pushState({}, '', target.href); // Update URL without reloading
      loadContent();
    }
});