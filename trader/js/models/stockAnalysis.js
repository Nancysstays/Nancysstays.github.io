class StockAnalysis {
  #dailyData; // Private member

  constructor(symbol, dailyData) {
    this.symbol = symbol;
    this.#dailyData = dailyData;
  }

  @logMethod
  getMACD() {
    return calculateMACD(this.#dailyData);
  }

  // Other methods for calculating indicators, generating signals, etc.
}
