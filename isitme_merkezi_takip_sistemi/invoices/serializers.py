from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

    def to_representation(self, instance):
        """API response'da patient name ve user bilgilerini ekle"""
        data = super().to_representation(instance)
        
        # Patient name'i ekle
        if instance.patient:
            data['patient_name'] = f"{instance.patient.first_name} {instance.patient.last_name}"
        else:
            data['patient_name'] = 'Bilinmeyen Hasta'
        
        # User bilgilerini ekle
        if instance.user:
            data['user'] = {
                'id': instance.user.id,
                'username': instance.user.username,
                'first_name': instance.user.first_name,
                'last_name': instance.user.last_name,
            }
        else:
            data['user'] = None
        
        return data