// 'use strict';

const stockTable = document.getElementById('stock-table').getElementsByTagName('tbody')[0];
const loadingIndicator = document.getElementById('loading');
const errorDiv = document.getElementById('error');

async function fetchData() {
    const url = 'https://www.tradingview.com/markets/stocks-usa/market-movers-unusual-volume/';
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'; 

    loadingIndicator.style.display = 'block'; // Show loading indicator

    try {
        const response = await fetch(corsProxy + url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const rows = doc.querySelectorAll('.tv-data-table__row');

        rows.forEach(row => {
            const symbol = row.querySelector('.tv-screener__symbol').textContent;
            const last = row.querySelector('.cell-last .tv-data-table__value').textContent;
            const changePercent = row.querySelector('.cell-change_percent .tv-data-table__value').textContent;
            const change = row.querySelector('.cell-change .tv-data-table__value').textContent;
            const rating = row.querySelector('.cell-rating .tv-screener-table__signal').textContent;
            const volume = row.querySelector('.cell-volume .tv-data-table__value').textContent;
            const mktCap = row.querySelector('.cell-mkt_cap .tv-data-table__value').textContent;
            const peRatio = row.querySelector('.cell-pe_ratio .tv-data-table__value').textContent;
            const eps = row.querySelector('.cell-eps .tv-data-table__value').textContent;
            const employees = row.querySelector('.cell-employees .tv-data-table__value').textContent;
            const sector = row.querySelector('.cell-sector .tv-data-table__value').textContent;

            const newRow = stockTable.insertRow();
            newRow.innerHTML = `
                <td>${symbol}</td>
                <td>${last}</td>
                <td>${changePercent}</td>
                <td>${change}</td>
                <td>${rating}</td>
                <td>${volume}</td>
                <td>${mktCap}</td>
                <td>${peRatio}</td>
                <td>${eps}</td>
                <td>${employees}</td>
                <td>${sector}</td>
            `;
        });

    } catch (error) {
        consle.error('Error fetching or parsing data:', error);
        errorDiv.style.display = 'block'; // Show error message
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
}

fetchData();
