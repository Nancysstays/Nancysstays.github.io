$(document).ready(function() {

    const url = 'https://www.google.com/finance/';  // Replace with actual URL (use with caution)

    function fetchData() {
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(data) {
                // Parse the HTML (not secure or reliable approach)
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                // Extract desired content from the parsed HTML (example: titles)
                const titles = [];
                $('h1, h2', doc).each(function() {
                    titles.push($(this).text());
                });

                // Display the extracted content
                $('#data-container').html(`<h3>Headings from Example.com</h3><ul>${titles.map(title => `<li>${title}</li>`).join('')}</ul>`);
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                $('#data-container').html(`<p>Error fetching data: ${error.statusText}</p>`);
            }
        });
    }

    // Trigger data fetching on page load
    fetchData();
});
