// Get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // Use a geocoding API to get city, state, and country
    $.ajax({
        url: `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=bd5bf5f7af774654843e7447041e6f72`,
        success: function(response) {
            var city = response.results[0].components.city;
            var state = response.results[0].components.state;
            var country = response.results[0].components.country;

            // Set the destination input field
            $('#destination').val(`${city}, ${state}, ${country}`);

            // Set the check-in and check-out dates
            var today = new Date();
            var checkInDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
            var checkOutDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);

            $('#checkInDate').val(checkInDate.toISOString().split('T')[0]);
            $('#checkOutDate').val(checkOutDate.toISOString().split('T')[0]);

            // Check if user data is stored in local storage
            var storedDestination = localStorage.getItem('destination');
            if (storedDestination) {
                $('#destination').val(storedDestination);
            }
        }
    });
}

getLocation();

// Form submission handler (avoid scraping or directly linking to Expedia results)
const form = document.getElementById('hotelSearchForm');
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Display a message to the user, informing them that they will be redirected to Expedia
    alert('You will be redirected to Expedia to view hotel search results.');

    // Store user input in local storage
    localStorage.setItem('destination', $('#destination').val());

    // Redirect the user to the Expedia user input version of the site
    const destination = document.getElementById('destination').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guests').value;

    const expediaUrl = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}&flexibility=0_DAY&d1=${checkInDate}&startDate=${checkInDate}&d2=${checkOutDate}&endDate=${checkOutDate}&adults=${guests}&rooms=1&theme=&userIntent=&semdtl=&useRewards=true&sort=RECOMMENDED`;

    window.location.href = expediaUrl;
});

// Parallax effect
window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var parallaxElement = document.querySelector('.parallax-element');
    parallaxElement.style.transform = 'translateY(' + scrollY * 0.5 + 'px)';
});

// Trigger search on Expedia widget
function triggerExpediaSearch() {
  // Assuming the Expedia widget is in an iframe with id 'expedia-iframe'
  const iframe = document.getElementById('expedia-iframe');

  // You might need to adjust the selector and event type based on the widget's structure
  const submitButton = iframe.contentDocument.querySelector('.submit-button'); // Replace '.submit-button' with the actual selector
  submitButton.click();
}

// Trigger the search when the user clicks the "Search Expedia" button
document.getElementById('hotelSearchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  triggerExpediaSearch();
});

// ... (rest of your JavaScript code)

// Trigger search on Expedia widget
function triggerExpediaSearch() {
  const iframe = document.getElementById('expedia-iframe');

  // Wait for the Expedia widget to load before focusing on the input
  const intervalId = setInterval(() => {
    const inputElement = iframe.contentDocument.querySelector('.expedia-input'); // Replace '.expedia-input' with the actual class or ID of the input element

    if (inputElement) {
      clearInterval(intervalId);
      inputElement.focus();
    }
  }, 100); // Adjust the interval as needed
}
