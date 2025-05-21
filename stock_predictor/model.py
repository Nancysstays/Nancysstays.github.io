import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def create_lstm_model(input_shape: tuple, lstm_units_list: list = [50, 50], dense_units: int = 25, output_units: int = 1, dropout_rate: float = 0.2):
    """
    Creates, compiles, and returns a Keras LSTM model for time series prediction.

    Args:
        input_shape: Tuple specifying the shape of the input data (sequence_length, num_features).
        lstm_units_list: A list of integers, where each integer is the number of units for an LSTM layer.
        dense_units: Number of units in the Dense layer.
        output_units: Number of units in the output layer (typically 1 for univariate regression).
        dropout_rate: Dropout rate for Dropout layers.

    Returns:
        A compiled Keras Sequential model.
    """
    model = Sequential()

    # Add LSTM layers
    for i, units in enumerate(lstm_units_list):
        return_sequences = True if i < len(lstm_units_list) - 1 else False
        if i == 0:
            model.add(LSTM(units=units, return_sequences=return_sequences, input_shape=input_shape))
        else:
            model.add(LSTM(units=units, return_sequences=return_sequences))
        model.add(Dropout(dropout_rate))

    # Add Dense layer
    model.add(Dense(units=dense_units, activation='relu'))
    model.add(Dropout(dropout_rate)) # Optional dropout after dense layer

    # Add Output layer
    model.add(Dense(units=output_units, activation='linear')) # Linear for regression

    # Compile the model
    model.compile(optimizer='adam', loss='mean_squared_error')

    return model

if __name__ == '__main__':
    # Example Usage:
    sample_input_shape = (60, 1)  # E.g., 60 time steps, 1 feature
    print(f"Creating LSTM model with input shape: {sample_input_shape}")

    # Default model
    model1 = create_lstm_model(input_shape=sample_input_shape)
    print("\nModel 1 Summary (default parameters):")
    model1.summary()

    # Model with different LSTM layers and dropout
    custom_lstm_units = [100, 75, 50]
    custom_dense_units = 30
    custom_dropout = 0.3
    print(f"\nCreating LSTM model with custom parameters: LSTM units={custom_lstm_units}, Dense units={custom_dense_units}, Dropout={custom_dropout}")
    model2 = create_lstm_model(
        input_shape=sample_input_shape,
        lstm_units_list=custom_lstm_units,
        dense_units=custom_dense_units,
        dropout_rate=custom_dropout
    )
    print("\nModel 2 Summary (custom parameters):")
    model2.summary()
    
    # Model with a single LSTM layer
    print(f"\nCreating LSTM model with a single LSTM layer:")
    model3 = create_lstm_model(input_shape=sample_input_shape, lstm_units_list=[80])
    print("\nModel 3 Summary (single LSTM layer):")
    model3.summary()
