from rest_framework import serializers

class UploadSerializer(serializers.Serializer):
    audio = serializers.FileField()
    text = serializers.FileField()
    translation = serializers.FileField(required=False)
