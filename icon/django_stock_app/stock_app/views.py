from django.shortcuts import render
from django.http import JsonResponse
import requests
from datetime import datetime
from django.conf import settings

def is_market_open():
    now = datetime.now()
    start_time = datetime.strptime(settings.MARKET_HOURS_START, '%H:%M').time()
    end_time = datetime.strptime(settings.MARKET_HOURS_END, '%H:%M').time()
    return start_time <= now.time() <= end_time

def index(request):
    return render(request, 'stock_app/index.html')

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
