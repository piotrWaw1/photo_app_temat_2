from django.core.exceptions import MultipleObjectsReturned
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Photo, Annotation, Group, get_user_model
from .serializer import (
    PhotoSerializer,
    AnnotationSerializer,
    GroupSerializer,
    GroupUpdateSerializer,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
import os
from ultralytics import YOLO
from django.db.models import Q


class PhotoCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhotoSerializer

    def is_valid_image_extension(self, file_name):
        valid_extensions = [".jpg", ".jpeg", ".png", ".jfif", ".gif", ".bmp"]
        file_extension = os.path.splitext(file_name)[1].lower()
        return file_extension in valid_extensions

    def is_valid_image_size(self, file):
        # Check if the file size is less than or equal to 50000KB
        if file.size > 50000 * 1024:  # 50000KB
            return False
        return True

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        image = request.FILES.get("image")
        title = request.FILES.get("title")
        if image:
            # extension check
            if not self.is_valid_image_extension(image.name):
                return Response(
                    {"error": "Invalid image file format"},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )

            if not self.is_valid_image_size(image):
                return Response(
                    {"error": "Image file size exceeds 50000KB"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        # print(request.data["title"])
        if serializer.is_valid():
            serializer.save(
                owner=request.user,
                owner_id=request.user.id,
                title=request.data["title"],
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUES)

    def get(self, request, *args, **kwargs):
        user = request.user

        # Get photos where the user is the owner or is a member of a group that the photo belongs to
        photos = Photo.objects.filter(
            Q(owner=user) | Q(groups__members=user)
        ).distinct()

        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        photo_id = kwargs.get("pk")
        try:
            photo = Photo.objects.get(pk=photo_id)
        except Photo.DoesNotExist:
            return Response(
                {"error": "Photo not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if photo.owner != request.user:
            raise PermissionDenied("You do not have permission to delete this photo.")
        image_path = photo.image.path

        if os.path.exists(image_path):
            os.remove(image_path)
            photo.delete()
            return Response(
                {"message": "Photo and image deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {"error": "Image file not found"}, status=status.HTTP_404_NOT_FOUND
            )


class PhotoGetAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhotoSerializer

    def get(self, request, *args, **kwargs):
        photo_id = kwargs.get("id")
        user = request.user
        photo = get_object_or_404(
            Photo.objects.filter(
                Q(owner=user) | Q(groups__members=user), id=photo_id
            ).distinct()
        )
        serializer = PhotoSerializer(photo)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PhotoAnnotateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhotoSerializer

    def get(self, request, *args, **kwargs):
        photos = Photo.objects.filter(owner=request.user)
        serializer = PhotoSerializer(photos, many=True)

        # load model
        """Model list
        yolov8n [n s m k x]
        yolov8n-seg [n s m k x]
        yolov8n-cls [n s m k x]
        """

        model = YOLO("backend/media/models/yolov8n.pt")

        # getting photo
        photo_id = kwargs.get("pk")
        photo = Photo.objects.get(pk=photo_id)
        image_url = photo.image.url
        img_path = "http://localhost:8000" + image_url

        # annotate
        results = model(img_path)

        # detected_objects = [] for lists
        detected_objects = set()

        # return from model list
        for result in results:
            # making bounding boxes and saving to result.jpg
            # boxes = result.boxes  # Boxes object for bounding box outputs
            # masks = result.masks  # Masks object for segmentation masks outputs
            # keypoints = result.keypoints  # Keypoints object for pose outputs
            # probs = result.probs  # Probs object for classification outputs
            # obb = result.obb  # Oriented boxes object for OBB outputs
            # result.show()  # display to screen
            # result.save(filename='result.jpg')  # save to disk
            if result.boxes:
                for box in result.boxes:
                    class_id = int(box.cls)
                    object_name = model.names[class_id]

                    # detected_objects.append(object_name) for lists
                    detected_objects.add(object_name)

        # removing img from main folder
        os.remove(str(photo.image)[7:])

        return Response(detected_objects, status=status.HTTP_200_OK)


class AnnotationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AnnotationSerializer

    def post(self, request, *args, **kwargs):
        photo_id = kwargs.get("id")
        photo = get_object_or_404(Photo, id=photo_id)
        user = request.user

        if photo.groups.exists():  # If the photo is associated with any groups
            if not (photo.owner == user or photo.groups.filter(members=user).exists()):
                raise PermissionDenied(
                    "You do not have permission to annotate this photo"
                )
        else:  # If the photo is not associated with any groups
            if photo.owner != user:
                raise PermissionDenied(
                    "You do not have permission to annotate this photo"
                )

        annotations = request.data.get("anData", [])
        if not isinstance(annotations, list):
            return Response(
                {"error": "Annotations should be a list"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created_annotations = []
        for annotation_text in annotations:
            serializer = self.serializer_class(
                data={"text": annotation_text, "photo": photo.id}
            )
            if serializer.is_valid():
                annotation = serializer.save(user=request.user)
                created_annotations.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(created_annotations, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        photo_id = kwargs.get("photo_id")
        annotation_id = kwargs.get("annotation_id")

        annotation = get_object_or_404(Annotation, id=annotation_id, photo__id=photo_id)
        photo = annotation.photo
        user = request.user

        # Check if the current user is the owner of the photo
        if user == photo.owner:
            annotation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Check if the current user is the owner of the photo or a current member of a group where the photo is shared
        if photo.groups.exists():  # If the photo is associated with any groups
            has_access = photo.owner == user or photo.groups.filter(members=user).exists()
        else:  # If the photo is not associated with any groups
            has_access = photo.owner == user

        # Only allow deletion if the user has access to the photo and is the owner of the annotation
        if has_access and user == annotation.user:
            annotation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


# class AnnotationAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = AnnotationSerializer

#     def post(self, request, *args, **kwargs):
#         photo_id = kwargs.get("id")
#         photo = get_object_or_404(Photo, id=photo_id, owner=request.user)
#         annotations = request.data.get('anData', [])
#         print(annotations)
#         print(photo)

#         if not isinstance(annotations, list):
#             return Response({"error": "Annotations should be a list"}, status=status.HTTP_400_BAD_REQUEST)

#         created_annotations = []
#         for annotation_text in annotations:
#             serializer = self.serializer_class(data={'text': annotation_text, 'photo': photo.id})  # Pass the photo object here
#             if serializer.is_valid():
#                 annotation = serializer.save(user=request.user)  # No need to pass photo again as it's already set in the serializer
#                 created_annotations.append(serializer.data)
#             else:
#                 return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         return Response(created_annotations, status=status.HTTP_201_CREATED)

#     def delete(self, request, *args, **kwargs):
#         photo_id = kwargs.get("photo_id")
#         annotation_id = kwargs.get("annotation_id")

#         photo = get_object_or_404(Photo, id=photo_id, owner=request.user)
#         annotation = get_object_or_404(Annotation, id=annotation_id, photo=photo)

#         annotation.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class GroupCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def post(self, request, *args, **kwargs):
        owner = request.user
        name = request.data.get("name")

        # Check if a group with the same name and owner already exists
        if Group.objects.filter(owner=owner, name=name).exists():
            return Response(
                {"message": "A group with this name already exists for the current user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        members = [owner.username]
        serializer = self.serializer_class(
            data={
                "owner": owner.username,
                "members": members,
                "name": name,
            }
        )
        if serializer.is_valid():
            group = serializer.save(owner=owner)
            group.members.add(owner)  # Add the owner as a member
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def delete(self, request, *args, **kwargs):
        group_id = kwargs.get("group_id")
        group = get_object_or_404(Group, id=group_id, owner=request.user)

        if request.user != group.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
            )
        group.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def get(self, request, *args, **kwargs):
        user = request.user

        groups = Group.objects.filter(Q(owner=user) | Q(members=user)).distinct()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupDetailByIdAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        group_id = kwargs.get('group_id')

        if not group_id:
            return Response({"error": "Group ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group = Group.objects.filter(
                Q(id=group_id) & (Q(owner=user) | Q(members=user))
            )
        except Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = GroupSerializer(group.first())
        return Response(serializer.data, status=status.HTTP_200_OK)


# class GroupListByNameAPIView(APIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = GroupSerializer

#     def get(self, request, *args, **kwargs):
#         user = request.user
#         group_name = kwargs.get('group_name')
#         owner_username = kwargs.get('owner_username')

#         if not group_name or not owner_username:
#             return Response({"error": "Group name and owner username are required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             group = Group.objects.get(
#                 Q(owner__username=owner_username) & Q(name=group_name) & (Q(owner=user) | Q(members=user))
#             )
#         except Group.DoesNotExist:
#             return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

#         serializer = GroupSerializer(group)
#         return Response(serializer.data, status=status.HTTP_200_OK)

class GroupAddMemberAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        group_id = kwargs.get("group_id")
        username = request.data.get("username")

        group = get_object_or_404(Group, id=group_id, owner=request.user)

        if request.user != group.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            user = get_user_model().objects.get(username=username)
            if group.members.filter(id=user.id).exists():
                return Response(
                    {
                        "error": f"User with username '{username}' is already a member of this group."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except get_user_model().DoesNotExist:
            return Response(
                {"error": 'User with username "{}" does not exist'.format(username)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group.members.add(user)
        return Response(
            {"message": "User added to group successfully"}, status=status.HTTP_200_OK
        )


class GroupDeleteMemberAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):

        group_id = kwargs.get("group_id")
        print(kwargs.get("group_id"))
        username = request.data.get("username")
        print(request.data.get("username"))
        # group = get_object_or_404(Group, id=group_id, owner=request.user)
        group = get_object_or_404(Group, id=group_id)

        if group.members.filter(
                id=request.user.id).exists() and username == request.user.username and group.owner != username:
            user = get_user_model().objects.get(username=username)
            if group.members.filter(id=user.id).exists():
                group.members.remove(user)
                return Response(
                    {"message": "User removed from group successfully"},
                    status=status.HTTP_200_OK,
                )

        if request.user != group.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
            )

        user = get_user_model().objects.get(username=username)
        if group.members.filter(id=user.id).exists():
            group.members.remove(user)
            return Response(
                {"message": "User removed from group successfully"},
                status=status.HTTP_200_OK,
            )
        return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


class GroupUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):

        group_id = kwargs.get("group_id")
        group = get_object_or_404(Group, id=group_id, owner=request.user)

        if request.user != group.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = GroupUpdateSerializer(group, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Group name changed successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhotoShareAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        photo_id = request.data.get("photo_id")
        group_id = kwargs.get("group_id")

        photo = get_object_or_404(Photo, id=photo_id, owner=user)
        group = get_object_or_404(Group, id=group_id)
        if not (group.owner == user or group.members.filter(id=user.id).exists()):
            return Response(
                {"error": "You are not authorized to share this photo with the group"},
                status=status.HTTP_403_FORBIDDEN
            )

        if group in photo.groups.all():
            return Response(
                {"error": "This photo is already shared with the group"},
                status=status.HTTP_400_BAD_REQUEST
            )
        photo.groups.add(group)
        return Response(
            {"message": "Photo shared with group successfully"},
            status=status.HTTP_200_OK
        )


class PhotoShareAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        photo_id = request.data.get("photo_id")
        group_id = kwargs.get("group_id")

        photo = get_object_or_404(Photo, id=photo_id, owner=user)
        group = get_object_or_404(Group, id=group_id)
        if not (group.owner == user or group.members.filter(id=user.id).exists()):
            return Response(
                {"error": "You are not authorized to share this photo with the group"},
                status=status.HTTP_403_FORBIDDEN
            )

        if group in photo.groups.all():
            return Response(
                {"error": "This photo is already shared with the group"},
                status=status.HTTP_400_BAD_REQUEST
            )
        photo.groups.add(group)
        return Response(
            {"message": "Photo shared with group successfully"},
            status=status.HTTP_200_OK
        )


class PhotoListGroupAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        group_id = kwargs.get("group_id")

        group = get_object_or_404(Group, id=group_id)

        if not (group.owner == user or group.members.filter(id=user.id).exists()):
            return Response(
                {"error": "You are not authorized to view the photos of this group"},
                status=status.HTTP_403_FORBIDDEN
            )

        photos = group.group_photos.all()
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PhotoDeleteFromGroupAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        group_id = kwargs.get("group_id")
        photo_id = kwargs.get("pk")

        group = get_object_or_404(Group, id=group_id)
        photo = get_object_or_404(Photo, id=photo_id)

        if not (user == group.owner or user == photo.owner):
            return Response(
                {"error": "You are not authorized to remove this photo from the group"},
                status=status.HTTP_403_FORBIDDEN
            )

        if group not in photo.groups.all():
            return Response(
                {"error": "This photo is not part of the specified group"},
                status=status.HTTP_400_BAD_REQUEST
            )

        photo.groups.remove(group)
        return Response(
            {"message": "Photo removed from group successfully"},
            status=status.HTTP_200_OK
        )
