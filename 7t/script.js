(function() {
  'use strict';

  class ChartManager {
    #chart;
    #apiKey = 'XVYHOWRTRNPN3FJA'; // Replace with your actual API key

    constructor() {
      // Initialize any properties or call methods needed for initial setup
      this.init().then(() => {
        this.render(); // Render initial chart for IBM
        this.render('AAPL'); // Render another chart for AAPL
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
      this.#chart.addLineSeries({
        color: 'rgba(255, 0, 0, 0.5)',
        lineWidth: 2
      }).setData(newData);
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
        value: item.value * 2 // Example: Double the values
      }));
    }
  }

  new ChartManager(); // Create an instance of ChartManager

})();
