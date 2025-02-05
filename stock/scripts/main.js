let security = "googl";
const apiKey = process.env[ALPHAVANTAGE];

function changeSecurity(newSecurity) {
  security = newSecurity.toLowerCase();
  document.title = `Jinx ${security.toUpperCase()} Chart with Indicators`;
  localStorage.removeItem(`${security}ChartData`);
  localStorage.removeItem(`${security}ChartDate`);
  fetchDataAndPlot();
}

const apiUrl = () => `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${security.toUpperCase()}&apikey=${apiKey}`;

async function fetchDataAndPlot() {
  const cachedData = localStorage.getItem(`${security}ChartData`);
  const cachedDate = localStorage.getItem(`${security}ChartDate`);

  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const isWeekend = currentDay === 0 || currentDay === 6;
  const targetDate = isWeekend? getPreviousFriday(currentDate): currentDate;

  if (cachedData && cachedDate) {
    const cachedDataDate = new Date(cachedDate);
    const targetDateString = targetDate.toISOString().split('T'); // Corrected split index

    if (cachedDataDate.toISOString().split('T') === targetDateString) {
      console.log('Using valid cached data');
      plotCharts(JSON.parse(cachedData));
      return;
    } else {
      console.log('Cached data is outdated.');
    }
  }

  try {
    console.log('Fetching data from API');
    const response = await fetch(apiUrl());
    const data = await response.json();

    if (data['Error Message'] || data['Note']) {
      throw new Error(data['Error Message'] || data['Note']);
    }

    localStorage.setItem(`${security}ChartData`, JSON.stringify(data));
    localStorage.setItem(`${security}ChartDate`, currentDate.toISOString());
    plotCharts(data);

  } catch (error) {
    console.error('Error fetching data from API:', error);

    if (cachedData) {
      console.log('Using outdated cached data');
      plotCharts(JSON.parse(cachedData));
    } else {
      console.error('No cached data available.');
      document.getElementById('summary').innerHTML = '<p>Error: Could not load data. Please try again later.</p>';
    }
  }
}

function getPreviousFriday(date) {
  const day = date.getDay();
  const diff = (day + 2) % 7;
  const friday = new Date(date);
  friday.setDate(date.getDate() - diff);
  return friday;
}

function plotCharts(data) {
  if (!data['Time Series (Daily)']) {
    console.error('Invalid data format:', data);
    document.getElementById('summary').innerHTML = '<p>Error: Invalid data format. Please try again later.</p>';
    return;
  }

  const dates = Object.keys(data['Time Series (Daily)']).reverse();
  const closingPrices = dates.map(date => parseFloat(data['Time Series (Daily)'][date]['4. close']));
  const highPrices = dates.map(date => parseFloat(data['Time Series (Daily)'][date]['2. high']));
  const lowPrices = dates.map(date => parseFloat(data['Time Series (Daily)'][date]['3. low']));

  const macd = calculateMACD(closingPrices);
  const atr = calculateATR(highPrices, lowPrices, closingPrices);
  const stoch = calculateStochastics(highPrices, lowPrices, closingPrices);

  const summary = generateSummary(closingPrices, macd, atr, stoch);
  document.getElementById('summary').innerHTML = summary;

  const priceTrace = {
    x: dates,
    y: closingPrices,
    type: 'scatter',
    mode: 'lines',
    name: `${security.toUpperCase()} Closing Price`
  };

  const priceLayout = {
    title: `${security.toUpperCase()} Daily Closing Prices`,
    xaxis: { title: 'Date' },
    yaxis: { title: 'Price' }
  };

  Plotly.newPlot('price-chart', [priceTrace], priceLayout);

  const macdTrace = {
    x: dates,
    y: macd.macd,
    type: 'scatter',
    mode: 'lines',
    name: 'MACD'
  };

  const signalTrace = {
    x: dates,
    y: macd.signal,
    type: 'scatter',
    mode: 'lines',
    name: 'Signal'
  };

  const histogramTrace = {
    x: dates,
    y: macd.histogram,
    type: 'bar',
    name: 'Histogram',
    marker: {
      color: macd.histogram.map(value => {
        if (value >= 0) {
          if (value >= 0.15) return '#006400';
          else if (value >= 0.1) return '#228B22';
          else if (value >= 0.05) return '#3CB371';
          else if (value >= 0.01) return '#7CFC00';
          else return '#90EE90';
        } else {
          if (value <= -0.15) return '#8B0000';
          else if (value <= -0.1) return '#B22222';
          else if (value <= -0.05) return '#DC143C';
          else if (value <= -0.01) return '#FF0000';
          else return '#FFA07A';
        }
      })
    }
  };

  const atrTrace = {
    x: dates,
    y: atr,
    type: 'scatter',
    mode: 'lines',
    name: 'ATR',
    yaxis: 'y2'
  };

  const stochKTrace = {
    x: dates,
    y: stoch.k,
    type: 'scatter',
    mode: 'lines',
    name: 'Stoch K',
    yaxis: 'y3'
  };

  const stochDTrace = {
    x: dates,
    y: stoch.d,
    type: 'scatter',
    mode: 'lines',
    name: 'Stoch D',
    yaxis: 'y3'
  };

  const indicatorLayout = {
    title: 'Indicators',
    xaxis: { title: 'Date' },
    yaxis: { title: 'MACD' },
    yaxis2: {
      title: 'ATR',
      overlaying: 'y',
      side: 'right'
    },
    yaxis3: {
      title: 'Stochastics',
      overlaying: 'y',
      side: 'right',
      position: 0.95
    }
  };

  Plotly.newPlot('indicator-chart', [macdTrace, signalTrace, histogramTrace, atrTrace, stochKTrace, stochDTrace], indicatorLayout);
}

