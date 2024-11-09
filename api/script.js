function fetchData() {
    const symbol = document.getElementById('symbol').value;
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual Alpha Vantage API key
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    document.getElementById('loading').style.display = 'block';
    document.getElementById('data-table').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data['Error Message']) {
                handleError('Invalid symbol or API error.');
                return;
            }

            const timeSeries = data['Time Series (Daily)'];
            const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear previous data

            for (const date in timeSeries) {
                const ohlc = timeSeries[date];
                const row = tableBody.insertRow();
                row.insertCell().textContent = date;
                row.insertCell().textContent = ohlc['1. open'];
                row.insertCell().textContent = ohlc['2. high'];
                row.insertCell().textContent = ohlc['3. low'];
                row.insertCell().textContent = ohlc['4. close'];
            }

            document.getElementById('loading').style.display = 'none';
            document.getElementById('data-table').style.display = 'table';
        })
        .catch(error => {
            handleError('An error occurred while fetching data.');
            console.error('Error:', error);
        });
}

function handleError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}
