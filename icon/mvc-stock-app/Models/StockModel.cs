using System;
using System.Collections.Generic;

namespace mvc_stock_app.Models
{
    public class StockModel
    {
        public string TickerSymbol { get; set; }
        public Dictionary<string, decimal> DailyData { get; set; }
        public Dictionary<string, decimal> IntradayData { get; set; }
        public decimal MACD { get; set; }
        public decimal CCI { get; set; }
        public decimal RSI { get; set; }
        public decimal VWMA { get; set; }
        public decimal EMA { get; set; }
        public decimal VWAP { get; set; }
        public decimal Covariance { get; set; }

        public StockModel()
        {
            DailyData = new Dictionary<string, decimal>();
            IntradayData = new Dictionary<string, decimal>();
        }

        public void CalculateCovariance(Dictionary<string, decimal> otherTickerData)
        {
            // Implementation for covariance calculation
        }

        // Additional methods for calculating technical indicators can be added here
    }
}