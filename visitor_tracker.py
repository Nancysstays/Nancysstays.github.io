# visitor_tracker.py

import os
import sqlite3
from datetime import datetime

def track_visitor():
  """Tracks visitor information (timestamp and IP address) and generates an HTML page with visit history."""

  conn = sqlite3.connect('visitors.db')
  cursor = conn.cursor()

  # Create a table to store visitor information (if it doesn't exist)
  cursor.execute('''
    CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        ip_address TEXT
    )
  ''')

  # Get the current timestamp and IP address (replace with actual IP retrieval method)
  current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  ip_address = os.environ.get("REMOTE_ADDR", "unknown")  # Replace with your IP retrieval method

  # Insert the visitor information into the database
  cursor.execute("INSERT INTO visits (timestamp, ip_address) VALUES (?, ?)", (current_time, ip_address))
  conn.commit()

  # Fetch visitor history from the database
  cursor.execute("SELECT * FROM visits ORDER BY timestamp DESC")
  visit_history = cursor.fetchall()

  # Close the database connection
  conn.close()

  # Generate the HTML content with visit history
  html_content = f"""
  <!DOCTYPE html>
  <html>
  <head>
    <title>Visitor Tracker</title>
  </head>
  <body>
    <h1>Visitor Tracker</h1>
    <p>A visitor from {ip_address} visited this site at {current_time}.</p>

    <h2>Visit History</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>IP Address</th>
        </tr>
      </thead>
      <tbody>
        {''.join([f'<tr><td>{visit[1]}</td><td>{visit[2]}</td></tr>' for visit in visit_history])}
      </tbody>
    </table>
  </body>
  </html>
  """

  # Write the HTML content to a file
  with open('index.html', 'w') as f:
    f.write(html_content)

if __name__ == "__main__":
  track_visitor()
