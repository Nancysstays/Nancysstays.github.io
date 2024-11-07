    let data = [];
    let counter = 1;
    let color = "black"; 

    // Initialize Plotly with aspect ratio maintained
    function initializePlot() {
      let layout = {
        yaxis: {
          scaleanchor: "x",
          scaleratio: 1 
        }
 title: ' Chart',
  showlegend: true, 
  legend: {
    x: 0.85, 
    y: 1,
    xanchor: 'right', 
    yanchor: 'top',
    bgcolor: 'rgba(255, 255, 255, 0.5)', 
    bordercolor: 'black',
    borderwidth: 1
  }
      };
      Plotly.newPlot('plot', data, layout);
    }

fig.update_layout(
    plot_bgcolor="rgb(230, 230, 250)",  # Light blue plotting area
    paper_bgcolor="white"              # White background around the plot
)

fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')


fig.show()


    initializePlot();

    function addLine() {
      let xStart = parseFloat(document.getElementById('xStart').value);
      let xEnd = parseFloat(document.getElementById('xEnd').value);
      let yStart = parseFloat(document.getElementById('yStart').value);
      let yEnd = parseFloat(document.getElementById('yEnd').value);

      if (isNaN(xStart) || isNaN(xEnd) || isNaN(yStart) || isNaN(yEnd)) {
        alert("Please enter valid numbers for x and y values.");
        return;
      }

      let newLine = {
        x: [xStart, xEnd],
        y: [yStart, yEnd],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Line ' + counter,
        line: { color: color, shape: 'linear' }
      };

      data.push(newLine);
      counter++;
      Plotly.react('plot', data);
      addLineToList(newLine);

      document.getElementById('xStart').value = '';
      document.getElementById('xEnd').value = '';
      document.getElementById('yStart').value = '';
      document.getElementById('yEnd').value = '';
    }

    function addLineToList(line) {
      let lineList = document.getElementById('lineList');
      let li = document.createElement('li');
      li.id = 'line-' + (counter - 1);
      li.textContent = line.name + 
                       ' (x: ' + line.x[0] + ' to ' + line.x[1] + 
                       ', y: ' + line.y[0] + ' to ' + line.y[1] + ') ';

      let editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => editLine(line.name);
      li.appendChild(editBtn);

      let deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteLine(line.name);
      li.appendChild(deleteBtn);

      lineList.appendChild(li);
    }

    function editLine(lineName) {
      let lineIndex = data.findIndex(line => line.name === lineName);

      if (lineIndex !== -1) {
        let line = data[lineIndex];
        document.getElementById('xStart').value = line.x[0];
        document.getElementById('xEnd').value = line.x[1];
        document.getElementById('yStart').value = line.y[0];
        document.getElementById('yEnd').value = line.y[1];

        data.splice(lineIndex, 1);
        let lineItem = document.getElementById('line-' + (lineIndex + 1));
        lineItem.remove();
        Plotly.react('plot', data); 
      }
    }

    function deleteLine(lineName) {
      let lineIndex = data.findIndex(line => line.name === lineName);

      if (lineIndex !== -1) {
        data.splice(lineIndex, 1);
        let lineItem = document.getElementById('line-' + (lineIndex + 1));
        lineItem.remove();
        Plotly.react('plot', data);
      }
    }

    function saveState() {
      localStorage.setItem('plotData', JSON.stringify(data));
    }

    function loadState() {
      let savedData = localStorage.getItem('plotData');
      if (savedData) {
        data = JSON.parse(savedData);
        counter = data.length + 1; 
        Plotly.react('plot', data);

        let lineList = document.getElementById('lineList');
        lineList.innerHTML = ''; 
        data.forEach(line => addLineToList(line));
      }
    }

    // Calculator functions
    let currentInput = '';
    let operator = null;
    let previousInput = '';

    function appendNumber(number) {
      currentInput += number;
      document.getElementById('result').value = currentInput;
    }

    function setOperator(op) {
      operator = op;
      previousInput = currentInput;
      currentInput = '';
    }

    function calculate() {
      let result;
      const num1 = parseFloat(previousInput);
      const num2 = parseFloat(currentInput);

      switch (operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '*':
          result = num1 * num2;
          break;
        case '/':
          result = num1 / num2;
          break;
        default:
          return;
      }

      currentInput = result.toString();
      document.getElementById('result').value = currentInput;
      operator = null;
      previousInput = '';
    }

    function clearResult() {
      currentInput = '';
      operator = null;
      previousInput = '';
      document.getElementById('result').value = '';
    }