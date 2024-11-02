// my-script.js

function myFunction(data, callback) {
  // 1. Process data (e.g., validate, transform)

  // 2. Interact with service worker
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: 'myAction',
      data: data
    });

    // Listen for response from service worker
    navigator.serviceWorker.addEventListener('message', function(event) {
      if (event.data.action === 'myActionResult') {
        callback(event.data.result);
      }
    });
  } else {
    // Handle case where service worker is not available
    console.log('Service worker not available.');
    callback(null); // Or appropriate error handling
  }
}

// Example usage in another script
// import { myFunction } from './my-script.js';

// myFunction({ some: 'data' }, function(result) {
//   console.log('Result from service worker:', result);
// });
