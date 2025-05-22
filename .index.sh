#!/bin/bash

# Function to prompt for user input with a default value
prompt() {
    local prompt_text=$1
    local default_value=$2
    read -p "$prompt_text [$default_value]: " input
    echo "${input:-$default_value}"
}

# Prompt for project and app names
PROJECT_NAME=$(prompt "Enter the Django project name" "django_stock_app")
APP_NAME=$(prompt "Enter the Django app name" "stock_app")

# Create project directory
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Django, requests, and Cython
pip install django requests cython

# Create Django project
django-admin startproject $PROJECT_NAME .

# Create Django app
django-admin startapp $APP_NAME

# Create directories for templates and static files
mkdir -p $APP_NAME/templates/$APP_NAME
mkdir -p $APP_NAME/static/css
mkdir -p $APP_NAME/static/js

# Create appsettings.json
cat <<EOL > appsettings.json
{
  "AlphaVantage": {
    "ApiKey": "XVYHOWRTRNPN3FJA",
    "BaseUrl": "https://www.alphavantage.co/query"
  },
  "MarketHours": {
    "Start": "06:30",
    "End": "13:00"
  }
}
EOL

# Update settings.py to include the app and load config
cat <<EOL >> $PROJECT_NAME/settings.py

import os
import json

# Load configuration from appsettings.json
with open(os.path.join(BASE_DIR, 'appsettings.json')) as config_file:
    config = json.load(config_file)

ALPHA_VANTAGE_API_KEY = config['AlphaVantage']['ApiKey']
ALPHA_VANTAGE_BASE_URL = config['AlphaVantage']['BaseUrl']
MARKET_HOURS_START = config['MarketHours']['Start']
MARKET_HOURS_END = config['MarketHours']['End']

INSTALLED_APPS += [
    '$APP_NAME',
]
EOL

# Create views.py
cat <<EOL > $APP_NAME/views.py
from django.shortcuts import render
from django.http import JsonResponse
import requests
from datetime import datetime
from django.conf import settings
from .cython_utils import is_market_open

def index(request):
    return render(request, '$APP_NAME/index.html')

def fetch_data(request):
    if request.method == 'POST':
        ticker = request.POST.get('ticker')
        interval = request.POST.get('interval')
        compare_ticker = request.POST.get('compare_ticker')
        
        if is_market_open():
            url = f"{settings.ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_INTRADAY&symbol={ticker}&interval={interval}&apikey={settings.ALPHA_VANTAGE_API_KEY}"
            response = requests.get(url)
            data = response.json()
            # Perform calculations (MACD, covariance, CCI, RSI, VWMA, EMA, VWAP)
            # ...
            return JsonResponse(data)
        else:
            # Use local storage data
            # ...
            return JsonResponse({"message": "Market is closed. Using local storage data."})
    return JsonResponse({"error": "Invalid request method."})
EOL

# Create urls.py
cat <<EOL > $PROJECT_NAME/urls.py
from django.contrib import admin
from django.urls import path
from $APP_NAME import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('fetch_data/', views.fetch_data, name='fetch_data'),
]
EOL

# Create index.html
cat <<EOL > $APP_NAME/templates/$APP_NAME/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Data Fetcher</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
  <div class="container">
    <h1>Stock Data Fetcher</h1>
    <form id="stockForm">
      <div class="form-group">
        <label for="ticker">Ticker:</label>
        <input type="text" class="form-control" id="ticker" name="ticker" required>
      </div>
      <div class="form-group">
        <label for="interval">Interval:</label>
        <select class="form-control" id="interval" name="interval" required>
          <option value="1min">1 Minute</option>
          <option value="5min">5 Minutes</option>
          <option value="15min">15 Minutes</option>
          <option value="30min">30 Minutes</option>
          <option value="60min">60 Minutes</option>
        </select>
      </div>
      <div class="form-group">
        <label for="compare_ticker">Compare Ticker:</label>
        <input type="text" class="form-control" id="compare_ticker" name="compare_ticker">
      </div>
      <button type="submit" class="btn btn-primary">Fetch Data</button>
    </form>
    <div id="output"></div>
  </div>
  <script>
    document.getElementById('stockForm').addEventListener('submit', function(event) {
      event.preventDefault();
      fetch('/fetch_data/', {
        method: 'POST',
        body: new FormData(this)
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('output').innerHTML = JSON.stringify(data, null, 2);
      });
    });
  </script>
</body>
</html>
EOL

# Create cython_utils.pyx
cat <<EOL > $APP_NAME/cython_utils.pyx
from datetime import datetime

def is_market_open():
    cdef datetime now = datetime.now()
    cdef datetime start_time = datetime.strptime("06:30", "%H:%M").time()
    cdef datetime end_time = datetime.strptime("13:00", "%H:%M").time()
    return start_time <= now.time() <= end_time
EOL

# Create setup.py
cat <<EOL > setup.py
from setuptools import setup
from Cython.Build import cythonize

setup(
    ext_modules = cythonize("$APP_NAME/cython_utils.pyx")
)
EOL

# Build the Cython module
python setup.py build_ext --inplace

# Create requirements.txt
cat <<EOL > requirements.txt
Django
requests
Cython
EOL

# Apply migrations and run the server
python manage.py migrate
python manage.py runserver