// Initial empty data
var data = [{
  x: [],
  y: [],
  z: [],
  type: 'scatter3d',
  mode: 'markers'
}];

// Layout for the 3D plot
var layout = {
  title: 'Interactive 3D Chart',
  scene: {
    xaxis: {title: 'X'},
    yaxis: {title: 'Y'},
    zaxis: {title: 'Z'}
  }
};

// Create the initial plot
Plotly.newPlot('myDiv', data, layout);

// Function to add a new data point
function addPoint(x, y, z) {
  var update = {
    x: [[x]],
    y: [[y]],
    z: [[z]]
  };

  Plotly.extendTraces('myDiv', update, 0);
}

// Example: Add a point on button click
document.getElementById('addButton').addEventListener('click', () => {
  var x = parseFloat(prompt('Enter x-coordinate:'));
  var y = parseFloat(prompt('Enter y-coordinate:'));
  var z = parseFloat(prompt('Enter z-coordinate:'));
  addPoint(x, y, z);
});