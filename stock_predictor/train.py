import argparse
import os
import joblib
import pandas as pd
import numpy as np
import tensorflow as tf

# Assuming these modules are in the same directory or PYTHONPATH is set up correctly
from .data_loader import fetch_stock_data
from .preprocessor import preprocess_data
from .model import create_lstm_model

def main():
    parser = argparse.ArgumentParser(description="Train an LSTM model for stock price prediction.")
    
    # Required arguments
    parser.add_argument("--ticker", type=str, required=True, help="Stock ticker symbol (e.g., AAPL).")
    parser.add_argument("--start_date", type=str, required=True, help="Start date for data fetching (YYYY-MM-DD).")
    parser.add_argument("--end_date", type=str, required=True, help="End date for data fetching (YYYY-MM-DD).")

    # Optional arguments with defaults
    parser.add_argument("--feature_column", type=str, default='Close', help="Column name to use for prediction.")
    parser.add_argument("--sequence_length", type=int, default=60, help="Look-back window size for sequences.")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs.")
    parser.add_argument("--batch_size", type=int, default=32, help="Training batch size.")
    parser.add_argument("--model_dir", type=str, default='trained_models', help="Directory to save the trained model and scaler.")
    parser.add_argument("--model_name", type=str, default='stock_predictor', help="Base name for saved model and scaler files (ticker will be appended).")
    
    args = parser.parse_args()

    print(f"Starting training process for ticker: {args.ticker}")

    # --- 1. Create Save Directory ---
    try:
        os.makedirs(args.model_dir, exist_ok=True)
        print(f"Ensured directory '{args.model_dir}' exists.")
    except OSError as e:
        print(f"Error creating directory {args.model_dir}: {e}")
        return # Exit if directory creation fails

    model_file_name = f"{args.model_name}_{args.ticker}.keras"
    scaler_file_name = f"scaler_{args.ticker}.joblib"
    model_file_path = os.path.join(args.model_dir, model_file_name)
    scaler_file_path = os.path.join(args.model_dir, scaler_file_name)

    # --- 2. Fetch Data ---
    print(f"Fetching stock data for {args.ticker} from {args.start_date} to {args.end_date}...")
    try:
        stock_df = fetch_stock_data(args.ticker, args.start_date, args.end_date)
        if stock_df.empty:
            print(f"No data fetched for {args.ticker}. Exiting.")
            return
        print(f"Successfully fetched {len(stock_df)} rows of data.")
    except Exception as e:
        print(f"Error during data fetching: {e}")
        return

    # --- 3. Preprocess Data ---
    print(f"Preprocessing data using feature column '{args.feature_column}' and sequence length {args.sequence_length}...")
    try:
        X_scaled_sequences, y_scaled, scaler = preprocess_data(
            stock_df, 
            feature_column=args.feature_column, 
            sequence_length=args.sequence_length
        )
        if X_scaled_sequences.size == 0 or y_scaled.size == 0:
             print("Preprocessing resulted in empty arrays. This might be due to insufficient data for the sequence length. Exiting.")
             return
        print(f"Data preprocessed successfully. X_train shape: {X_scaled_sequences.shape}, y_train shape: {y_scaled.shape}")
    except ValueError as ve:
        print(f"ValueError during preprocessing: {ve}. Exiting.")
        return
    except Exception as e:
        print(f"An unexpected error occurred during preprocessing: {e}. Exiting.")
        return

    input_shape = (X_scaled_sequences.shape[1], X_scaled_sequences.shape[2]) # (sequence_length, num_features)
    print(f"Model input shape will be: {input_shape}")

    # --- 4. Create Model ---
    print("Creating LSTM model...")
    # Using default LSTM units, dense units, output units, and dropout rate from create_lstm_model
    lstm_model = create_lstm_model(input_shape=input_shape)
    lstm_model.summary()

    # --- 5. Train Model ---
    print(f"Training model for {args.epochs} epochs with batch size {args.batch_size}...")
    # Optional: Add EarlyStopping callback
    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss', 
        patience=10, # Number of epochs with no improvement after which training will be stopped.
        restore_best_weights=True
    )
    
    try:
        history = lstm_model.fit(
            X_scaled_sequences, 
            y_scaled, 
            epochs=args.epochs, 
            batch_size=args.batch_size, 
            validation_split=0.1, # Using 10% of data for validation
            callbacks=[early_stopping], # Add callback here
            verbose=1
        )
        print("Model training completed.")
    except Exception as e:
        print(f"Error during model training: {e}")
        return

    # --- 6. Save Model and Scaler ---
    print(f"Saving trained model to: {model_file_path}")
    try:
        lstm_model.save(model_file_path)
        print(f"Model saved successfully.")
    except Exception as e:
        print(f"Error saving Keras model: {e}")
        return

    print(f"Saving scaler to: {scaler_file_path}")
    try:
        joblib.dump(scaler, scaler_file_path)
        print(f"Scaler saved successfully.")
    except Exception as e:
        print(f"Error saving scaler with joblib: {e}")
        return
    
    print("\nTraining script finished successfully!")

if __name__ == '__main__':
    # Ensure TF logs are not too verbose by default, can be overridden by TF_CPP_MIN_LOG_LEVEL
    os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2') 
    main()
