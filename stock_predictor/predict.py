import argparse
import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from datetime import datetime, timedelta

# Assuming data_loader.py is in the same directory or PYTHONPATH is set
try:
    from .data_loader import fetch_stock_data
except ImportError:
    # Fallback for running script directly for testing, if modules are not found as a package
    from data_loader import fetch_stock_data


def get_next_business_day(date_str: str) -> str:
    """
    Calculates the next business day (Mon-Fri) after the given date.
    If the given date is a Fri, next business day is Mon.
    If Sat, next is Mon. If Sun, next is Mon.
    """
    dt_obj = datetime.strptime(date_str, "%Y-%m-%d")
    next_day = dt_obj + timedelta(days=1)
    while next_day.weekday() >= 5:  # 5 for Saturday, 6 for Sunday
        next_day += timedelta(days=1)
    return next_day.strftime("%Y-%m-%d")


def predict_stock():
    parser = argparse.ArgumentParser(description="Predict next day stock price using a trained LSTM model.")

    parser.add_argument("--ticker", type=str, required=True, help="Stock ticker symbol (e.g., AAPL).")
    parser.add_argument("--model_dir", type=str, default='trained_models', help="Directory where the model and scaler are saved.")
    parser.add_argument("--model_name", type=str, default='stock_predictor', help="Base name of the saved model and scaler files (ticker will be appended).")
    parser.add_argument("--feature_column", type=str, default='Close', help="Column name used for training/prediction.")
    parser.add_argument("--sequence_length", type=int, default=60, help="Look-back window size (must match training).")
    parser.add_argument("--prediction_end_date", type=str, default=datetime.now().strftime("%Y-%m-%d"), help="Last date for which data is available (YYYY-MM-DD, default: today).")

    args = parser.parse_args()

    print(f"Starting prediction for ticker: {args.ticker}")

    # --- 1. Construct Paths and Load Model/Scaler ---
    model_file_name = f"{args.model_name}_{args.ticker}.keras"
    scaler_file_name = f"scaler_{args.ticker}.joblib"
    model_file_path = os.path.join(args.model_dir, model_file_name)
    scaler_file_path = os.path.join(args.model_dir, scaler_file_name)

    if not os.path.exists(model_file_path):
        print(f"Error: Model file not found at {model_file_path}")
        return
    if not os.path.exists(scaler_file_path):
        print(f"Error: Scaler file not found at {scaler_file_path}")
        return

    print(f"Loading model from: {model_file_path}")
    try:
        model = tf.keras.models.load_model(model_file_path)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading Keras model: {e}")
        return

    print(f"Loading scaler from: {scaler_file_path}")
    try:
        scaler = joblib.load(scaler_file_path)
        print("Scaler loaded successfully.")
    except Exception as e:
        print(f"Error loading scaler: {e}")
        return

    # --- 2. Fetch Latest Data ---
    # Calculate start date for fetching enough data for the lookback sequence
    # Add a buffer (e.g., 30-60 calendar days) to account for non-trading days
    try:
        end_date_dt = datetime.strptime(args.prediction_end_date, "%Y-%m-%d")
    except ValueError:
        print(f"Error: Invalid prediction_end_date format: {args.prediction_end_date}. Please use YYYY-MM-DD.")
        return
        
    # Go back sequence_length days, plus a buffer (e.g. sequence_length + 30 trading days approx, so more calendar days)
    # A simple approach is to just go back more calendar days
    start_date_dt = end_date_dt - timedelta(days=args.sequence_length + 60) # Buffer of 60 calendar days
    start_date_str = start_date_dt.strftime("%Y-%m-%d")

    print(f"Fetching latest stock data for {args.ticker} from {start_date_str} to {args.prediction_end_date} for sequence preparation.")
    try:
        latest_df = fetch_stock_data(args.ticker, start_date_str, args.prediction_end_date)
        if latest_df.empty:
            print(f"No data fetched for {args.ticker} in the range {start_date_str} - {args.prediction_end_date}. Cannot make prediction.")
            return
        if len(latest_df) < args.sequence_length:
            print(f"Insufficient data: fetched {len(latest_df)} rows, but sequence length is {args.sequence_length}. Cannot make prediction.")
            return
        print(f"Successfully fetched {len(latest_df)} rows of recent data.")
    except Exception as e:
        print(f"Error during data fetching for prediction: {e}")
        return

    # --- 3. Prepare Input for Prediction ---
    print(f"Preparing input sequence using feature column '{args.feature_column}'.")
    if args.feature_column not in latest_df.columns:
        print(f"Error: Feature column '{args.feature_column}' not found in fetched data.")
        return
    
    feature_data = latest_df[args.feature_column]
    
    # Handle potential NaNs in the tail of the feature_data
    if feature_data.iloc[-args.sequence_length:].isnull().any():
        print("Warning: NaNs found in the last sequence_length data points. Attempting ffill.")
        feature_data_filled = feature_data.fillna(method='ffill')
        # Check if NaNs are still present at the very end (ffill might not fix if last values are NaN)
        if feature_data_filled.iloc[-args.sequence_length:].isnull().any():
             # if NaNs are still at the very end, try bfill
            feature_data_filled = feature_data_filled.fillna(method='bfill')
            if feature_data_filled.iloc[-args.sequence_length:].isnull().any():
                print("Error: NaNs persist in the last sequence_length data points even after ffill and bfill. Cannot make prediction.")
                return
        feature_data = feature_data_filled


    last_sequence_raw = feature_data.iloc[-args.sequence_length:].values

    if np.isnan(last_sequence_raw).any(): # Should be caught by above, but as a safeguard
        print("Error: NaNs detected in the final input sequence. Cannot proceed.")
        return

    try:
        # Reshape for scaler
        scaled_last_sequence = scaler.transform(last_sequence_raw.reshape(-1, 1))
    except Exception as e:
        print(f"Error scaling the input sequence: {e}")
        print("Ensure the scaler was fitted on data with a similar distribution and no NaNs.")
        return

    # Reshape for model input (1 sample, sequence_length time steps, 1 feature)
    input_for_model = scaled_last_sequence.reshape((1, args.sequence_length, 1))
    print(f"Input sequence prepared with shape: {input_for_model.shape}")

    # --- 4. Make Prediction ---
    print("Making prediction...")
    try:
        predicted_scaled_price = model.predict(input_for_model)
        predicted_price = scaler.inverse_transform(predicted_scaled_price)
    except Exception as e:
        print(f"Error during model prediction or inverse transform: {e}")
        return
    
    # --- 5. Display Prediction ---
    prediction_for_date = get_next_business_day(args.prediction_end_date)
    final_predicted_price = predicted_price[0][0]

    print("\n--- Prediction Result ---")
    print(f"Stock Ticker:          {args.ticker}")
    print(f"Prediction for Date:   {prediction_for_date}")
    print(f"Predicted {args.feature_column} Price: {final_predicted_price:.2f}")
    print("-------------------------\n")
    print("Note: This is a forecast based on historical data and an LSTM model. It is not financial advice.")

if __name__ == '__main__':
    os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2') # Suppress verbose TensorFlow logging
    predict_stock()
