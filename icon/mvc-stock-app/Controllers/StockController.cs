using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using YourNamespace.Models; // Update with your actual namespace

namespace YourNamespace.Controllers // Update with your actual namespace
{
    public class StockController : Controller
    {
        private readonly HttpClient _httpClient;
        private const string AlphaVantageApiKey = "YOUR_API_KEY"; // Replace with your actual API key

        public StockController()
        {
            _httpClient = new HttpClient();
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> FetchStockData(string tickerSymbol, string interval)
        {
            var dailyData = await GetStockData(tickerSymbol, "TIME_SERIES_DAILY");
            var intradayData = await GetStockData(tickerSymbol, $"TIME_SERIES_INTRADAY&interval={interval}");

            var stockModel = new StockModel
            {
                TickerSymbol = tickerSymbol,
                DailyData = dailyData,
                IntradayData = intradayData
            };

            // Calculate technical indicators
            stockModel.CalculateIndicators();

            return View("Index", stockModel);
        }

        private async Task<dynamic> GetStockData(string tickerSymbol, string function)
        {
            var url = $"https://www.alphavantage.co/query?function={function}&symbol={tickerSymbol}&apikey={AlphaVantageApiKey}";
            var response = await _httpClient.GetStringAsync(url);
            return JsonConvert.DeserializeObject<dynamic>(response);
        }
    }
}