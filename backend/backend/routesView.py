from rest_framework.response import Response
from rest_framework.views import APIView


class GetRoutesView(APIView):
    def get(self, request):
        routes = [
            'auth/register',
            'auth/token',
            'auth/token/refresh'
        ]
        return Response(routes)
