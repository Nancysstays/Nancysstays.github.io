fetch('calc.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('content').innerHTML = html;
  })
  .catch(error => {
    console.error('Error loading HTML:', error);
    // You can add more error handling here, e.g., display an error message to the user
    document.getElementById('content').innerHTML = '<p>Error loading calculator.</p>'; 
  });
