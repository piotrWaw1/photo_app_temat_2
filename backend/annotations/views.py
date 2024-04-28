from rest_framework.decorators import api_view
from rest_framework.response import Response
@api_view(['POST'])
def your_new_endpoint(request):
    # Tutaj możesz przetwarzać dane z żądania
    # np. request.data['some_data']

    # Zwróć tekst do wyświetlenia na frontendzie
    return Response({"message": "Init"})