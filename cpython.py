# adder.py

import os
import sqlite3

def add(x, y):
  """Adds two numbers together."""
  return x + y

if __name__ == "__main__":
  # Connect to the database (or create it if it doesn't exist)
  conn = sqlite3.connect('my_database.db')
  cursor = conn.cursor()

  # Create a table to store the results (if it doesn't exist)
  cursor.execute('''
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        num1 REAL,
        num2 REAL,
        sum REAL
    )
  ''')

  # Get input from the environment variables
  num1 = float(os.environ.get("NUM1", 0))
  num2 = float(os.environ.get("NUM2", 0))

  # Calculate the sum
  sum = add(num1, num2)

  # Insert the result into the database
  cursor.execute("INSERT INTO results (num1, num2, sum) VALUES (?, ?, ?)", (num1, num2, sum))
  conn.commit()

  # Print the result
  print(f"The sum of {num1} and {num2} is {sum}")

  # Close the database connection
  conn.close()
