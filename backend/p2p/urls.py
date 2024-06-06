from django.urls import path
from . import views

urlpatterns = [
    path('', views.conversations, name='conversations'),
    path('conversation/<int:conversation_id>/', views.conversation_detail, name='conversation_detail'),
    path('conversation/<int:conversation_id>/send_message/', views.send_message, name='send_message'),
]
