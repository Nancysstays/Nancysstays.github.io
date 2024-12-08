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

// Form submission handler (updated to include affiliate parameters)
const form = document.getElementById('hotelSearchForm');
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const destination = document.getElementById('destination').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guests').value;

    // Construct Expedia URL with tracking parameters
    let expediaUrl = 'https://www.expedia.com/Hotel-Search?';
    expediaUrl += `destination=${encodeURIComponent(destination)}`;
    expediaUrl += `&d1=${checkInDate}`;
    expediaUrl += `&d2=${checkOutDate}`;
    expediaUrl += `&adults=${guests}`;
    expediaUrl += `&rooms=1`; //Adding rooms parameter for completeness

    // Add your affiliate tracking parameters here - REPLACE THESE WITH YOUR ACTUAL VALUES
    expediaUrl += '&siteid=1';
    expediaUrl += '&langid=1033';
    expediaUrl += '&clickref=1101lA2bbumV';  //Replace with your actual clickref
    expediaUrl += '&affcid=US.DIRECT.PHG.1101l373826.1100l68075'; //Replace with your actual affcid
    expediaUrl += '&ref_id=1101lA2bbumV';   //Replace with your actual ref_id
    expediaUrl += '&my_ad=AFF.US.DIRECT.PHG.1101l373826.1100l68075';  //Replace with your actual my_ad
    expediaUrl += '&afflid=1101lA2bbumV';   //Replace with your actual afflid
    expediaUrl += '&affdtl=PHG.1101lA2bbumV.PZJpXVFXvB'; //Replace with your actual affdtl


    window.location.href = expediaUrl;
});

// Parallax effect
window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    var parallaxElement = document.querySelector('.parallax-element');
    parallaxElement.style.transform = 'translateY(' + scrollY * 0.5 + 'px)';
});

// // Trigger search on Expedia widget
// function triggerExpediaSearch() {
//   // Assuming the Expedia widget is in an iframe with id 'expedia-iframe'
//   const iframe = document.getElementById('expedia-iframe');
// 
//   // You might need to adjust the selector and event type based on the widget's structure
//   const submitButton = iframe.contentDocument.querySelector('.submit-button'); // Replace '.submit-button' with the actual selector
//   submitButton.click();
// }
// 
// // Trigger the search when the user clicks the "Search Expedia" button
// document.getElementById('hotelSearchForm').addEventListener('submit', (event) => {
//   event.preventDefault();
//   triggerExpediaSearch();
// });

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

// ... (Your existing JavaScript code) ...

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
