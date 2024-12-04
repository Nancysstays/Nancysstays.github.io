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
            const securities = ['AAPL', 'GOOG', 'TSLA', '^GSPC', '^NDX'];
            for (const security of securities) {
                const elements = doc.querySelectorAll(`*`);
                for (const element of elements) {
                    if (element.textContent.toLowerCase().includes(security.toLowerCase())) {
                        element.classList.add('highlight');
                    }
                }
            }

            // Display the parsed HTML with highlights (not secure or reliable)
            $('#data-container').html(doc.body.innerHTML);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
            $('#data-container').html('<p>Error fetching data. Please try again later.</p>');
        }
    });
});
