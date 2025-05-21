import yfinance as yf
import pandas as pd

def fetch_stock_data(ticker_symbol: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetches historical stock data for a given ticker symbol between specified dates.

    Args:
        ticker_symbol: The stock ticker symbol (e.g., "AAPL").
        start_date: The start date for the data (YYYY-MM-DD).
        end_date: The end date for the data (YYYY-MM-DD).

    Returns:
        A Pandas DataFrame with the stock data, or an empty DataFrame if an error occurs.
    """
    try:
        stock = yf.Ticker(ticker_symbol)
        data = stock.history(start=start_date, end=end_date)
        if data.empty:
            print(f"No data found for {ticker_symbol} between {start_date} and {end_date}.")
            return pd.DataFrame()
        return data
    except Exception as e:
        print(f"Error fetching data for {ticker_symbol}: {e}")
        return pd.DataFrame()

if __name__ == '__main__':
    # Example usage (optional, for testing)
    ticker_msft = "MSFT"
    start_msft = "2023-01-01"
    end_msft = "2023-12-31"
    print(f"Fetching data for {ticker_msft} from {start_msft} to {end_msft}...")
    stock_data_msft = fetch_stock_data(ticker_msft, start_msft, end_msft)
    if not stock_data_msft.empty:
        print(f"\nSuccessfully fetched data for {ticker_msft}:")
        print(stock_data_msft.head())
    else:
        print(f"\nFailed to fetch data for {ticker_msft}.")

    print("-" * 50)

    ticker_invalid = "NONEXISTENTTICKER123"
    start_invalid = "2023-01-01"
    end_invalid = "2023-12-31"
    print(f"Fetching data for invalid ticker {ticker_invalid}...")
    stock_data_invalid = fetch_stock_data(ticker_invalid, start_invalid, end_invalid)
    if stock_data_invalid.empty:
        print(f"\nCorrectly handled invalid ticker: {ticker_invalid}, no data returned.")
    else:
        print(f"\nUnexpectedly got data for invalid ticker {ticker_invalid}:")
        print(stock_data_invalid.head())

    print("-" * 50)

    # Example with a ticker that might return no data for a very specific, short, or future range
    ticker_nodata_range = "GOOG"
    start_nodata = "2024-01-01" # Assuming a date range where no holiday/weekend data might exist
    end_nodata = "2024-01-01"
    print(f"Fetching data for {ticker_nodata_range} for a specific short interval ({start_nodata} to {end_nodata})...")
    stock_data_nodata = fetch_stock_data(ticker_nodata_range, start_nodata, end_nodata)
    if stock_data_nodata.empty:
        print(f"\nCorrectly handled no data for {ticker_nodata_range} in the interval {start_nodata}-{end_nodata}.")
    else:
        print(f"\nData found for {ticker_nodata_range} in interval {start_nodata}-{end_nodata}:")
        print(stock_data_nodata.head())
