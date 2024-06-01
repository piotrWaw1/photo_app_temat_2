from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    Photo,
    Annotation,
    Group
)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'owner', 'members']

class AnnotationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Annotation
        fields = ['id', 'photo', 'user', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        text = validated_data.get('text')
        photo = validated_data.get('photo')
        existing_annotation = Annotation.objects.filter(text=text, photo=photo).first()
        if existing_annotation:
           
            raise serializers.ValidationError(f"An annotation '{text}' already exists for this photo.")
        return Annotation.objects.create(**validated_data)
    
class PhotoSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.username')
    owner_id = serializers.ReadOnlyField(source='owner.id')
    image_url = serializers.ImageField(required=False)
    annotations = AnnotationSerializer(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = ['id', 'owner', 'owner_id', 'image', 'title', 'image_url', 'uploaded_on', 'annotations']
