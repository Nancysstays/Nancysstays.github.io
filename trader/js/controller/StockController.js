import { StockAnalysis } from '../models/stockAnalysis';

export class StockController {
  static async analyzeStock() {
    const symbol = document.getElementById('symbolInput').value;

    try {
      const dailyData = await fetchDailyData(symbol);
      const analysis = new StockAnalysis(symbol, dailyData);

      // Use analysis.getMACD() to access the MACD data
      // ... other analysis and display logic
    } catch (error) {
      // Handle error
    }
  }
}

import { fetchDailyData } from '../api/alphaVantage';
import { StockAnalysis } from '../models/stockAnalysis';

export async function analyzeStock() {
  const symbol = document.getElementById('symbolInput').value;

  try {
    const dailyData = await fetchDailyData(symbol);
    const analysis = new StockAnalysis(symbol, dailyData);

    // ... code to display analysis and charts
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error, e.g., display error message to user
  }
}
