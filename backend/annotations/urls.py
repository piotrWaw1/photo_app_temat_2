from django.urls import path

from .views import *

urlpatterns = [
    path('photos', PhotoCreateAPIView.as_view(), name='photo_create'),
    path('photos/<int:pk>', PhotoCreateAPIView.as_view(), name='photo_delete'),
]



