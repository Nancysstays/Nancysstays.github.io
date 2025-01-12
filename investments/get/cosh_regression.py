import numpy as np
from scipy.optimize import curve_fit

class CoshRegression:
    def __init__(self, a, b, c):
        self._a = a
        self._b = b
        self._c = c

    @staticmethod
    def cosh_function(x, a, b, c):
        return a * np.cosh(b * x) + c

    @classmethod
    def from_params(cls, params):
        return cls(*params)

    def predict(self, x):
        return self.cosh_function(x, self._a, self._b, self._c)

    def __call__(self, x):
        return self.predict(x)

def fit_cosh_regression(csv_file):
    data = pd.read_csv(csv_file)
    X = data.index.values
    Y = data['Close'].values

    def cosh_regression(x, a, b, c):
        return a * np.cosh(b * x) + c

    params, _ = curve_fit(cosh_regression, X, Y)
    model = CoshRegression.from_params(params)
    return model

if __name__ == "__main__":
    model = fit_cosh_regression('ohlc_data.csv')
    x_new = np.array([1, 2, 3])
    y_pred = model(x_new)
    print(y_pred)