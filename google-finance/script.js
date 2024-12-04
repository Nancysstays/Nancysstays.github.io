$(document).ready(function() {
    const url = 'https://www.google.com/finance/';  // Disclaimer: Replace with authorized API

    // Display disclaimer message
    $('#data-container').html('<p>Scraping Google Finance is not recommended. Please use authorized APIs.</p>');

    // **Uncomment the below code if you still want to demonstrate scraping (for informational purposes only)**

    $.ajax({
        url: url,
        dataType: 'html',
        success: function(data) {
            // Parse the HTML (not recommended for real-world purposes)
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            // Highlight securities and indices (limited by parsing capabilities)
            // ... (same logic for highlighting securities)

            // Display the parsed HTML with highlights (not secure or reliable)
            $('#data-container').html(doc.body.innerHTML);
        },
        error: function(error) {
            console.warn('Error fetching data:', error); // Log error for debugging

            // Display error message in the DOM
            const errorMessage = `
                <p>An error occurred while fetching data: ${error.statusText}</p>
            `;
            $('#data-container').html(errorMessage);
        }
    });
});
