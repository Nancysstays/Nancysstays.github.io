function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
    }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGEDATA_API_KEY`)
    .then(response => response.json())
    .then(response => {
      if (response.results && response.results.length > 0) {
        const city = response.results[0].components.city || '';
        const state = response.results[0].components.state || '';
        const country = response.results[0].components.country || '';
        document.getElementById('destination').value = `${city}, ${state}, ${country}`;
      } else {
        console.error('Geocoding API returned no results.');
      }
    })
    .catch(error => console.error('Error fetching location:', error));
}

//Export the function so it can be used in other files
export {getLocation};
