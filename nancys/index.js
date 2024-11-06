  
let data = [];
let counter = 1;
let color = 'blue'; // Set a default color

// Function to initialize the plot with aspect ratio maintained
function initializePlot() {
  let layout = {
    yaxis: {
      scaleanchor: "x",
      scaleratio: 1 // Maintain 1:1 aspect ratio
    }
  };

  Plotly.newPlot('plot', data, layout);
}

initializePlot(); // Call the function to initialize the plot

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
        line: {color: color, shape: 'linear'}
      };

      data.push(newLine);
      counter++;
      Plotly.react('plot', data);
      addLineToList(newLine);

      // Clear input fields
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
        counter = data.length + 1; // Update the counter
        Plotly.react('plot', data);

        // Repopulate the line list
        let lineList = document.getElementById('lineList');
        lineList.innerHTML = ''; // Clear the list
        data.forEach(line => addLineToList(line));
      }
    }