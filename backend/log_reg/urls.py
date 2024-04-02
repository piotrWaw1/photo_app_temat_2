from django.urls import path

from .views import HelloWorldView

urlpatterns = [
    path('test/', HelloWorldView.as_view(), name='hello_world')
]
