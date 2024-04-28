from django.urls import path

from .views import *

urlpatterns = [
    path('annotation', AnnotationView.as_view(), name='annotation'),

]

