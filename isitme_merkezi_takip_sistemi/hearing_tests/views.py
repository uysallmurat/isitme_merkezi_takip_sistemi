from django.shortcuts import render
from rest_framework import viewsets
from .models import HearingTest
from .serializers import HearingTestSerializer

# Create your views here.

class HearingTestViewSet(viewsets.ModelViewSet):
    queryset = HearingTest.objects.all()
    serializer_class = HearingTestSerializer
