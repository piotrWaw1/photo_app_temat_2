from django.urls import path

from .views import your_new_endpoint

urlpatterns = [
    path('your-new-endpoint-url', your_new_endpoint, name='your_new_endpoint'),
]

