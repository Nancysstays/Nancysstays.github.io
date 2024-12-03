function plotFunction() {
  const functionInput = document.getElementById('functionInput').value;

  // Create a function to evaluate the input function
  const func = (x) => eval(functionInput);

  // Generate data points for the chart
  const dataPoints = [];
  for (let x = -10; x <= 10; x += 0.1) {
    dataPoints.push({ x: x, y: func(x) });
  }

  // Create the chart
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataPoints.map(point => point.x),
      datasets: [{
        label: 'Function Plot',
        data: dataPoints.map(point => point.y),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'linear'
        },
        y: {
          type: 'linear'
        }
      }
    }
  });
}
