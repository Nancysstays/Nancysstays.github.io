// Get user's location (Geolocation API)
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError); // added showError
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

  // Use a geocoding API to get city, state, and country (replace API key)
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGEDATA_API_KEY`)
    .then(response => response.json())
    .then(response => {
      if (response.results && response.results.length > 0) {
        const city = response.results[0].components.city || '';
        const state = response.results[0].components.state || '';
        const country = response.results[0].components.country || '';
        document.getElementById('destination').value = `${city}, ${state}, ${country}`; // Use vanilla JS
      } else {
        console.error('Geocoding API returned no results.');
      }
    })
    .catch(error => console.error('Error fetching location:', error));
}

getLocation();


// Form submission handler
const form = document.getElementById('hotelSearchForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get form values (using vanilla JS)
  const destination = document.getElementById('destination').value;
  const checkInDate = document.getElementById('checkInDate').value;
  const checkOutDate = document.getElementById('checkOutDate').value;
  const guests = document.getElementById('guests').value;

  // Construct Expedia URL with tracking parameters (REPLACE WITH YOUR ACTUAL PARAMETERS)
  let expediaUrl = 'https://www.expedia.com/Hotel-Search?';
  expediaUrl += `destination=${encodeURIComponent(destination)}`;
  expediaUrl += `&d1=${checkInDate}`;
  expediaUrl += `&d2=${checkOutDate}`;
  expediaUrl += `&adults=${guests}`;
  expediaUrl += `&rooms=1`;
  expediaUrl += '&siteid=1';
  expediaUrl += '&langid=1033';
  expediaUrl += '&clickref=YOUR_CLICKREF'; //YOUR ACTUAL VALUES
  expediaUrl += '&affcid=YOUR_AFFCID';
  expediaUrl += '&ref_id=YOUR_REF_ID';
  expediaUrl += '&my_ad=YOUR_MY_AD';
  expediaUrl += '&afflid=YOUR_AFFLID';
  expediaUrl += '&affdtl=YOUR_AFFDTL';

  window.location.href = expediaUrl;
});

// Parallax effect (this code is fine)
window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const parallaxElement = document.querySelector('.parallax-element');
  parallaxElement.style.transform = 'translateY(' + scrollY * 0.5 + 'px)';
});


const images = [
  '../20241203_231605.jpg',
  '../1733558426775.jpg',
  '../1733349677562.jpg'
  // Add more image paths as needed
];

let currentImageIndex = 0;
const slideshow = document.querySelector('.background-slideshow');

function showNextImage() {
    const currentImage = slideshow.querySelector('img.active');
    if (currentImage) {
        currentImage.classList.remove('active');
    }

    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = document.createElement('img');
    nextImage.src = images[currentImageIndex];
    nextImage.alt = 'Background Image';
    nextImage.classList.add('active');
    
    const randomXOffset = Math.random() * 20 - 10; //Offset between -10 and 10 pixels
    const randomYOffset = Math.random() * 20 - 10;
    nextImage.style.transform = `translate(${randomXOffset}px, ${randomYOffset}px)`;


    slideshow.appendChild(nextImage);
    
    setTimeout(() => {
      const oldestImage = slideshow.querySelector('img:not(.active)');
        if(oldestImage){
            slideshow.removeChild(oldestImage);
        }
    }, 1000);

}
/*
function showNextImage() {
  const slideshow = document.querySelector('.background-slideshow');
  const allImages = slideshow.querySelectorAll('img');

  // Hide the current image
  allImages[currentImageIndex].classList.remove('active');

  // Update the index (loop back to 0 if it goes beyond the last image)
  currentImageIndex = (currentImageIndex + 1) % images.length;

  // Show the next image
  allImages[currentImageIndex].classList.add('active');
}

// Add images to the slideshow container dynamically
const slideshow = document.createElement('div');
slideshow.classList.add('background-slideshow');
images.forEach(imagePath => {
  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = `Background Image`;
  slideshow.appendChild(img);
});
document.body.insertBefore(slideshow, document.body.firstChild);

// Start the slideshow
showNextImage();

*/
// Set an interval to change images automatically (adjust as needed)
setInterval(showNextImage, 5000); // Change image every 5 seconds
