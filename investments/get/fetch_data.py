import yfinance as yf
import pandas as pd

def fetch_ohlc_data(ticker, period='1mo', interval='1d'):
    stock = yf.Ticker(ticker)
    data = stock.history(period=period, interval=interval)
    data.to_csv('ohlc_data.csv')

if __name__ == "__main__":
    fetch_ohlc_data('{ticker}')