
    fetch('calc.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('content').innerHTML = html;
      });
