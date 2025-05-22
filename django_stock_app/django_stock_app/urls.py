from django.contrib import admin
from django.urls import path
from stock_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('fetch_data/', views.fetch_data, name='fetch_data'),
]
