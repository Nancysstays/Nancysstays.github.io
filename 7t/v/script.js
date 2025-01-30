'use strict';

// Wrapper for logging
function logExecution(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
        console.log(`Entering ${name} with arguments: ${JSON.stringify(args)}`);
        const result = originalMethod.apply(this, args);
        console.log(`Exiting ${name}, result: ${result}`);
        return result;
    };
    return descriptor;
}

// Decorator for error handling
function handleErrors(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            console.error(`Error in ${name}:`, error);
            document.getElementById('error').style.display = 'block';
            document.getElementById('loading').style.display = 'none';
        }
    };
    return descriptor;
}

// Base class for data fetching
class DataFetcher {
    constructor(url) {
        this._url = url; // Protected member (by convention)
        this._loadingIndicator = document.getElementById('loading'); // Protected
        this._errorDiv = document.getElementById('error'); // Protected
    }

    // Public method (a wrapper that logs execution)
    @logExecution
    async fetchData() {
        this._showLoading();
        await this._fetchAndParse(); // Call the protected abstract method
        this._hideLoading();
    }

    // Protected method (meant to be overridden by subclasses)
    async _fetchAndParse() {
        throw new Error("Method '_fetchAndParse()' must be implemented.");
    }

    _showLoading() {
        this._loadingIndicator.style.display = 'block';
    }

    _hideLoading() {
        this._loadingIndicator.style.display = 'none';
    }
}

// Subclass for fetching TradingView stock data
class TradingViewStockFetcher extends DataFetcher {
    #corsProxy; // Private member

    constructor(url) {
        super(url);
        this.#corsProxy = 'https://cors-anywhere.herokuapp.com/'; 
        this._table = document.getElementById('stock-table').getElementsByTagName('tbody')[0];
    }

    // Static property (shared by all instances of the class)
    static get MARKET() {
        return 'USA';
    }

    // Polymorphic method (overrides the abstract method in the base class)
    @handleErrors
    @logExecution
    async _fetchAndParse() {
        const response = await fetch(`${this.#corsProxy}${this._url}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        this._parseHTML(html);
    }

    _parseHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('.tv-data-table__row');

        rows.forEach(row => this._addRow(row));
    }

    _addRow(row) {
        const rowData = this.constructor.#extractRowData(row); // Using private static method
        const newRow = this._table.insertRow();
        newRow.innerHTML = rowData.map(data => `<td>${data}</td>`).join('');
    }
    
    // Private static method
    static #extractRowData(row) {
        return [
            '.tv-screener__symbol',
            '.cell-last .tv-data-table__value',
            '.cell-change_percent .tv-data-table__value',
            '.cell-change .tv-data-table__value',
            '.cell-rating .tv-screener-table__signal',
            '.cell-volume .tv-data-table__value',
            '.cell-mkt_cap .tv-data-table__value',
            '.cell-pe_ratio .tv-data-table__value',
            '.cell-eps .tv-data-table__value',
            '.cell-employees .tv-data-table__value',
            '.cell-sector .tv-data-table__value'
        ].map(selector => row.querySelector(selector)?.textContent ?? '');
    }
}

// Usage
(async () => {
    const fetcher = new TradingViewStockFetcher('https://www.tradingview.com/markets/stocks-usa/market-movers-unusual-volume/');
    console.log(`Fetching data for market: ${TradingViewStockFetcher.MARKET}`);
    await fetcher.fetchData();
})();
