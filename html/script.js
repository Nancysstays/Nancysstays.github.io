class DataFetcher {
  constructor(url) {
    this.url = url;
  }

  async fetchData() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.text();
      return this.parseData(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  parseData(data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    // Extract desired content from the parsed HTML (example: titles)
    const titles = [];
    $('h1, h2', doc).each(function() {
      titles.push($(this).text());
    });

    return titles;
  }
}

// Usage example:
const dataFetcher = new DataFetcher('https://www.example.com');

dataFetcher.fetchData()
  .then(data => {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = `
      <h2>Fetched Data</h2>
      <ul>
        ${data.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  })
  .catch(error => {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  });
