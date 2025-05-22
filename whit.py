import yfinance as yf
import numpy as np
import pandas as pd
from scipy.stats import norm
import datetime

def get_data(ticker, period="2y"):
    data = yf.download(ticker, period=period)
    return data

def calculate_volatility(data, period=30):  # Calculate 30-day volatility
    returns = data['Close'].pct_change().dropna()
    volatility = returns.rolling(window=period).std() * np.sqrt(252)  # Annualize
    return volatility

def black_scholes(S, K, T, r, sigma, option_type='call'):
    """Calculates the Black-Scholes option price.

    Args:
        S: Current stock price.
        K: Strike price.
        T: Time to expiration (in years).
        r: Risk-free interest rate (annualized).
        sigma: Volatility (annualized).
        option_type: 'call' or 'put'.

    Returns:
        The Black-Scholes option price.
    """
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == 'call':
        price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    elif option_type == 'put':
        price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    else:
        raise ValueError("Invalid option type. Must be 'call' or 'put'.")
    
    return price

def main(ticker):
    data = get_data(ticker)
    if data.empty:
        print(f"No data found for {ticker}")
        return
    
    volatility = calculate_volatility(data).iloc[-1]  # Get latest volatility
    
    if np.isnan(volatility): # Check for NaN volatility (can happen with insufficient data)
        print("Cannot calculate volatility. Not enough price history.")
        return

    # Get current stock price (you might need to adjust how you get this)
    current_price = data['Close'].iloc[-1]


    # Risk-free rate (you'll need a source for this – using a placeholder)
    risk_free_rate = 0.04  # Example: 4% (adjust as needed)

    # Time to expiration (set to 1 day for next-day prediction)
    time_to_expiration = 1/252  # 1 day in years (assuming 252 trading days)

    # Example Strike Price (you'll need to define this)
    strike_price = current_price * 1.1 # Example: 10% above current price (adjust this!!)


    call_price = black_scholes(current_price, strike_price, time_to_expiration, risk_free_rate, volatility, 'call')
    put_price = black_scholes(current_price, strike_price, time_to_expiration, risk_free_rate, volatility, 'put')
    
    print(f"Volatility: {volatility:.4f}")
    print(f"Call Price for {ticker}: {call_price:.4f}")
    print(f"Put Price for {ticker}: {put_price:.4f}")


if __name__ == "__main__":
    ticker = input("Enter stock ticker symbol: ")
    main(ticker)
