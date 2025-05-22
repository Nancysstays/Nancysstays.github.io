```markdown
# Option Calculator

The `option-calculator` directory contains the assets and files required for the **Options Trading Calculator**. This tool allows users to analyze and visualize option strategies with an intuitive interface, interactive charts, and API integrations.

## File Structure

option-calculator/
├── index.html          # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css  # CSS file for styling
│   └── js/
│       ├── app.js      # Main JavaScript file
│       ├── calculator.js # Contains the OptionsCalculator class
│       ├── chart.js    # Handles chart rendering logic
│       └── api.js      # Handles API calls (e.g., fetching stock prices)

## Features

### 1. **Interactive UI/UX**
   - **Dropdown for Option Strategies**: Users can select from a variety of predefined option strategies, such as "Long Call," "Long Put," "Covered Call," etc.
   - **Dynamic Inputs**: Adjustable fields for stock price, strike prices, volatility, and time to expiry.

   Example snippet from the UI in `index.html`:
   ```html
   <label for="option-strategy">Option Strategy:</label>
   <select id="option-strategy">
     <option value="call">Long Call</option>
     <option value="put">Long Put</option>
     <option value="covered_call">Covered Call</option>
     <option value="protective_put">Protective Put</option>
     <option value="long_straddle">Long Straddle</option>
     <option value="long_strangle">Long Strangle</option>
     <option value="bull_call_spread">Bull Call Spread</option>
     <option value="bear_put_spread">Bear Put Spread</option>
     <option value="long_calendar_spread">Long Calendar Spread</option>
   </select>
   ```

   - **Interactive Charts**: Charts are dynamically generated to display profit/loss for the selected strategies, making it easier to visualize complex options data.

---

### 2. **Option Pricing Calculations**
   - The calculator uses the **Black-Scholes model** for options pricing. It supports both call and put options and calculates the payoff dynamically based on user inputs.

   Example from `calculator.js`:
   ```javascript
   function calculateOptionPrice(optionType, stockPrice, strikePrice, volatility, timeToExpiry, riskFreeRate = 0.05) {
   }
   ```

   - **Strategies Supported**:
     - Single options: Long Call, Long Put
     - Spreads: Bull Call Spread, Bear Put Spread
     - Combinations: Long Straddle, Long Strangle
     - Additional: Covered Call, Protective Put, Long Calendar Spread

---

### 3. **Dynamic API Integration**
   - Real-time stock price data is fetched using an external API (e.g., Yahoo Finance).
   - Example function from `api.js`:
     ```javascript
     async function fetchStockPrice(symbol) {
     }
     ```

   - Users can input a stock symbol and fetch the current price, which is automatically updated in the calculator.

---

### 4. **Interactive Charts**
   - Users can visualize the profit/loss dynamics for selected strategies.
   - Charts are powered by **Plotly.js**, providing a modern and interactive experience.

   Example from `chart.js`:
   ```javascript
   function updateChart() {
   }
   ```

---

## How to Use

1. Open the `index.html` file in a browser to launch the calculator.
2. Select an option strategy from the dropdown menu.
3. Input parameters such as stock price, strike price, volatility, and time to expiry.
4. Fetch the current stock price using the stock symbol input field (optional).
5. View the profit/loss chart and analyze the selected strategy.

---

## Contributing

To contribute to this project:
- Fork the repository and create a new branch for your feature or bug fix.
- Ensure that all changes are consistent with the directory structure and modular organization.
- Submit a pull request explaining your changes.

---

## License

```

This `README.md` file now includes snippets from the source code to provide a detailed explanation of the UI/UX and functionalities. Let me know if you'd like to add anything else!
