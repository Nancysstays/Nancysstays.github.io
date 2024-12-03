class StockDataFetcher {
  constructor(apiKey, symbol) {
    this.apiKey = apiKey;
    this.symbol = symbol;
  }

  async fetch() {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.symbol}&apikey=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data['Time Series (Daily)'];
  }
}

class TechnicalAnalysis {
  constructor(data) {
    this.data = data;
  }

  calculateMACD(shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const prices = Object.values(this.data).map(data => parseFloat(data['4. close']));

    const shortEMA = this.exponentialMovingAverage(prices, shortPeriod);
    const longEMA = this.exponentialMovingAverage(prices, longPeriod);
    const macdLine = shortEMA.map((value, index) => value - longEMA[index]);
    const signalLine = this.exponentialMovingAverage(macdLine, signalPeriod);

    return { macdLine, signalLine };
  }

  exponentialMovingAverage(prices, period) {
    const ema = [];
    ema[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] * (2 / (period + 1))) + ema[i - 1] * (1 - (2 / (period + 1)));
    }
    return ema;
  }

  calculateStandardDeviation(period = 20) {
    const stdDev = [];
    for (let i = period - 1; i < prices.length; i++) {
      const window = prices.slice(i - period + 1, i + 1);
      const mean = window.reduce((sum, value) => sum + value, 0) / period;
      const variance = window.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / period;
      stdDev.push(Math.sqrt(variance));
    }
    return stdDev;
  }

  calculateCovariance(djiData, period = 20) {
    const stockPrices = Object.values(this.data).map(data => parseFloat(data['4. close']));
    const djiPrices = Object.values(djiData).map(data => parseFloat(data['4. close']));

    const covariance = [];
    for (let i = period - 1; i < stockPrices.length; i++) {
      const stockWindow = stockPrices.slice(i - period + 1, i + 1);
      const djiWindow = djiPrices.slice(i - period + 1, i + 1);
      const stockMean = stockWindow.reduce((sum, value) => sum + value, 0) / period;
      const djiMean = djiWindow.reduce((sum, value) => sum + value, 0) / period;
      const covarianceValue = stockWindow.reduce((sum, value, index) => sum + (value - stockMean) * (djiWindow[index] - djiMean), 0) / period;
      covariance.push(covarianceValue);
    }
    return covariance;
  }
}

class TradingStrategy {
  constructor(data, technicalAnalysis) {
    this.data = data;
    this.technicalAnalysis = technicalAnalysis;
    this.positions = [];
  }

  execute() {
    const { macdLine, signalLine } = this.technicalAnalysis.calculateMACD();
    const stdDev = this.technicalAnalysis.calculateStandardDeviation();
    const covariance = this.technicalAnalysis.calculateCovariance(djiData);

    for (let i = 0; i < this.data.length; i++) {
      const currentPrice = this.data[i]['4. close'];

      // Check for buy signal
      if (macdLine[i] > signalLine[i] && stdDev[i] < thresholdStdDev && covariance[i] > 0 && this.positions.length === 0) {
        this.positions.push({
          entryPrice: currentPrice,
          stopLoss: currentPrice * 0.9,
          takeProfit: currentPrice * 1.1
        });
      }

      // Check for sell signal or stop-loss/take-profit trigger
      if (this.positions.length > 0) {
        const position = this.positions[0];
        if (currentPrice <= position.stopLoss || currentPrice >= position.takeProfit) {
          // Sell the position
          this.positions.shift();
        } else if (macdLine[i] < signalLine[i]) {
          // Sell the position due to a negative MACD crossover
          this.positions.shift();
        } else {
          // Adjust stop-loss as the price moves higher
          position.stopLoss = Math.max(position.stopLoss, currentPrice * 0.9);
        }
      }
    }
  }
}

// Main execution
const apiKey = 'YOUR_API_KEY';
const symbol = 'AAPL';

const fetcher = new StockDataFetcher(apiKey, symbol);
fetcher.fetch()
  .then(data => {
    const analysis = new TechnicalAnalysis(data);
    const strategy = new TradingStrategy(data, analysis);
    strategy.execute();

    // Visualize the results using a charting library like Chart.js
    // ... (create a chart with stock price, MACD, standard deviation, covariance, buy/sell signals, and stop-loss/take-profit levels)
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
