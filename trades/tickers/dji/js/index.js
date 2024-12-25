const StockData = (function() {
  const privateData = new WeakMap();
  const storageKeyPrefix = 'stock_data_';

  class StockData {
    constructor(apiUrl, symbol) {
      this.apiUrl = apiUrl;
      this.symbol = symbol;
      privateData.set(this, { data: null, lastFetch: 0 });
    }

    @downloadDecorator
    async downloadData() {
      try {
        if (this.shouldFetchData()) {
          const response = await fetch(this.apiUrl);
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          const data = await response.text();
          this.updateData(data);
        }
        this.loadFromLocalStorage();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Implement more robust error handling, e.g., retry logic, user notification
      }
    }

    shouldFetchData() {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const lastFetch = privateData.get(this).lastFetch;

      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isTimeInRange = (hour === 6 && minute >= 30) || (hour >= 7 && hour <= 13);
      const isCacheExpired = (now - lastFetch) > 24 * 60 * 60 * 1000; // 24 hours

      return isWeekday && isTimeInRange && isCacheExpired;
    }

    updateData(data) {
      privateData.get(this).data = data;
      privateData.get(this).lastFetch = Date.now();
      this.saveToLocalStorage();
      this.createDownloadLink(data);
    }

    createDownloadLink(csvData) {
      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
      downloadLink.download = `${this.symbol}_stock_data.csv`;
      downloadLink.textContent = 'Download CSV';
      document.getElementById('download-link').appendChild(downloadLink);
    }

    saveToLocalStorage() {
      const storageKey = storageKeyPrefix + this.symbol;
      const dataToStore = {
        data: privateData.get(this).data,
        lastFetch: privateData.get(this).lastFetch
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    }

    loadFromLocalStorage() {
      const storageKey = storageKeyPrefix + this.symbol;
      const storedData = JSON.parse(localStorage.getItem(storageKey));
      if (storedData) {
        privateData.get(this).data = storedData.data;
        privateData.get(this).lastFetch = storedData.lastFetch;
        this.createDownloadLink(storedData.data);
      }
    }
  }

  return StockData;
})();

function downloadDecorator(target, name, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args) {
    try {
      console.log(`Fetching data from ${this.apiUrl}...`);
      await originalMethod.apply(this, args);
      console.log('Data fetched and download link created successfully.');
    } catch (error) {
      console.error(`Error in ${name} method:`, error);
      // Implement more robust error handling, e.g., retry logic, user notification
    }
  };
  return descriptor;
}

class DJIStockData extends StockData {
  constructor(apiUrl) {
    super(apiUrl, 'DJI');
  }

  // Polymorphism: Overriding the createDownloadLink method
  createDownloadLink(csvData) {
    // Add specific formatting for DJI data (if needed)
    const formattedData = this.formatDJIData(csvData);
    super.createDownloadLink(formattedData);
  }

  // Example formatting method (replace with your actual logic)
  formatDJIData(data) {
    // ... DJI specific data formatting ...
    return data;
  }
}

const djiDownloader = new DJIStockData(
  'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=DJI&interval=1min&outputsize=full&apikey=XVYHOWRTRNPN3FJA&datatype=csv'
);

djiDownloader.downloadData();
