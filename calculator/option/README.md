Overall Structure and Flow:
The HTML sets up the basic structure and styles.
The main script block defines all the classes and the dynamic loader function.
An event listener waits for the DOMContentLoaded event to ensure the HTML structure is ready.
Inside the DOM listener:
UI selectors are defined.
Default symbols are obtained using a static method.
An instance of StockChartApp is created, injecting dependencies (API_KEY, elementSelectors, defaultSymbols). The constructor of StockChartApp in turn creates instances of UIManager, FmpApiClient, and Autocomplete.
The Jinx Init method is called.
Shows an initial loading message.
Awaits the loadScript promise for the charting library CDN.
If the library loads, it uses the UIManager instance to create the chart and get references to the series and observer.
Enables the load button and hides the initial message.
Sets up event listeners for the UI controls via #setupEventListeners. This step includes creating the wrapped loadChart function using withLoadingAndErrorHandling.
Triggers the first chart load by calling the wrapped load function with default UI values.
When the button is clicked or Enter is pressed on an input:
The event listener calls the wrapped loadChartWrapped function.
The wrapper gets the latest values from the UI, shows a loading message, disables the button, and calls the original #fetchAndRender method.
#fetchAndRender uses the FmpApiClient to fetch data.
The fetched data is used to create a ChartDataCollection instance (for demo purposes) and passed to the UIManager to update the chart series.
If #fetchAndRender succeeds, the wrapper hides messages and enables the button.
If #fetchAndRender throws an error (API error, network issue, no data), the wrapper catches it, shows an error message, clears the chart data, and enables the button.
