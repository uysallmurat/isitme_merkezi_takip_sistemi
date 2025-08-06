from rest_framework import serializers
from .models import Device, DeviceTransaction

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

class DeviceTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceTransaction
        fields = '__all__' 