from rest_framework import serializers
from .models import Supplier
import re

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_phone(self, value):
        """Telefon numarası validasyonu"""
        if not value:
            raise serializers.ValidationError("Telefon numarası zorunludur")
        
        # Sadece rakam ve boşluk karakterlerini kabul et
        clean_phone = re.sub(r'[^\d\s]', '', value)
        if len(clean_phone.replace(' ', '')) < 10:
            raise serializers.ValidationError("Geçerli bir telefon numarası giriniz")
        
        return value
    
    def validate_email(self, value):
        """E-posta validasyonu"""
        if value and '@' not in value:
            raise serializers.ValidationError("Geçerli bir e-posta adresi giriniz")
        return value
