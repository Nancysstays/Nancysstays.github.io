const apiKey = 'XVYHOWRTRNPN3FJA';

async function analyzeStock() {
  const symbol = document.getElementById('symbolInput').value;

  const timeSeriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const dailyData = await fetch(timeSeriesUrl)
    .then(response => response.json())
    .then(data => data['Time Series (Daily)']);

  const { macd, signal, histogram } = calculateMACD(dailyData);
  const stochastics = calculateStochastic(dailyData);
  const stdev = calculateStandardDeviation(dailyData);
  // const variance = calculateCovariance()

  const analysis = generateEntryExitSignals(macd, signal, histogram, stochastics, dailyData, stdev);

  // Prepare data for Plotly chart
  const dates = Object.keys(dailyData);
  const prices = Object.values(dailyData).map(data => data['4. close']);
  const macdLine = {
    x: dates,
    y: macd,
    type: 'scatter',
    mode: 'lines',
    name: 'MACD'
  };
  const signalLine = {
    x: dates,
    y: signal,
    type: 'scatter',
    mode: 'lines',
    name: 'Signal'
  };
  const histogramTrace = {
    x: dates,
    y: histogram,
    type: 'bar',
    name: 'Histogram'
  };
  const stochK = {
    x: dates,
    y: stochastics.map(s => s.k),
    type: 'scatter',
    mode: 'lines',
    name: 'Stochastic K'
  };
  const stochD = {
    x: dates,
    y: stochastics.map(s => s.d),
    type: 'scatter',
    mode: 'lines',
    name: 'Stochastic D'
  };

  const layout = {
    title: `${symbol} Stock Price`,
    xaxis: {
      title: 'Date'
    },
    yaxis: {
      title: 'Price'
    }
  };

  Plotly.newPlot('myPlot', [macdLine, signalLine, histogramTrace, stochK, stochD], layout);

  const analysisDiv = document.getElementById('analysis');
  analysisDiv.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${symbol} Analysis</h5>
        ${analysis.map(entry => `
          <p class="card-text">Entry: ${entry.date} - Price: ${entry.price} - Signal: ${entry.signal}</p>
          <p class="card-text">Exit: ${entry.exitDate ? entry.exitDate + ' - Price: ' + entry.exitPrice : 'N/A'}</p>
        `).join('')}
      </div>
    </div>
  `;
}

// Function to calculate MACD
function calculateMACD(data) {
  const prices = Object.values(data).map(d => parseFloat(d['4. close']));

  const shortEMA = calculateEMA(prices, 12);
  const longEMA = calculateEMA(prices, 26);
  const macd = shortEMA.map((value, index) => value - longEMA[index]);
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((value, index) => value - signal[index]);

  return { macd, signal, histogram };
}

// Function to calculate Exponential Moving Average (EMA)
function calculateEMA(prices, period) {
  const ema = [];
  ema[0] = prices[0];

  for (let i = 1; i < prices.length; i++) {
    const multiplier = 2 / (period + 1);
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }

  return ema;
}

// Function to calculate Stochastic Oscillator
function calculateStochastic(data) {
  const prices = Object.values(data).map(d => parseFloat(d['4. close']));
  const lows = Object.values(data).map(d => parseFloat(d['3. Low']));
  const highs = Object.values(data).map(d => parseFloat(d['2. High']));

  const stochastics = [];
  for (let i = 14; i < prices.length; i++) {
    const lowestLow = Math.min(...lows.slice(i - 14, i + 1));
    const highestHigh = Math.max(...highs.slice(i - 14, i + 1));
    const k = (prices[i] - lowestLow) / (highestHigh - lowestLow) * 100;
    const d = (stochastics[i - 1] ? stochastics[i - 1].d : k) * 2 / 3 + k / 3;
    stochastics.push({ k, d });
  }

  return stochastics;
}

function generateEntryExitSignals(macd, signal, histogram, stochastics, dailyData, stdev) {
  const entries = [];
  let inPosition = false;
  let trailingStop = null;

  for (let i = 0; i < macd.length; i++) {
    const date = Object.keys(dailyData)[i];
    const price = parseFloat(dailyData[date]['4. close']);
    const currentMACD = macd[i];
    const currentSignal = signal[i];
    const currentHistogram = histogram[i];
    const currentStochK = stochastics[i].k;
    const currentStochD = stochastics[i].d;
    const currentStDev = stdev[i]; // Assuming stdev is an array of standard deviation values

    // Buy signal (MACD crossover above signal line and Stochastic K crosses above D with K > 70, and low volatility)
    if (!inPosition && currentMACD > currentSignal && currentStochK > currentStochD && currentStochK > 70 && currentStDev < thresholdStDev) {
      entries.push({ date, price, signal: 'Buy' });
      inPosition = true;
      trailingStop = price - currentStDev * 2; // Adjust trailing stop loss based on standard deviation
    }

    // Sell signal (MACD crossover below signal line or Stochastic K crosses below D with K < 30, or high volatility)
    if (inPosition && (currentMACD < currentSignal || currentStochK < currentStochD && currentStochK < 30 || currentStDev > thresholdStDev)) {
      entries[entries.length - 1].exitDate = date;
      entries[entries.length - 1].exitPrice = price;
      inPosition = false;
      trailingStop = null;
    }

    // Trailing stop loss
    if (inPosition && price > trailingStop) {
      trailingStop = Math.max(trailingStop, price - currentStDev * 2);
    }
  }

  return entries;
}

// Function to calculate Standard Deviation
function calculateStandardDeviation(data) {
  const prices = Object.values(data).map(d => parseFloat(d['4. close']));
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  const standardDeviation = Math.sqrt(variance);
  return standardDeviation;
}

// Function to calculate Covariance
function calculateCovariance(data1, data2) {
  const prices1 = Object.values(data1).map(d => parseFloat(d['4. close']));
  const prices2 = Object.values(data2).map(d => parseFloat(d['4. close']));

  const mean1 = prices1.reduce((sum, price) => sum + price, 0) / prices1.length;
  const mean2 = prices2.reduce((sum, price) => sum + price, 0) / prices2.length;

  const covariance = prices1.reduce((sum, price1, index) => {
    return sum + (price1 - mean1) * (prices2[index] - mean2);
  }, 0) / prices1.length;

  return covariance;
}
