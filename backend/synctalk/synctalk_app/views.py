from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UploadSerializer
from rest_framework.viewsets import ViewSet
from django.conf import settings
from .functions import splitTextIntoSentences
from .speechToText import getTimestamps
import os

# Create your views here.

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_serializer = UploadSerializer(data=request.data)

        if file_serializer.is_valid():
            print("valid file")
            audio_file = file_serializer.validated_data.get('audio')
            text_file = file_serializer.validated_data.get('text')
            translation_file = file_serializer.validated_data.get('translation')
            
            #TODO: use request id to name files?
            #create a folder
            foldername = (text_file.name).split('.')[0]
            p = os.path.join(settings.MEDIA_ROOT,foldername)
            if not os.path.exists(p):
                os.makedirs(p)

            #save the text file
            
            text_path = os.path.join(p,text_file.name)
            with open(text_path, 'wb') as destination:
                for chunk in text_file.chunks():
                    destination.write(chunk)
            print("tokenizing text file")
            split_text_path = splitTextIntoSentences(text_path)
            

            if translation_file:
                translation_path = os.path.join(p,translation_file.name)
                with open(translation_path, 'wb') as destination:
                    for chunk in text_file.chunks():
                        destination.write(chunk)
                print("tokenizing translation file")
                #split_text_path = splitTextIntoSentences(text_path)

            #save the audio file
            audio_path = os.path.join(p,audio_file.name)
            with open(audio_path, 'wb') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)
            # print("getting timestamps")
            # timestamps = getTimestamps(audio_path, split_text_path)

            
            #TODO: return alinged text
            #return timestamps from whisper
            #return Response(timestamps, status=status.HTTP_200_OK)
            return Response({'aa':'hello world'}, status=status.HTTP_200_OK)
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
