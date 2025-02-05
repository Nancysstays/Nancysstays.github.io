class AlphaVantageData {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async fetchData(symbol = "TSLA") {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`; // Note: In real apps, construct URLs securely.

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const data = await response.json();

            if (data["Error Message"]) {  // Check for Alpha Vantage error messages
                throw new Error(data["Error Message"]);
            }
            if (data["Note"]) {          // Check for usage limits
                throw new Error(data["Note"]);  // Or handle differently, perhaps queuing the request.
            }

             // Process and return the time series data
            return this.processTimeSeriesData(data["Time Series (Daily)"]);

        } catch (error) {
            console.error("Error fetching data from Alpha Vantage:", error);
            throw error; // Re-throw the error to be handled by the caller.
        }
    }

    processTimeSeriesData(timeSeriesData) {
      const processedData = [];
        for (const date in timeSeriesData) {
            const dailyData = timeSeriesData[date];
            processedData.push({
                date: date,
                open: parseFloat(dailyData["1. open"]),
                high: parseFloat(dailyData["2. high"]),
                low: parseFloat(dailyData["3. low"]),
                close: parseFloat(dailyData["4. close"]),
                volume: parseInt(dailyData["5. volume"])
            });
        }
      return processedData;
    }

}



// Example usage:
async function getTSLAData() {

    const alphaVantage = new AlphaVantageData("XVYHOWRTRNPN3FJA");
    try {
        const tslaData = await alphaVantage.fetchData();
        console.log(tslaData);

    } catch (error) {
        console.error("Could not retrieve TSLA data:", error); // Handle the error appropriately.
    }
}

getTSLAData();