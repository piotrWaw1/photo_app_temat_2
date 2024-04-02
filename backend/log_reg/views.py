from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response


class HelloWorldView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        return Response({'message': 'Hello World!'})
