// This file contains the JavaScript code for the application. It handles user interactions, fetches data from the Alpha Vantage API, performs calculations for technical indicators, and manages local storage for data persistence outside of market hours.

document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your Alpha Vantage API key
    const form = document.getElementById('stock-form');
    const tickerInput = document.getElementById('ticker-symbol');
    const intervalInput = document.getElementById('interval');
    const resultContainer = document.getElementById('results');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const ticker = tickerInput.value;
        const interval = intervalInput.value;
        fetchStockData(ticker, interval);
    });

    function fetchStockData(ticker, interval) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=${interval}&apikey=${apiKey}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data['Time Series (1min)']) {
                    const timeSeries = data['Time Series (1min)'];
                    const stockData = processStockData(timeSeries);
                    calculateIndicators(stockData);
                } else {
                    alert('Error fetching data: ' + data['Error Message']);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function processStockData(timeSeries) {
        const stockData = [];
        for (const time in timeSeries) {
            stockData.push({
                time: time,
                open: parseFloat(timeSeries[time]['1. open']),
                high: parseFloat(timeSeries[time]['2. high']),
                low: parseFloat(timeSeries[time]['3. low']),
                close: parseFloat(timeSeries[time]['4. close']),
                volume: parseInt(timeSeries[time]['5. volume'])
            });
        }
        return stockData;
    }

    function calculateIndicators(stockData) {
        // Implement calculations for MACD, CCI, RSI, VWMA, EMA, VWAP here
        // Example: const macd = calculateMACD(stockData);
        // Display results in the resultContainer
        resultContainer.innerHTML = JSON.stringify(stockData, null, 2); // Display raw data for now
    }

    function saveToLocalStorage(data) {
        localStorage.setItem('stockData', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = localStorage.getItem('stockData');
        return data ? JSON.parse(data) : null;
    }

    function isMarketOpen() {
        const now = new Date();
        const marketOpen = new Date();
        marketOpen.setHours(6, 30, 0); // 6:30 AM Pacific
        const marketClose = new Date();
        marketClose.setHours(13, 0, 0); // 1:00 PM Pacific
        return now >= marketOpen && now <= marketClose;
    }

    if (!isMarketOpen()) {
        const storedData = loadFromLocalStorage();
        if (storedData) {
            resultContainer.innerHTML = JSON.stringify(storedData, null, 2); // Display stored data
        } else {
            resultContainer.innerHTML = 'Market is closed and no data is available.';
        }
    }
});