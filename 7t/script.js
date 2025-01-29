(function() {
  'use strict';

  class ChartManager {
    #chart;
    #apiKey = process.env.ALPHAVANTAGE; // Replace with your actual API key

    constructor() {
      // Initialize any properties or call methods needed for initial setup
      this.init().then(() => {
        this.render(); // Render initial chart for IBM
        this.render('AAPL'); // Render another chart for AAPL
        this.render('TSLA'); // Render another chart for TSLA
      });
    }

    async init() {
      this.#chart = LightweightCharts.createChart(document.getElementById('chart'), {
        // Chart configuration options
        width: 800,
        height: 400,
        layout: {
          backgroundColor: '#fff',
          textColor: '#333'
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)'
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)'
          }
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal
        },
        priceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)'
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)'
        }
      });

      const data = await this.#loadData('IBM'); // Fetch initial data for IBM
      var series = this.#chart.addLineSeries();
      series.setData(data);
    }

    @logExecutionTime
    async render(symbol = 'MSFT') { // Default to MSFT if no symbol is provided
      const newData = await this.#loadData(symbol);

      // Check if the series already exists
      let existingSeries = this.#chart.getSeries(symbol);

      // If the series exists, update its data
      if (existingSeries) {
        existingSeries.setData(newData);
      } else {
        // Otherwise, create a new series
        const newSeries = this.#chart.addLineSeries({
          color: 'rgba(255, 0, 0, 0.5)',
          lineWidth: 2
        });
        newSeries.setData(newData);
      }
    }

    async #loadData(symbol) {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${this.#apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      // Process the data from Alpha Vantage API
      const timeSeriesData = data['Time Series (Daily)'];
      const formattedData = Object.entries(timeSeriesData).map(([time, values]) => ({
        time: time,
        value: parseFloat(values['4. close']) // Use closing price
      }));

      return formattedData;
    }

    static formatData(rawData) {
      return rawData.map(item => ({
        time: item.time,
        value: item.value
      }));
    }
  }

  function logExecutionTime(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      console.log(`Method ${name} took ${end - start} milliseconds`);
      return result;
    };
    return descriptor;
  }

  // Example of extending the class and overriding a method
  class AdvancedChartManager extends ChartManager {
    async #loadData() {
      // Implement more complex data loading logic here
      const data = await super.#loadData();
      return data.map(item => ({
        time: item.time,
        // value: item.value * 2 // Example: Double the values
      }));
    }

  // Covariance
  covariance(data1, data2) {
    if (data1.length!== data2.length) {
      throw new Error('Data sets must have the same length for covariance calculation.');
    }

    const mean1 = data1.reduce((sum, value) => sum + value, 0) / data1.length;
    const mean2 = data2.reduce((sum, value) => sum + value, 0) / data2.length;

    let covariance = 0;
    for (let i = 0; i < data1.length; i++) {
      covariance += (data1[i] - mean1) * (data2[i] - mean2);
    }

    return covariance / (data1.length - 1);
  }

  // MACD (Moving Average Convergence Divergence)
  macd(data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    const shortEMA = this.#calculateEMA(data, shortPeriod);
    const longEMA = this.#calculateEMA(data, longPeriod);
    const macdLine = shortEMA.map((value, index) => value - longEMA[index]);
    const signalLine = this.#calculateEMA(macdLine, signalPeriod);
    const histogram = macdLine.map((value, index) => value - signalLine[index]);

    return { macdLine, signalLine, histogram };
  }

  // Standard Deviation
  stdev(data) {
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
  }

  // Linear Regression
  linearRegression(data) {
    const x = Array.from({ length: data.length }, (_, i) => i + 1);
    const y = data;

    const sumX = x.reduce((sum, value) => sum + value, 0);
    const sumY = y.reduce((sum, value) => sum + value, 0);
    const sumXY = x.reduce((sum, value, index) => sum + value * y[index], 0);
    const sumXX = x.reduce((sum, value) => sum + Math.pow(value, 2), 0);

    const slope = (data.length * sumXY - sumX * sumY) / (data.length * sumXX - Math.pow(sumX, 2));
    const intercept = (sumY - slope * sumX) / data.length;

    return { slope, intercept };
  }

  // Logistic Regression (simplified)
  logisticRegression(data) {
    // Note: This is a simplified implementation of logistic regression
    // For a more robust implementation, consider using a machine learning library
    const x = Array.from({ length: data.length }, (_, i) => i + 1);
    const y = data.map(value => value / Math.max(...data)); // Normalize data to 0-1 range

    //... (Implementation of logistic regression algorithm)
    // This would involve iterative optimization to find the best parameters
    // For simplicity, we'll just return a placeholder result here
    return { parameters: }; // Placeholder parameters
  }

  // Helper function to calculate Exponential Moving Average (EMA)
  #calculateEMA(data, period) {
    const k = 2 / (period + 1);
    const ema = [data];

    for (let i = 1; i < data.length; i++) {
      ema[i] = data[i] * k + ema[i - 1] * (1 - k);
    }

    return ema;
  }
}


  new ChartManager(); // Create an instance of ChartManager

})();
