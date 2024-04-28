from rest_framework.response import Response
from rest_framework.views import APIView

class AnnotationView(APIView):
    def post(self, request):

        #[image, text]
        return Response({"message": "Init"})