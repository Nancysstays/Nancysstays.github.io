export function calculateMACD(prices) {
  const shortEMA = calculateEMA(prices, 12);
  const longEMA = calculateEMA(prices, 26);
  const macd = shortEMA.map((value, index) => value - longEMA[index]);
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((value, index) => value - signal[index]);

  return { macd, signal, histogram };
}

// ... other technical indicator functions (EMA, Stochastic, etc.)
