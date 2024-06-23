from rest_framework import serializers, exceptions
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from .models import Photo, Annotation, Group

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class GroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    owner = serializers.StringRelatedField()

    class Meta:
        model = Group
        fields = ["id", "name", "owner", "members"]


class GroupUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, required=False)

    class Meta:
        model = Group
        fields = ["name"]


class AnnotationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Annotation
        fields = ["id", "photo", "user", "text", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def create(self, validated_data):
        text = validated_data.get("text")
        photo = validated_data.get("photo")
        existing_annotation = Annotation.objects.filter(text=text, photo=photo).first()
        if existing_annotation:

            raise serializers.ValidationError(
                f"An annotation '{text}' already exists for this photo."
            )
        return Annotation.objects.create(**validated_data)


class PhotoSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source="owner.username")
    owner_id = serializers.ReadOnlyField(source="owner.id")
    annotations = AnnotationSerializer(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = [
            "id",
            "owner",
            "owner_id",
            "image",
            "title",
            "uploaded_on",
            "annotations",
        ]
