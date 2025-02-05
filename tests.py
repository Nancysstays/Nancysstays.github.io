import unittest
from unittest.mock import patch, Mock
import yfinance as yf  # Or mock yfinance for faster tests
import backtrader as bt
import numpy as np
from scipy.linalg import eig
from hmmlearn import hmm


class TestYourStrategy(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Download data once for all tests (or mock this for even faster tests)
        cls.data = yf.download(tickers="TSLA", period="1y", interval="1d")  
        cls.cerebro = bt.Cerebro()
        cls.cerebro.adddata(bt.feeds.PandasData(dataname=cls.data))
        cls.cerebro.addstrategy(YourStrategy)
        cls.cerebro.broker.setcash(100000.0)


    def setUp(self):
        self.strategy = YourStrategy(self.cerebro.datas[0])  # Create a fresh Strategy instance per test
        self.strategy.broker.setcash(100000.0)  # reset portfolio cash



    @patch('scipy.linalg.eig')  # Mock eig to control its output
    @patch('hmmlearn.hmm.GaussianHMM.fit')  # Mock HMM fitting
    @patch('hmmlearn.hmm.GaussianHMM.predict', return_value=np.array([1] * 99 + [1]))  # Mock predict, state 1
    def test_buy_signal(self, mock_predict, mock_fit, mock_eig):
        mock_eig.return_value = (np.array([1.0]), np.array([[1.0]]))  # Dummy eigenvalues and vectors

        self.strategy.macd = Mock()
        self.strategy.macd.return_value = 10  # Simulate positive MACD


        # Simulate enough data points
        self.strategy.data.close = self.data.close[:101]  # Provide first 101 elements


        self.strategy.next()

        self.assertIsNotNone(self.strategy.order, "Buy order should be created")
        self.assertEqual(self.strategy.order.isbuy(), True)




    @patch('scipy.linalg.eig')  # Mock eig to control its output
    @patch('hmmlearn.hmm.GaussianHMM.fit')  # Mock HMM fitting
    @patch('hmmlearn.hmm.GaussianHMM.predict', return_value=np.array([2] * 99 + [2]))  # Mock predict, return state 2
    def test_sell_signal(self, mock_predict, mock_fit, mock_eig):
        mock_eig.return_value = (np.array([1.0]), np.array([[1.0]]))

        # Set up a mock buy order so there is an order to sell.
        mock_order = Mock()
        mock_order.isbuy.return_value = True # Mimic an existing buy order
        self.strategy.order = mock_order

        self.strategy.macd = Mock()  # Mock macd
        self.strategy.macd.return_value = -10  # Negative MACD

        # Simulate enough data points for the HMM
        self.strategy.data.close = self.data.close[:101] # Provide enough data

        self.strategy.next()

        self.assertTrue(self.strategy.order.isclose())





if __name__ == '__main__':
    unittest.main()


