from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Photo
from .serializer import PhotoSerializer
from rest_framework.permissions import IsAuthenticated


class PhotoCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PhotoSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        # print(request.data["title"])
        if serializer.is_valid():
            serializer.save(owner=request.user, owner_id=request.user.id, title=request.data["title"])  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

