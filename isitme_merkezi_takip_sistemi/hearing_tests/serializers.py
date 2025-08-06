from rest_framework import serializers
from .models import HearingTest

class HearingTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HearingTest
        fields = '__all__' 