import yfinance as yf
import json

def get_stock_data(ticker, period="1mo", interval="1d"):
    try:
        data = yf.download(ticker, period=period, interval=interval)
        if data.empty:
            return json.dumps({"error": "No data found for this ticker"})
        # Convert the pandas DataFrame to a list of dictionaries
        data_list = []
        for index, row in data.iterrows():
            data_list.append({
                "Date": index.strftime("%Y-%m-%d"),  # Format the date
                "Open": row["Open"],
                "High": row["High"],
                "Low": row["Low"],
                "Close": row["Close"],
                "Adj Close": row["Adj Close"],
                "Volume": row["Volume"]
            })
        return json.dumps(data_list)  # Return data as JSON string

    except Exception as e:  # Handle exceptions properly
        return json.dumps({"error": str(e)})


if __name__ == "__main__":  # Allows direct execution for testing
    import sys
    if len(sys.argv) > 1:
        ticker = sys.argv[1]
        period = sys.argv[2] if len(sys.argv) > 2 else "1mo"  # optional period
        interval = sys.argv[3] if len(sys.argv) > 3 else "1d" # optional interval
        print(get_stock_data(ticker, period, interval))

