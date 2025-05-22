# Interactive Stock Chart Application

This repository hosts a dynamic Stock Chart Application that allows users to visualize historical stock data interactively fetched from a financial data API. It's built with plain JavaScript, demonstrating modern language features and object-oriented principles for a clean and maintainable codebase.

## Table of Contents

*   [Overview](#overview)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Application Structure](#application-structure)
*   [How It Works](#how-it-works)
*   [Setup and Usage](#setup-and-usage)
*   [Contributing](#contributing)
*   [License](#license)

## Overview

The Stock Chart App provides a single-page interface to fetch and display historical stock data. Users can specify the stock symbol, desired time interval (e.g., 5 minutes, 1 day), and a date range. The chart updates dynamically based on user input without requiring a page reload, providing a smooth and interactive experience. The application is implemented with clean object-oriented design principles and modular components.

## Features

*   Dynamic rendering of interactive candlestick charts using the Lightweight Charts library.
*   User-configurable parameters: stock symbol, chart interval (1min, 5min, 15min, 30min, 1hour, 4hour, 1day, 1week, 1month), start date, and end date.
*   Autocomplete suggestions for stock symbols from a local predefined list, enhancing usability.
*   Data fetching from the Financial Modeling Prep (FMP) API using asynchronous JavaScript (`async`/`await`).
*   Robust error handling for network issues, API responses (invalid key, data not found, rate limits), and data processing problems.
*   Clear loading and error messages displayed directly within the chart container.
*   Responsive chart design that adjusts to container size changes.
*   Demonstrates modern JavaScript features, including:
    *   ES6+ Class syntax with public, `#private`, and `static` members.
    *   A manual "wrapper" pattern (similar to a decorator) to handle repetitive loading and error UI state around asynchronous operations.
    *   Example usage of Generators and Iterators (`[Symbol.iterator]`) for potential data processing workflows.
    *   Dynamic, asynchronous loading of the charting library script via CDN.

## Technologies Used

*   **HTML:** Structures the user interface and the container for the chart.
*   **CSS:** Styles the UI elements and chart container for a consistent look and feel.
*   **JavaScript (ES6+):** Implements the core application logic, object-oriented structure, asynchronous operations (Promises, `async`/`await`), event handling, and data manipulation.
*   **Lightweight Charts:** A financial charting library dynamically loaded from a CDN, used for rendering the candlestick chart.
*   **Financial Modeling Prep (FMP) API:** Provides the historical stock price data (`/historical-chart/{interval}/{symbol}` endpoint used here).

## Application Structure

The application is primarily structured using JavaScript Classes defined within a single HTML file for simplicity in this example.

*   **HTML (`index.html`):**
    *   Defines the layout: control panel (`.controls`) with input fields, dropdowns, date pickers, and a button, and a chart container (`#chart-container`).
    *   Includes the main `<script>` block for all JavaScript logic.
    *   Includes basic CSS for styling.

*   **JavaScript Classes:**
    *   `FmpApiClient`: Manages communication with the Financial Modeling Prep API. Contains methods for fetching data. Uses `#private` fields for sensitive information (like the API key) and `static` fields for shared configurations (like the base API URL).
    *   `UIManager`: Handles all user interface updates and interactions. Manages UI elements (inputs, messages, button state) and the lifecycle of the Lightweight Chart instance and its series. Uses `#private` fields for DOM element references and a protected convention (`_`) for the chart instance and observer. Includes `static` utility methods (like `isValidInterval`).
    *   `Autocomplete`: Provides symbol suggestions based on user input from a predefined local list. Manages the autocomplete dropdown (`<ul>`) and its interaction with the symbol input field. Uses `#private` fields for its state and logic and `static` methods (like `createDefaultList`).
    *   `ChartDataCollection`: A simple wrapper class for the fetched historical data array. Demonstrates the use of `#private` fields for the internal data storage and implements the `[Symbol.iterator]` protocol using a `function*` (generator) to allow iterating over the data. (Note: The chart uses the raw array, this class is primarily for demonstrating the iterator/generator pattern).
    *   `StockChartApp`: The main application class that orchestrates the others. Its constructor initializes instances of `UIManager`, `FmpApiClient`, and `Autocomplete`. It contains the primary `init` method to start the application and handles the overall flow.

*   **Dynamic Loader (`loadScript` function):** A standalone `async` function that dynamically creates a `<script>` element to load an external library (Lightweight Charts) from a CDN, returning a Promise that resolves upon successful load.

*   **Wrapper/Decorator (`withLoadingAndErrorHandling` function):** A higher-order function that takes an `async` function (like the core data fetcher) and a `UIManager` instance. It returns a *new* `async` function that wraps the original, adding consistent UI state management (loading messages, button disabling/enabling, general error display) around the execution of the wrapped function.

## How It Works

The application follows a clear flow from initialization through user interaction and data display:

1.  **`DOMContentLoaded` Event:** When the HTML document is ready, an event listener triggers the application's startup.
2.  **Initial Application Setup:** Inside the listener, UI elements are referenced, default settings (like initial dates) are determined, and the required class instances (`StockChartApp`, which in turn creates `UIManager`, `FmpApiClient`, `Autocomplete`) are created.
3.  **`app.init()` Execution:**
    *   An initial "Loading library..." message is shown via the `UIManager`.
    *   The `loadScript` function is called using `await` to dynamically load the Lightweight Charts library from the specified CDN. This ensures the charting library's code is available globally.
    *   If the library loads successfully, the `UIManager` is used to **create the actual Lightweight Chart instance** within the container.
    *   The "Load Chart" button is enabled, and the initial message is hidden.
    *   Event listeners are set up on the UI controls (`symbolInput`, `intervalSelect`, `date inputs`, `loadChartButton`) using the `#setupEventListeners` private method.
    *   Within `#setupEventListeners`, the core data fetching and rendering method (`#fetchAndRender`) is passed to the `withLoadingAndErrorHandling` function to create a **wrapped version (`loadChartWrapped`)**. This wrapped function becomes the actual event handler for the button click and Enter key presses.
    *   Finally, the `loadChartWrapped` function is called once to perform an initial chart load using the default values from the UI.
4.  **User Interaction & Event Handling:**
    *   When the user types in the symbol input, the `Autocomplete` class handles showing/hiding suggestions from its local list. Clicking a suggestion updates the input value.
    *   When the user clicks the "Load Chart" button or presses "Enter" while focused on any of the control inputs, the `loadChartWrapped` function (attached as the event listener) is executed.
    *   **Inside `loadChartWrapped` (The Wrapper):**
        *   It retrieves the current symbol, interval, and date range values from the UI elements via the `UIManager`.
        *   It displays a "Loading..." message and disables the "Load Chart" button using the `UIManager`.
        *   It enters a `try...catch` block to manage the asynchronous operation and potential errors.
        *   It calls the core data fetching and rendering logic (`#fetchAndRender`) using `await`.
    *   **Inside `#fetchAndRender` (Core Logic):**
        *   It uses the `FmpApiClient` instance to call the `fetchHistoricalChart` method, sending the user-defined parameters to the FMP API.
        *   It `await`s the API response.
        *   If the API request is successful and returns data, it formats the data for the chart.
        *   It creates an instance of `ChartDataCollection` with the fetched data (demonstrating the Iterator/Generator pattern).
        *   It uses the `UIManager` to update the chart's data series with the formatted data (obtained from `dataCollection.rawData`). It also adjusts the chart's time scale based on the selected interval.
    *   **Back in `loadChartWrapped` (The Wrapper):**
        *   **If `#fetchAndRender` Succeeded:** The `try` block completes. The wrapper hides the loading message and re-enables the "Load Chart" button using the `UIManager`.
        *   **If `#fetchAndRender` Threw an Error:** The `catch` block is executed. The wrapper logs the error, uses the `UIManager` to display a user-friendly error message (clearing any existing chart data), and re-enables the "Load Chart" button.
5.  **Cleanup:** An optional `beforeunload` event listener is set up to call the `cleanup` method on the `StockChartApp` instance, which uses the `UIManager` to properly dispose of the Lightweight Chart instance and the ResizeObserver when the user leaves the page, preventing potential memory leaks.

## Setup and Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Nancysstays/Nancysstays.github.io.git
    cd Nancysstays.github.io/calculator/option # Assuming the file is in this directory
    ```
2.  **Obtain an FMP API Key:** Go to [https://financialmodelingprep.com/developer/docs](https://financialmodelingprep.com/developer/docs) and sign up for an API key.
3.  **Replace the placeholder API Key:** Open the `index.html` file in a text editor. Find the line `const API_KEY = '...';` and replace the placeholder value with your actual FMP API key.
4.  **Open in Browser:** Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, Edge, Safari).
5.  **Interact:** Enter a stock symbol (autocomplete suggestions will appear for some common tickers), select an interval and date range, and click the "Load Chart" button or press Enter.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch:
    ```bash
    git checkout -b feature-name
    ```
3.  Commit your changes:
    ```bash
    git commit -m "Add feature"
    ```
4.  Push to the branch:
    ```bash
    git push origin feature-name
    ```
5.  Create a pull request.

## License

This project is licensed under the MIT License.
