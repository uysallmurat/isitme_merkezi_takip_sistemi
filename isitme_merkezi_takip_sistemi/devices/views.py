from django.shortcuts import render
from rest_framework import viewsets
from .models import Device, DeviceTransaction
from .serializers import DeviceSerializer, DeviceTransactionSerializer

# Create your views here.

class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

class DeviceTransactionViewSet(viewsets.ModelViewSet):
    queryset = DeviceTransaction.objects.all()
    serializer_class = DeviceTransactionSerializer