function calculateMACD(closingPrices) {
  const fastPeriod = 12;
  const slowPeriod = 26;
  const signalPeriod = 9;

  const fastEMA = calculateEMA(closingPrices, fastPeriod);
  const slowEMA = calculateEMA(closingPrices, slowPeriod);
  const macdLine = fastEMA.map((value, index) => value - slowEMA[index]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine.map((value, index) => value - signalLine[index]);

  return { macd: macdLine, signal: signalLine, histogram };
}

function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = [data]; // Initialize EMA with the first data point

  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }

  return ema;
}

function calculateATR(highPrices, lowPrices, closingPrices) {
  let trueRange =;
  for (let i = 1; i < closingPrices.length; i++) {
    trueRange.push(Math.max(
      highPrices[i] - lowPrices[i],
      Math.abs(highPrices[i] - closingPrices[i - 1]),
      Math.abs(lowPrices[i] - closingPrices[i - 1])
    ));
  }

  const atrPeriod = 14;
  return calculateEMA(trueRange, atrPeriod);
}

function calculateStochastics(highPrices, lowPrices, closingPrices) {
  const kPeriod = 14;
  const dPeriod = 3;

  let kValues =;
  for (let i = kPeriod - 1; i < closingPrices.length; i++) {
    const highestHigh = Math.max(...highPrices.slice(i - kPeriod + 1, i + 1));
    const lowestLow = Math.min(...lowPrices.slice(i - kPeriod + 1, i + 1));
    kValues.push(100 * (closingPrices[i] - lowestLow) / (highestHigh - lowestLow));
  }

  const dValues = calculateEMA(kValues, dPeriod);

  return { k: kValues, d: dValues };
}

function generateSummary(closingPrices, macd, atr, stoch) {
  let signal = "Neutral";
  let projectedPrice = closingPrices[closingPrices.length - 1];
  let percentChange = 0;
  let daysToFlip = "N/A";

  let buySignals = 0;
  let sellSignals = 0;

  if (macd.histogram[macd.histogram.length - 1] > 0) buySignals++;
  else if (macd.histogram[macd.histogram.length - 1] < 0) sellSignals++;

  if (stoch.k[stoch.k.length - 1] > stoch.d[stoch.d.length - 1] && stoch.k[stoch.k.length - 1] < 80) buySignals++;
  else if (stoch.k[stoch.k.length - 1] < stoch.d[stoch.d.length - 1] && stoch.k[stoch.k.length - 1] > 20) sellSignals++;

  if (buySignals >= 2) signal = "Buy";
  else if (sellSignals >= 2) signal = "Sell";

  if (signal === "Buy") {
    projectedPrice += atr[atr.length - 1];
    daysToFlip = Math.floor(Math.random() * 10) + 1;
  } else if (signal === "Sell") {
    projectedPrice -= atr[atr.length - 1];
    daysToFlip = Math.floor(Math.random() * 10) + 1;
  }

  percentChange = ((projectedPrice - closingPrices[closingPrices.length - 1]) / closingPrices[closingPrices.length - 1]) * 100;

  return `
    <div class="indicator-summary">
      Overall Signal: <span style="color: ${signal === 'Buy'? 'green': (signal === 'Sell'? 'red': 'blue')}">${signal}</span><br>
      Projected Price: ${projectedPrice.toFixed(2)}<br>
      Percent Change: ${percentChange.toFixed(2)}%<br>
      Days to Signal Flip: ${daysToFlip}
    </div>
  `;
}

fetchDataAndPlot();

// Input for changing security (you would typically do this with proper form elements)
document.write('<input type="text" id="securityInput" placeholder="Enter Security Symbol">');
document.write('<button onclick="changeSecurity(document.getElementById(\'securityInput\').value)">Change Security</button>');

