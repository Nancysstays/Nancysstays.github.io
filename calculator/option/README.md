Stock Chart App
This repository hosts a dynamic Stock Chart Application that allows users to visualize stock data interactively. Below is an overview of the app’s structure, functionality, and important implementation details.

Table of Contents
Overview
Features
Technologies Used
Application Structure
How It Works
Setup and Usage
Contributing
License
Overview
The Stock Chart App fetches and displays stock data dynamically, providing a smooth and interactive user experience. It is implemented with clean object-oriented design principles and modular components to ensure maintainability and scalability.

Features
Dynamic stock chart rendering.
Autocomplete functionality for stock symbols.
Error handling for network and API issues.
Interactive UI controls for data fetching and visualization.
Technologies Used
HTML: For structuring the application.
JavaScript: Core functionality, dynamic loading, and event handling.
CSS: For basic styling.
Charting Library: Dynamically loaded via CDN.
API Integration: Uses a financial market data API.
Application Structure
The application is organized into several core components and follows a structured flow for initialization and interaction.

HTML
Sets up the basic structure and includes necessary styles and scripts.
JavaScript
Classes Defined:
StockChartApp: Serves as the main entry point of the application.
UIManager: Manages chart rendering and UI interactions.
FmpApiClient: Handles API communication.
Autocomplete: Provides autocomplete functionality for stock symbols.
Dynamic Loader: Loads external charting libraries asynchronously.
Event Flow
DOMContentLoaded Event:
Ensures the HTML structure is fully loaded before executing scripts.
Initializes the app and its dependencies.
UI Interaction:
Button clicks or "Enter" keypresses trigger data fetching and chart updates.
How It Works
Initialization:

UI selectors and default stock symbols are defined.
An instance of StockChartApp is created with dependencies injected.
The app.init() method is invoked.
app.init():

Displays an initial loading message.
Asynchronously loads the charting library via loadScript.
Initializes the chart UI with UIManager.
Enables a load button and sets up event listeners for UI controls.
Event Handling:

A wrapped loadChart function ensures proper loading and error handling.
When triggered, it fetches data via FmpApiClient, processes it, and updates the chart.
Error Handling:

Errors (e.g., API/network issues or no data) are caught and handled gracefully.
Displays an error message and clears chart data if necessary.
Setup and Usage
Clone the repository:
bash
git clone https://github.com/Nancysstays/Nancysstays.github.io.git
cd Nancysstays.github.io
Navigate to the calculator/option directory.
Open the HTML file in a browser, or host the app on a local server.
Enter stock symbols and interact with the app.
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a feature branch:
bash
git checkout -b feature-name
Commit your changes:
bash
git commit -m "Add feature"
Push to the branch:
bash
git push origin feature-name
Create a pull request.
License
This project is licensed under the MIT License.
