// Add an event listener to save data on plot updates
Plotly.newPlot('myDiv').on('plotly_relayout', function() {
  savePlotData(Plotly.toImage(this));
});
