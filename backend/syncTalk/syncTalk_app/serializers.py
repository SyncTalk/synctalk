from rest_framework import serializers
from django.core.validators import FileExtensionValidator

TEXT_TRANSLATION_EXTENSIONS = ['txt','docx','pdf']
AUDIO = ['mp3','txt']
class UploadSerializer(serializers.Serializer):
    text = serializers.FileField(validators = [FileExtensionValidator(allowed_extensions=TEXT_TRANSLATION_EXTENSIONS)])
    audio = serializers.FileField(validators = [FileExtensionValidator(allowed_extensions=AUDIO)])
    translation = serializers.FileField(validators = [FileExtensionValidator(allowed_extensions=TEXT_TRANSLATION_EXTENSIONS)],
                                        required=False)
