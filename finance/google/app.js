const priceContainer = document.getElementById('price-container');
const financeIframe = document.getElementById('finance-iframe');

function handleScroll() {
  if (window.scrollY > 500) { // Adjust as needed
    financeIframe.classList.add('show');
  } else {
    financeIframe.classList.remove('show');
  }
}

window.addEventListener('scroll', handleScroll);

fetch('https://www.google.com/finance')
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const priceElement = doc.querySelector('[data-field="last_price"]'); //Price class

    if (priceElement) {
      const price = priceElement.getAttribute('data-value')
      priceContainer.textContent = `Price: ${price}`;
    } else {
      priceContainer.textContent = 'Price not found';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    priceContainer.textContent = 'Error fetching data';
  });
