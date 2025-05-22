# README.md

# MVC Stock App

## Overview
The MVC Stock App is a web application that allows users to fetch stock data from Alpha Vantage. Users can input ticker symbols and intervals to retrieve daily and intraday time series data. The application calculates various technical indicators including MACD, CCI, RSI, VWMA, EMA, and VWAP. It also computes covariance with a user-selected ticker, typically the Dow.

## Features
- Fetch stock data from Alpha Vantage API
- Calculate technical indicators: MACD, CCI, RSI, VWMA, EMA, and VWAP
- User input for ticker symbols and intervals
- Covariance calculation with a user-selected ticker
- Local storage management for data persistence outside of market hours (6:30 AM to 1 PM Pacific)

## Project Structure
```
mvc-stock-app
├── Controllers
│   └── StockController.cs
├── Models
│   └── StockModel.cs
├── Views
│   └── Stock
│       └── Index.cshtml
├── wwwroot
│   ├── css
│   │   └── site.css
│   ├── js
│   │   └── site.js
│   └── lib
├── appsettings.json
├── Program.cs
├── Startup.cs
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies.
4. Configure your Alpha Vantage API key in `appsettings.json`.
5. Run the application using your preferred method.

## Usage
- Open the application in your web browser.
- Enter the desired ticker symbol and interval in the input fields.
- View the calculated technical indicators and covariance results.

## License
This project is licensed under the MIT License.