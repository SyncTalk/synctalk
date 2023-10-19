from django.urls import path, include
from rest_framework import routers

# from .views import UploadViewSet
from .views import FileUploadView

urlpatterns = [
    # path('',UploadViewSet.as_view(),name='upload')
    path("", FileUploadView.as_view(), name="upload")
]
