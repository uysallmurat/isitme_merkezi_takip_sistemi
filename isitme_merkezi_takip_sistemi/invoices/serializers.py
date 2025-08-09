from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

    def to_representation(self, instance):
        """API response'da patient name'i ekle"""
        data = super().to_representation(instance)
        
        # Patient name'i ekle
        if instance.patient:
            data['patient_name'] = f"{instance.patient.first_name} {instance.patient.last_name}"
        else:
            data['patient_name'] = 'Bilinmeyen Hasta'
        
        return data