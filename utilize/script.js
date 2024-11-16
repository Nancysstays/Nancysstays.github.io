function createInputFields() {
  const unitsContainer = document.getElementById('units-container');
  const timeContainer = document.getElementById('time-container');

  for (let i = 0; i < 10; i++) {
    // Create unit input fields
    const unitInput = document.createElement('input');
    unitInput.type = 'number';
    unitInput.className = 'form-control unit-input';
    unitInput.placeholder = `Unit ${i + 1}`;
    unitsContainer.appendChild(unitInput);

    // Create time input fields
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.className = 'form-control time-input';
    timeInput.placeholder = `Time ${i + 1}`;
    timeContainer.appendChild(timeInput);
  }
}

function createChart() {
  const units = Array.from(document.querySelectorAll('.unit-input')).map(input => parseFloat(input.value));
  const time = Array.from(document.querySelectorAll('.time-input')).map(input => parseFloat(input.value));
  const timeUnit = document.querySelector('input[name="timeUnit"]:checked').value;

  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: time, 
      datasets: [{
        label: 'Units over Time',
        data: units,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: timeUnit === 'years' ? 'Years' : 'Months'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Units'
          }
        }
      }
    }
  });
}

// Create input fields on page load
createInputFields();
