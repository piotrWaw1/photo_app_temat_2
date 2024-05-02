from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    Photo,
)

class PhotoSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.username')
    owner_id = serializers.ReadOnlyField(source='owner.id')

    class Meta:
        model = Photo
        fields = ['id', 'owner', 'owner_id', 'image', 'title', 'uploaded_on']