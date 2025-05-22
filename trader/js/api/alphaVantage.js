const apiKey = 'XVYHOWRTRNPN3FJA';

export async function fetchDailyData(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data['Time Series (Daily)'];
}
