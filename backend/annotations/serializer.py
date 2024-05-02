from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    Photo,
)

class PhotoSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.username')
    owner_id = serializers.ReadOnlyField(source='owner.id')
    image_url = serializers.ImageField(required=False)

    class Meta:
        model = Photo
        fields = ['id', 'owner', 'owner_id', 'image', 'title', 'image_url', 'uploaded_on']