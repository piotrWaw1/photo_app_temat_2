from django.urls import path
from . import views

urlpatterns = [
    path('conversation/<int:conversation_id>/messages/', views.get_messages, name='get_messages'),
    path('conversation/<int:conversation_id>/send_message/', views.send_message, name='send_message'),
]
