const apiKey = 'XVYHOWRTRNPN3FJA'; // Replace with your actual API key
const symbol = 'TSLA';
const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).reverse();
    const closingPrices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

    // Calculate MACD
    const macdData = calculateMACD(closingPrices);

    // Create the chart
    const ctx = document.getElementById('chart-container').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'MACD Line',
            data: macdData.macd,
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Signal Line',
            data: macdData.signal,
            borderColor: 'red',
            fill: false
          },
          {
            label: 'Histogram',
            data: macdData.histogram,
            type: 'bar',
            backgroundColor: 'grey',
            borderColor: 'grey'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'MACD Indicator for TSLA'
        }
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function calculateMACD(prices) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12.map((value, index) => value - ema26[index]);
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((value, index) => value - signal[index]);
  return { macd, signal, histogram };
}

function calculateEMA(prices, period) {
  const ema = [];
  let sum = 0;
  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      sum += prices[i];
      ema.push(sum / (i + 1));
    } else {
      ema.push((prices[i] * (2 / (period + 1))) + (ema[i - 1] * (1 - (2 / (period + 1)))));
    }
  }
  return ema;
}
