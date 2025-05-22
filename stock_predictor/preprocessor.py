import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def preprocess_data(df: pd.DataFrame, feature_column: str = 'Close', sequence_length: int = 60):
    """
    Preprocesses stock data for time series forecasting.

    Args:
        df: Pandas DataFrame containing the stock data.
        feature_column: The name of the column to use for feature extraction (e.g., 'Close').
        sequence_length: The number of past data points to use for predicting the next one.

    Returns:
        A tuple containing:
            - X_scaled_sequences: NumPy array of scaled input sequences.
            - y_scaled: NumPy array of scaled target values.
            - scaler: The fitted MinMaxScaler object.

    Raises:
        ValueError: If the feature_column is not in the DataFrame or if data still has NaNs after fill.
    """
    if feature_column not in df.columns:
        raise ValueError(f"Feature column '{feature_column}' not found in DataFrame.")

    # 1. Select the feature_column
    data = df[feature_column]

    # 2. Handle missing values
    data_filled = data.fillna(method='ffill')
    data_filled = data_filled.fillna(method='bfill')

    if data_filled.isnull().any():
        raise ValueError("Data contains NaNs even after forward and backward fill. Cannot proceed.")

    # 3. Convert the cleaned column data to a NumPy array
    data_cleaned_np = data_filled.values.reshape(-1, 1) # Reshape for scaler

    # 4. Initialize a MinMaxScaler and scale the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data_cleaned_np)

    # 5. Create sequences
    X_sequences = []
    y_target = []

    if len(scaled_data) <= sequence_length:
        raise ValueError(
            f"Data length ({len(scaled_data)}) is less than or equal to sequence_length ({sequence_length}). "
            "Not enough data to create sequences."
        )

    for i in range(len(scaled_data) - sequence_length):
        X_sequences.append(scaled_data[i:i + sequence_length])
        y_target.append(scaled_data[i + sequence_length])

    # 6. Convert X and y to NumPy arrays
    X_scaled_sequences = np.array(X_sequences)
    y_scaled = np.array(y_target)

    # 7. Return items
    return X_scaled_sequences, y_scaled, scaler

if __name__ == '__main__':
    # Example Usage:
    # Create a sample DataFrame for demonstration
    sample_dates = pd.date_range(start='2023-01-01', periods=200, freq='B') # Business days
    sample_data_values = np.linspace(100, 150, 200) # Linearly increasing data
    
    # Introduce some NaNs for testing fill logic
    sample_data_values[5] = np.nan
    sample_data_values[6] = np.nan
    sample_data_values[100:103] = np.nan # A block of NaNs
    sample_data_values[0] = np.nan # NaN at the beginning

    sample_df = pd.DataFrame(data={'Date': sample_dates, 'Close': sample_data_values})
    sample_df.set_index('Date', inplace=True)

    print("Sample DataFrame with NaNs:")
    print(sample_df.head(10))
    print(f"Total NaNs in 'Close' column: {sample_df['Close'].isnull().sum()}")

    try:
        seq_len = 60
        X, y, fitted_scaler = preprocess_data(sample_df.copy(), feature_column='Close', sequence_length=seq_len)
        
        print(f"\nPreprocessing successful for 'Close' column with sequence length {seq_len}.")
        print(f"Shape of X_scaled_sequences: {X.shape}") # Expected: (200-60, 60, 1)
        print(f"Shape of y_scaled: {y.shape}")           # Expected: (200-60, 1)
        print(f"Scaler min: {fitted_scaler.min_}, Scaler scale: {fitted_scaler.scale_}")

        # Test inverse transform (optional)
        # To get original scale for y_scaled (first element)
        # original_y_example = fitted_scaler.inverse_transform(y_scaled[0].reshape(-1,1))
        # print(f"Example y_scaled[0]: {y_scaled[0]}, Original scale: {original_y_example[0][0]}")

        # Test with a column that doesn't exist
        # preprocess_data(sample_df.copy(), feature_column='NonExistent')

        # Test with too many NaNs (by creating a new df with only NaNs)
        # nan_df = pd.DataFrame(data={'Close': [np.nan] * 100})
        # preprocess_data(nan_df, feature_column='Close')

        # Test with insufficient data for sequences
        short_df = sample_df.iloc[:50]
        # preprocess_data(short_df.copy(), feature_column='Close', sequence_length=seq_len)


    except ValueError as ve:
        print(f"\nValueError during preprocessing: {ve}")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")

    # Example with another feature
    sample_df['Volume'] = np.random.randint(1000, 5000, size=len(sample_df))
    sample_df['Volume'].iloc[10:12] = np.nan # Add some NaNs to Volume
    print("\nSample DataFrame with 'Volume' column (and some NaNs):")
    print(sample_df[['Close', 'Volume']].head(15))
    print(f"Total NaNs in 'Volume' column: {sample_df['Volume'].isnull().sum()}")

    try:
        seq_len_vol = 30
        X_vol, y_vol, scaler_vol = preprocess_data(sample_df.copy(), feature_column='Volume', sequence_length=seq_len_vol)
        print(f"\nPreprocessing successful for 'Volume' column with sequence length {seq_len_vol}.")
        print(f"Shape of X_vol (Volume): {X_vol.shape}")
        print(f"Shape of y_vol (Volume): {y_vol.shape}")
        print(f"Scaler for Volume min: {scaler_vol.min_}, Scaler scale: {scaler_vol.scale_}")

    except ValueError as ve:
        print(f"\nValueError during preprocessing for 'Volume': {ve}")
    except Exception as e:
        print(f"\nAn unexpected error occurred with 'Volume': {e}")
