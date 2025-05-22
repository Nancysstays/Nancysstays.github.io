# TensorFlow Stock Price Predictor

![Python CI for Stock Predictor](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions/workflows/python-ci.yml/badge.svg)

## Description
This project aims to predict stock prices using a Long Short-Term Memory (LSTM) neural network. It utilizes `yfinance` to fetch historical stock data and `TensorFlow`/`Keras` to build and train the LSTM model. The system can be trained on specific stock data for a given period and then used to predict the next business day's price.

## Features
*   Fetches historical stock data using `yfinance`.
*   Preprocesses data, including scaling and creating sequences suitable for time series forecasting.
*   Builds a flexible LSTM model architecture using TensorFlow/Keras.
*   Trains the model on specified stock ticker data and historical date ranges.
*   Saves the trained model (weights and architecture) and the data scaler used during training.
*   Predicts the next business day's stock price using a previously trained model and the latest available data.

## Directory Structure
```
.
├── stock_predictor/
│   ├── data_loader.py    # Fetches stock data via yfinance
│   ├── preprocessor.py   # Prepares data for the LSTM model
│   ├── model.py          # Defines the LSTM model architecture
│   ├── train.py          # Script to train a new model
│   └── predict.py        # Script to make predictions
├── trained_models/         # Default directory for saved models and scalers (created by train.py)
├── requirements.txt      # Python package dependencies
└── README.md             # This file
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/stock-predictor.git
    ```
    (Replace the URL with the actual repository URL if available)

2.  **Navigate to the project directory:**
    ```bash
    cd stock-predictor
    ```

3.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    ```
    Activate the environment:
    *   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    *   On Windows:
        ```bash
        venv\Scripts\activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Usage

### Training a Model

To train a new model for a specific stock:

1.  Ensure you are in the root directory of the project.
2.  Run the `train.py` script (as a module from the project root):
    ```bash
    python -m stock_predictor.train --ticker <TICKER_SYMBOL> --start_date <YYYY-MM-DD> --end_date <YYYY-MM-DD> [options]
    ```

    **Key Arguments:**
    *   `--ticker`: (Required) The stock ticker symbol (e.g., `AAPL`, `MSFT`, `GOOGL`).
    *   `--start_date`: (Required) The start date for the historical data used for training (format: YYYY-MM-DD).
    *   `--end_date`: (Required) The end date for the historical data used for training (format: YYYY-MM-DD).
    *   `--feature_column`: The column in the stock data to predict (default: `Close`).
    *   `--sequence_length`: Number of past days' data to use for predicting the next day (default: `60`).
    *   `--epochs`: Number of training epochs (default: `50`).
    *   `--batch_size`: Batch size for training (default: `32`).
    *   `--model_dir`: Directory to save the trained model and scaler (default: `trained_models`).
    *   `--model_name`: Base name for the saved model file (default: `stock_predictor`). The ticker will be appended.

    **Example:**
    ```bash
    python -m stock_predictor.train --ticker GOOGL --start_date 2019-01-01 --end_date 2023-12-31 --epochs 100
    ```
    This command will fetch data for GOOGL from 2019 to 2023, train an LSTM model for 100 epochs, and save the model as `trained_models/stock_predictor_GOOGL.keras` and the scaler as `trained_models/scaler_GOOGL.joblib`.

### Making Predictions

To predict the next business day's stock price using a previously trained model:

1.  Ensure you are in the root directory of the project.
2.  Run the `predict.py` script (as a module from the project root):
    ```bash
    python -m stock_predictor.predict --ticker <TICKER_SYMBOL> [options]
    ```

    **Key Arguments:**
    *   `--ticker`: (Required) The stock ticker symbol for which a trained model exists.
    *   `--model_dir`: Directory where the trained model and scaler are stored (default: `trained_models`).
    *   `--model_name`: Base name of the saved model file (default: `stock_predictor`).
    *   `--feature_column`: The feature that was predicted during training (default: `Close`).
    *   `--sequence_length`: Look-back window size used during training (default: `60`).
    *   `--prediction_end_date`: The last date of available data to use as a basis for predicting the next day (format: YYYY-MM-DD, default: current day).

    **Example:**
    ```bash
    python -m stock_predictor.predict --ticker GOOGL --prediction_end_date 2024-03-15
    ```
    This command will load the model and scaler for GOOGL from the `trained_models` directory, fetch the latest data up to March 15, 2024, and predict the 'Close' price for the next business day.

## Continuous Integration (CI)
This project uses GitHub Actions for Continuous Integration. The workflow (defined in `.github/workflows/python-ci.yml`) automatically builds and tests the application on every push or pull request to the `main` branch. It performs the following checks:
- Sets up a Python environment.
- Installs all dependencies from `requirements.txt`.
- Runs a quick test of the training script (`train.py`) with sample parameters.
- Runs a quick test of the prediction script (`predict.py`) using the model generated by the training test.

## Disclaimer
This project is for educational purposes only and should not be considered financial advice. Stock market predictions are inherently risky, and past performance is not indicative of future results. Use any information or predictions from this tool at your own risk.
