from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    Photo,
    
)

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'owner', 'groups', 'image', 'created_at']