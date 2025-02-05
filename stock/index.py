import numpy as np
from scipy.stats import norm
import yfinance as yf

class BayesianModel:
    def __init__(self, prior_mean, prior_std, likelihood_std):
        self.prior_mean = prior_mean
        self.prior_std = prior_std
        self.likelihood_std = likelihood_std

    def update(self, data):
        likelihood_mean = np.mean(data)
        likelihood_var = self.likelihood_std ** 2
        prior_var = self.prior_std ** 2

        posterior_mean = (likelihood_mean * prior_var + self.prior_mean * likelihood_var) / (prior_var + likelihood_var)
        posterior_std = np.sqrt((prior_var * likelihood_var) / (prior_var + likelihood_var))

        self.prior_mean = posterior_mean
        self.prior_std = posterior_std

    def get_posterior(self):
        return self.prior_mean, self.prior_std

class StockBayesianModel(BayesianModel):
    def __init__(self, ticker, prior_mean, prior_std, likelihood_std):
        super().__init__(prior_mean, prior_std, likelihood_std)
        self.ticker = ticker

    def fetch_data(self, period='1mo'):
        stock_data = yf.download(self.ticker, period=period)
        return stock_data['Close'].tolist()

    def update_with_stock_data(self, period='1mo'):
        data = self.fetch_data(period)
        self.update(data)

    @staticmethod
    def calculate_return(data):
        return np.diff(data) / data[:-1]

# Example usage
if __name__ == "__main__":
    model = StockBayesianModel('AAPL', prior_mean=150, prior_std=10, likelihood_std=5)
    model.update_with_stock_data('1mo')
    posterior_mean, posterior_std = model.get_posterior()
    print(f"Posterior Mean: {posterior_mean}, Posterior Std: {posterior_std}")