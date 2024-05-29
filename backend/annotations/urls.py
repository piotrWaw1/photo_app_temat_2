from django.urls import path

from .views import *

urlpatterns = [
    path('photos', PhotoCreateAPIView.as_view(), name='photo_create'),
    path('photos/<int:pk>', PhotoCreateAPIView.as_view(), name='photo_delete'),
    path('photos_edit/<int:pk>', PhotoAnnotateAPIView.as_view(), name='photo_patch'),
    path('photo/<int:id>', PhotoGetAPIView.as_view(), name='get_single_photo'),
    path('photo/<int:id>/annotate', AnnotationAPIView.as_view(), name='add_annotation'),

]



