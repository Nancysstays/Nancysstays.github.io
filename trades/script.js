class Tickers {
  static tickers = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT', 'FB', 'NFLX', 'SPOT', 'UBER', 'LYFT', 'A', 'AA', 'AAL', 'AAN', 'AAOI', 'AAON', 'AAP', 'AAPL', 'AAT', 'AAWW', 'AAXN', 'AB', 'ABB', 'ABBV', 'ABC', 'ABCB', 'ABEO', 'ABG', 'ABM', 'ABMD', 'ABR', 'ABT', 'ABTX', 'ABUS', 'AC', 'ACA', 'ACAD', 'ACB', 'ACC', 'ACCO', 'ACER', 'ACGL', 'ACHC', 'ACHN', 'ACIA', 'ACIW', 'ACLS', 'ACM', 'ACMR', 'ACN', 'ACOR', 'ACRE', 'ACRS', 'ACRX', 'ACST', 'ACTG', 'ACU', 'ACV', 'ACXM', 'ADAP', 'ADBE', 'ADC', 'ADES', 'ADI', 'ADM', 'ADMA', 'ADMS', 'ADNT', 'ADP', 'ADPT', 'ADS', 'ADSK', 'ADTN', 'ADUS', 'ADVM', 'ADXS', 'AE', 'AEE', 'AEGN', 'AEIS', 'AEL', 'AEM', 'AEO', 'AEP', 'AERI', 'AES', 'AETI', 'AEY', 'AFG', 'AFIN', 'AFMD', 'AFSI', 'AGCO', 'AGEN', 'AGFS', 'AGIO', 'AGM', 'AGN', 'AGNC', 'AGO', 'AGR', 'AGRO', 'AGRX', 'AGS', 'AGTC', 'AGX', 'AGYS', 'AHH', 'AHT', 'AI', 'AIG', 'AIMC', 'AIN', 'AINV', 'AIR', 'AIT', 'AIV', 'AIZ', 'AJG', 'AJRD', 'AJX', 'AKAM', 'AKAO', 'AKCA', 'AKR', 'AKRX', 'AKS', 'AKTS', 'AKTX', 'AKUS', 'AL', 'ALB', 'ALBO', 'ALCO', 'ALDR', 'ALE', 'ALEC', 'ALEX', 'ALG', 'ALGN', 'ALGT', 'B', 'BA', 'BABA', 'BAC', 'BAH', 'BAM', 'BANC', 'BAND', 'BANR', 'BAP', 'BAS', 'BAX', 'BB', 'BBBY', 'BBC', 'BBD', 'BBGI', 'BBI', 'BBIO', 'BBQ', 'BBT', 'BBW', 'BBY', 'BC', 'BCBP', 'BCC', 'BCEI', 'BCLI', 'BCO', 'BCOR', 'BCOV', 'BCPC', 'BCRX', 'BCS', 'BCSF', 'BDC', 'BDGE', 'BDN', 'BDSI', 'BDX', 'BE', 'BEAT', 'BECN', 'BEDU', 'BEL', 'BELFB', 'BEN', 'BERY', 'BEST', 'BFAM', 'BFIN', 'BFIT', 'BFK', 'BFO', 'BFRA', 'BFS', 'BFST', 'BFY', 'BFZ', 'BG', 'BGC', 'BGCP', 'BGFV', 'BGG', 'BGNE', 'BGS', 'BGSF', 'BHC', 'BHE', 'BHF', 'BHLB', 'BHP', 'BIDU', 'BIF', 'BIG', 'BIIB', 'BILI', 'BIO', 'BIOL', 'BIOS', 'BIP', 'BIVV', 'BJ', 'BJRI', 'BK', 'BKD', 'BKE', 'BKH', 'BKI', 'BKNG', 'BKR', 'BKU', 'BL', 'BLBD', 'BLDR', 'BLFS', 'BLK', 'BLKB', 'BLL', 'BLMN', 'BLPH', 'BLRX', 'BLUE', 'BLX', 'BMA', 'BMCH', 'BME', 'BMI', 'BMO', 'BMRA', 'BMRC', 'BMRN', 'BMTC', 'BMY', 'BNED', 'BNFT', 'BNGO', 'BNS', 'BNSO', 'BNTC', 'BNTX', 'BOCH', 'BOH', 'BOJA', 'BOKF', 'BOMN', 'BOOM', 'BOOT', 'BORR', 'BOX', 'BP', 'BPFH', 'BPMC', 'BPOP', 'BPTH', 'BPY', 'BQ', 'BR', 'BRC', 'BRFS', 'BRID', 'BRK.B', 'BRKL', 'BRKR', 'BRKS', 'BRO', 'BRP', 'BRSS', 'BRT', 'BRX', 'BRY', 'BSAC', 'BSBR', 'BSET', 'BSIG', 'BSM', 'BSMX', 'BSRR', 'BSTC', 'BSX', 'BTAI', 'BTE', 'BTI', 'BTN', 'BTU', 'BTX', 'BTZ', 'BUD', 'BUFF', 'BURL', 'BUSE', 'BV', 'BVN', 'BW', 'BWA', 'BWAY', 'BWB', 'BWEN', 'BWFG', 'BWXT', 'BX', 'BXC', 'BXG', 'BXMT', 'BXP', 'BXS', 'BY', 'BYD', 'BYND', 'BZH', 'BZUN', 'C', 'CAAP', 'CABO', 'CAC', 'CACC', 'CACI', 'CADE', 'CAE', 'CAF', 'CAG', 'CAH', 'CAI', 'CAJ', 'CAL', 'CALA', 'CALM', 'CALX', 'CAMP', 'CAMT', 'CANG', 'CAPL', 'CAPR', 'CAR', 'CARA', 'CARG', 'CARS', 'CASA', 'CASH', 'CASI', 'CASS', 'CASY', 'CAT', 'CATB', 'CATM', 'CATS', 'CATY', 'CB', 'CBB', 'CBBT', 'CBD', 'CBFV', 'CBIO', 'CBL', 'CBLK', 'CBM', 'CBMG', 'CBRE', 'CBRL', 'CBS', 'CBT', 'CBTX', 'CBU', 'CBZ', 'CC', 'CCBG', 'CCC', 'CCEP', 'CCF', 'CCI', 'CCJ', 'CCK', 'CCL', 'CC

class StockDataFetcher {
  #apiUrl;
  #apiUrlDaily;
  static apiKey = 'XVYHOWRTRNPN3FJA';

  constructor(symbol, interval, intraDay, 
    this.symbol = symbol;
    this.interval = '5min';
    this.#apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${StockDataFetcher.apiKey}`;
    this.#apiUrlDaily = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${StockDataFetcher.apiKey}`;
  }

  async fetchData() {
    try {
      const response = await fetch(this.#apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      alert('Error fetching data:', error);
      return null;
    }
  }

  convertToCSV(data) {
    const rows = [];
    const timeSeries = data['Time Series (Daily)'];
    rows.push('Date,Open,High,Low,Close,Volume');
    for (const date in timeSeries) {
      const { open, high, low, close, volume } = timeSeries[date];
      rows.push(`${date},${open},${high},${low},${close},${volume}`);
    }
    return rows.join('\n');
  }

  async createChart() {
    const data = await this.fetchData();
    const csvData = this.convertToCSV(data);
    const chart = document.createElement('div');
    const div = this.createDiv();
    
  }

  async createTable() {
    const csvData = await this.fetchData();
    const rows = csvData.split('\n');
    const table = document.createElement('table');
    table.className = 'table table-striped';
    const headerRow = document.createElement('tr');
    const headers = rows[0].split(',');
    for (const header of headers) {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const tr = document.createElement('tr');
      const cells = row.split(',');
      for (const cell of cells) {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    document.getElementById('table').appendChild(table);
  }
}

class domElement {
  constructor() {
    this.div = document.createElement('div');
    this.className = '';
    this.id = '';
    this.style = '';
    this.innerHTML = '';
    this.location = '';
  }

  createDiv() {
    this.div.className = 'container';
    this.div.id = 'table';
    this.div.style = 'margin-top: 20px';
    this.div.innerHTML
    return this.div;
  }
}

class TeslaStockDataFetcher extends StockDataFetcher {
  constructor() {
    super('TSLA');
  }

}

function logExecution(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args) {
    alert(`Executing ${propertyKey} with arguments: ${args}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

class TeslaStockDataVisualizer extends TeslaStockDataFetcher {}

const teslaFetcher = new EnhancedTeslaStockDataFetcher();
const teslaVisualizer = new TeslaStockDataVisualizer();