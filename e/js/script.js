class StockAnalyzer {
    constructor() {
        this.apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your actual API key
        this.defaultSecurities = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'FB', 'NVDA', 'JPM', 'V', 'JNJ'];
        this.intervals = ['1min', '15min', '60min', '120min', '240min', 'D', 'W'];
        this.results = {};
    }

    async fetchData(symbol, interval) {
        // This method fetches historical price data from the Alpha Vantage API
        // for the given symbol and interval. It constructs the API URL based on
        // the interval and handles different API functions for different intervals.

        let functionName;
        switch (interval) {
            case '1min':
                functionName = 'TIME_SERIES_INTRADAY&interval=1min';
                break;
            case '15min':
                functionName = 'TIME_SERIES_INTRADAY&interval=15min';
                break;
            case '60min':
                functionName = 'TIME_SERIES_INTRADAY&interval=60min';
                break;
            case '120min':
                // Alpha Vantage doesn't directly support 120min, we'll need to fetch hourly data and aggregate
                functionName = 'TIME_SERIES_INTRADAY&interval=60min';
                break;
            case '240min':
                // Alpha Vantage doesn't directly support 240min, we'll need to fetch hourly data and aggregate
                functionName = 'TIME_SERIES_INTRADAY&interval=60min';
                break;
            case 'D':
                functionName = 'TIME_SERIES_DAILY';
                break;
            case 'W':
                functionName = 'TIME_SERIES_WEEKLY';
                break;
            default:
                throw new Error('Invalid interval');
        }

        const apiUrl = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=${this.apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return this.processAPIData(data, interval);
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    processAPIData(data, interval) {
        // This method processes the raw data received from the Alpha Vantage API.
        // It handles different time series formats and extracts the relevant
        // price and volume information. It also aggregates data for 120min and
        // 240min intervals if needed.

        const processedData = {};

        // Handle different time series formats from Alpha Vantage
        const timeSeriesKey =
            interval === 'D' ? 'Time Series (Daily)' :
                interval === 'W' ? 'Weekly Time Series' :
                    'Time Series (' + (interval === '120min' || interval === '240min' ? '60min' : interval) + ')';

        if (data[timeSeriesKey]) {
            for (const date in data[timeSeriesKey]) {
                processedData[date] = {
                    open: parseFloat(data[timeSeriesKey][date]['1. open']),
                    high: parseFloat(data[timeSeriesKey][date]['2. high']),
                    low: parseFloat(data[timeSeriesKey][date]['3. low']),
                    close: parseFloat(data[timeSeriesKey][date]['4. close']),
                    volume: parseFloat(data[timeSeriesKey][date]['5. volume'])
                };
            }
        } else {
            console.error('Invalid data format:', data);
            return null;
        }

        // Aggregate data for 120min and 240min intervals
        if (interval === '120min' || interval === '240min') {
            const aggregatedData = {};
            let i = 0;
            const intervalHours = parseInt(interval.slice(0, -3)) / 60;
            for (const date in processedData) {
                if (i % intervalHours === 0) {
                    const startDate = new Date(date);
                    startDate.setHours(startDate.getHours() - intervalHours);
                    const aggregatedDate = startDate.toISOString().slice(0, 10);
                    aggregatedData[aggregatedDate] = {
                        open: processedData[date].open,
                        high: processedData[date].high,
                        low: processedData[date].low,
                        close: processedData[date].close,
                        volume: processedData[date].volume
                    };
                } else {
                    aggregatedData[aggregatedDate].high = Math.max(aggregatedData[aggregatedDate].high, processedData[date].high);
                    aggregatedData[aggregatedDate].low = Math.min(aggregatedData[aggregatedDate].low, processedData[date].low);
                    aggregatedData[aggregatedDate].close = processedData[date].close;
                    aggregatedData[aggregatedDate].volume += processedData[date].volume;
                }
                i++;
            }
            return aggregatedData;
        }

        return processedData;
    }

    calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        // This method calculates the MACD (Moving Average Convergence Divergence)
        // indicator for the given price data. It calculates the 12-period and
        // 26-period EMAs, the MACD line, the signal line, and the histogram.

        const macdData = {};
        const prices = Object.values(data).map(item => item.close);

        // Calculate EMA (Exponential Moving Average)
        const calculateEMA = (data, period) => {
            const ema = [];
            let sum = 0;
            for (let i = 0; i < period; i++) {
                sum += data[i];
                ema.push(sum / (i + 1));
            }
            const multiplier = 2 / (period + 1);
            for (let i = period; i < data.length; i++) {
                ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1]);
            }
            return ema;
        };

        const ema12 = calculateEMA(prices, fastPeriod);
        const ema26 = calculateEMA(prices, slowPeriod);

        // Calculate MACD line
        const macdLine = ema12.map((value, index) => value - ema26[index]);

        // Calculate Signal line (EMA of MACD line)
        const signalLine = calculateEMA(macdLine, signalPeriod);

        // Calculate Histogram
        const histogram = macdLine.map((value, index) => value - signalLine[index]);

        // Populate macdData with calculated values
        let i = 0;
        for (const date in data) {
            macdData[date] = {
                macd: macdLine[i],
                signal: signalLine[i],
                histogram: histogram[i]
            };
            i++;
        }

        return macdData;
    }

    optimizeMACD(data, interval) {
        // This method will implement the logic for optimizing the MACD parameters
        // (fast period, slow period, signal period) based on historical data
        // and backtesting. It will iterate through different parameter combinations
        // and evaluate the performance of each combination to find the optimal
        // parameters for the given data and interval.

        // TODO: Implement MACD parameter optimization logic
    }

    calculateCovariance(data) {
        // This method calculates the covariance matrix for the given price data of
        // multiple securities. It takes an object where keys are security symbols
        // and values are objects containing historical price data.
        // It returns a covariance matrix as a 2D array.

        const symbols = Object.keys(data);
        const numSymbols = symbols.length;
        const covarianceMatrix = Array(numSymbols).fill(0).map(() => Array(numSymbols).fill(0));

        // Calculate the mean price for each security
        const means = symbols.map(symbol => {
            const prices = Object.values(data[symbol].data).map(item => item.close);
            return prices.reduce((sum, price) => sum + price, 0) / prices.length;
        });

        // Calculate the covariance for each pair of securities
        for (let i = 0; i < numSymbols; i++) {
            for (let j = i; j < numSymbols; j++) {
                const symbol1 = symbols[i];
                const symbol2 = symbols[j];
                const prices1 = Object.values(data[symbol1].data).map(item => item.close);
                const prices2 = Object.values(data[symbol2].data).map(item => item.close);

                let covariance = 0;
                for (let k = 0; k < prices1.length; k++) {
                    covariance += (prices1[k] - means[i]) * (prices2[k] - means[j]);
                }
                covariance /= prices1.length - 1;

                covarianceMatrix[i][j] = covariance;
                covarianceMatrix[j][i] = covariance; // Covariance matrix is symmetric
            }
        }

        return covarianceMatrix;
    }

    calculateEigenvectors(covarianceMatrix) {
        // This method calculates the eigenvectors and eigenvalues of the given
        // covariance matrix. It uses a numerical method (e.g., Jacobi method or
        // QR algorithm) to find the eigenvalues and eigenvectors.
        // It returns an object containing the eigenvectors and eigenvalues.

        // TODO: Implement eigenvector and eigenvalue calculation using a suitable
        // numerical method (e.g., Jacobi method or QR algorithm)

        // Placeholder implementation (replace with actual calculation)
        const eigenvectors = []; // Array of eigenvectors
        const eigenvalues = []; // Array of eigenvalues

        // ... (Perform eigenvector and eigenvalue calculation here)

        return {eigenvectors, eigenvalues};
    }

    executeTradingStrategy(results) {
        // This method implements the trading strategy based on the analysis results.
        // It iterates through the results for each security and interval,
        // generates buy/sell signals based on the MACD and other indicators,
        // and tracks the trading activity to ensure it adheres to the day trade limits.

        const trades = {}; // Keep track of trades for each security

        for (const symbol in results) {
            trades[symbol] = [];
            let dayTradeCount = 0;
            let lastTradeDate = null;

            for (const interval in results[symbol]) {
                const data = results[symbol][interval];
                const dates = Object.keys(data.data);

                for (let i = 1; i < dates.length; i++) {
                    const currentDate = dates[i];
                    const previousDate = dates[i - 1];
                    const currentMACD = data.macd[currentDate];
                    const previousMACD = data.macd[previousDate];

                    // Check for MACD crossover
                    if (previousMACD.macd < previousMACD.signal && currentMACD.macd > currentMACD.signal) {
                        // Buy signal
                        if (dayTradeCount < 3) {
                            trades[symbol].push({date: currentDate, action: 'Buy', price: data.data[currentDate].close});
                            dayTradeCount++;
                            lastTradeDate = currentDate;
                        }
                    } else if (previousMACD.macd > previousMACD.signal && currentMACD.macd < currentMACD.signal) {
                        // Sell signal
                        if (dayTradeCount < 3) {
                            trades[symbol].push({date: currentDate, action: 'Sell', price: data.data[currentDate].close});
                            dayTradeCount++;
                            lastTradeDate = currentDate;
                        }
                    }

                    // Reset day trade count if it's a new 5-day rolling period
                    if (lastTradeDate && this.isMoreThanFiveDaysApart(lastTradeDate, currentDate)) {
                        dayTradeCount = 0;
                    }
                }
            }
        }

        // TODO: Further refine the trading strategy based on other indicators
        // and risk management rules

        return trades;
    }

    isMoreThanFiveDaysApart(date1, date2) {
        // Helper function to check if two dates are more than 5 days apart
        const diff = Math.abs(new Date(date2) - new Date(date1));
        return diff > 5 * 24 * 60 * 60 * 1000;
    }

    displayResults(results) {
        // This method displays the analysis results in the "results" section of the
        // web page. It creates Plotly charts to visualize the price data, MACD,
        // signal line, and histogram. It also includes a reasoning section with
        // buy/sell signals, descriptions, and numerical data points.

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results

        for (const symbol in results) {
            const symbolData = results[symbol];
            const symbolDiv = document.createElement('div');
            symbolDiv.classList.add('symbol-results');
            symbolDiv.innerHTML = `<h2>${symbol}</h2>`;

            for (const interval in symbolData) {
                const intervalData = symbolData[interval];
                const intervalDiv = document.createElement('div');
                intervalDiv.classList.add('interval-results');

                // Create Plotly chart
                const candlestickTrace = {
                    x: Object.keys(intervalData.data),
                    close: Object.values(intervalData.data).map(item => item.close),
                    high: Object.values(intervalData.data).map(item => item.high),
                    low: Object.values(intervalData.data).map(item => item.low),
                    open: Object.values(intervalData.data).map(item => item.open),
                    increasing: {line: {color: 'green'}},
                    decreasing: {line: {color: 'red'}},
                    type: 'candlestick',
                    name: 'Price'
                };

                const macdTrace = {
                    x: Object.keys(intervalData.macd),
                    y: Object.values(intervalData.macd).map(item => item.macd),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'MACD'
                };

                const signalTrace = {
                    x: Object.keys(intervalData.macd),
                    y: Object.values(intervalData.macd).map(item => item.signal),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Signal'
                };

                const histogramTrace = {
                    x: Object.keys(intervalData.macd),
                    y: Object.values(intervalData.macd).map(item => item.histogram),
                    type: 'bar',
                    name: 'Histogram'
                };

                const layout = {
                    title: `${symbol} - ${interval}`,
                    xaxis: {type: 'date'},
                    yaxis: {title: 'Price'},
                    yaxis2: {
                        title: 'MACD',
                        overlaying: 'y',
                        side: 'right'
                    }
                };

                Plotly.newPlot(intervalDiv, [candlestickTrace, macdTrace, signalTrace, histogramTrace], layout);

                // Add reasoning section
                const reasoningDiv = document.createElement('div');
                reasoningDiv.classList.add('reasoning');

                const signal = this.determineSignal(intervalData);
                const dataPoints = this.formatDataPoints(intervalData);

                reasoningDiv.innerHTML = `
                    <h3>Reasoning</h3>
                    <p><strong>Signal:</strong> ${signal.signal}</p>
                    <p><strong>Description:</strong> ${signal.description}</p>
                    <p><strong>Data Points:</strong> ${dataPoints}</p>
                `;

                intervalDiv.appendChild(reasoningDiv);
                symbolDiv.appendChild(intervalDiv);
            }

            resultsDiv.appendChild(symbolDiv);
        }
    }

    determineSignal(data) {
        // This method determines the buy/sell signal based on the MACD data.
        // It analyzes the latest MACD values and trends to provide a signal
        // along with a detailed reasoning description.

        const latestData = data.macd[Object.keys(data.macd).slice(-1)[0]]; // Get the latest MACD data point
        const {macd, signal, histogram} = latestData;

        let signalDecision = 'Hold';
        let description = '';

        // Check for MACD crossover
        if (macd > signal && histogram > 0) {
            signalDecision = 'Buy';
            description = 'Bullish crossover: MACD line crosses above the signal line with a positive histogram, indicating potential upward momentum.';
        } else if (macd < signal && histogram < 0) {
            signalDecision = 'Sell';
            description = 'Bearish crossover: MACD line crosses below the signal line with a negative histogram, indicating potential downward momentum.';
        } else {
            // Additional checks for other signal conditions can be added here
            // ...

            if (histogram > 0) {
                description += 'Positive histogram suggests increasing bullish momentum. ';
            } else if (histogram < 0) {
                description += 'Negative histogram
