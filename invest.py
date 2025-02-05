import backtrader as bt # type: ignore
import yfinance as yf # type: ignore
import numpy as np
from scipy.linalg import eig
from hmmlearn import hmm # type: ignore

class YourStrategy(bt.Strategy):
    params = (
        ('period', 20),
        ('fast_period', 12),
        ('slow_period', 26),
        ('signal_period', 9),
    )

    def __init__(self):
        self.macd = bt.indicators.MACDHisto(
            self.data,
            period=self.p.period,
            fastperiod=self.p.fast_period,
            slowperiod=self.p.slow_period,
            signalperiod=self.p.signal_period,
        )
        self.covariance_matrix = None
        self.eigenvalues = None
        self.eigenvectors = None
        self.model = hmm.GaussianHMM(n_components=3, covariance_type="full", n_iter=100)
        self.order = None  # Initialize order status

    def next(self):
        if len(self) > self.p.period:
            # Covariance Calculation
            prices = np.array([self.data.close[i] for i in range(len(self) - self.p.period, len(self))])
            if self.covariance_matrix is None:
                self.covariance_matrix = np.cov(prices)
            else:
                self.covariance_matrix = 0.9 * self.covariance_matrix + 0.1 * np.cov(prices)

            # Eigen Decomposition
            self.eigenvalues, self.eigenvectors = eig(self.covariance_matrix)

            # HMM Training
            if len(self) > 100:
                X = np.array([self.data.close[i] for i in range(len(self) - 100, len(self))]).reshape(-1, 1)
                self.model.fit(X)
                hidden_states = self.model.predict(X)
                current_state = hidden_states[-1]

                # Trading Logic (Example using MACD and current HMM state)
                if self.macd[0] > 0 and current_state == 1 and self.order is None:  # Buy signal (state 1 example)
                    self.order = self.buy()
                elif self.macd[0] < 0 and current_state == 2 and self.order:  # Sell signal (state 2 example)
                    self.order = self.close() # Use .close() to close existing positions

# Fetch data
data = yf.download(tickers="TSLA", period="1y", interval="1d")

# Create a Cerebro instance
cerebro = bt.Cerebro()

# Add the data
cerebro.adddata(bt.feeds.PandasData(dataname=data))

# Add your strategy
cerebro.addstrategy(YourStrategy)

# Set initial cash
cerebro.broker.setcash(100000.0)

# Run the backtest
cerebro.run()

# Plot the results
cerebro.plot()