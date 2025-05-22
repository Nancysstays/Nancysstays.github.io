# adder.py
import os

def add(x = 5, y = 2):
  """
  This function adds two numbers together.

  Args:
    x: The first number.
    y: The second number.

  Returns:
    The sum of x and y.
  """
  return x + y

if __name__ == "__main__":
  # Get input from the environment variables
  num1 = float(os.environ.get("NUM1", 0))
  num2 = float(os.environ.get("NUM2", 0))

  # Calculate the sum
  sum = add(num1, num2)

  # Print the result
  print(f"The sum of {num1} and {num2} is {sum}")
