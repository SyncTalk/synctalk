from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UploadSerializer
from rest_framework.viewsets import ViewSet
import os

# Create your views here.

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        print(request.data)
        file_serializer = UploadSerializer(data=request.data)

        if file_serializer.is_valid():
            audio_file = file_serializer.validated_data.get('audio')
            text_file = file_serializer.validated_data.get('text')
            translation_file = file_serializer.validated_data.get('translation')
            
            # Define a temporary directory for file storage
            temp_dir = 'syncTalk_app/uploadStorage'
            
            #save the audio file
            if audio_file:
                with open(os.path.join(temp_dir, audio_file.name), 'wb+') as destination:
                    for chunk in audio_file.chunks():
                        destination.write(chunk)

            #save the text file
            if text_file:
                with open(os.path.join(temp_dir, text_file.name), 'wb+') as destination:
                    for chunk in text_file.chunks():
                        destination.write(chunk)


            return Response({audio_file.name,text_file.name}, status=status.HTTP_200_OK)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return Response({'message':'hello world'})

# class UploadViewSet(ViewSet):
#     serializer_class = UploadSerializer
#     def list(self,request):
#         return Response({'message':'hello world'})
#     def create(self,request):
#         serializer = UploadSerializer(data=request.data)
#         if serializer.is_valid():
#             audio_file = serializer.validated_data.get('audio')
#             text_file = serializer.validated_data.get('text')
#             translation_file = serializer.validated_data.get('translation')
#             # do some stuff with uploaded files

#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
