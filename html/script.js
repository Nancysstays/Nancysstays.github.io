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
const dataFetcher = new DataFetcher('https://www.google.com/finance/'); // Replace with your desired URL

dataFetcher.fetchData()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
