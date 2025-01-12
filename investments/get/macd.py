import pandas as pd

def calculate_macd(csv_file, short_window=12, long_window=26, signal_window=9):
    data = pd.read_csv(csv_file)
    data['EMA12'] = data['Close'].ewm(span=short_window, adjust=False).mean()
    data['EMA26'] = data['Close'].ewm(span=long_window, adjust=False).mean()
    data['MACD'] = data['EMA12'] - data['EMA26']
    data['Signal'] = data['MACD'].ewm(span=signal_window, adjust=False).mean()
    data.to_csv('macd_data.csv')

if __name__ == "__main__":
    calculate_macd('ohlc_data.csv')