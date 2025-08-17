from rest_framework import serializers
from .models import Patient
import re

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'total_appointments', 'last_appointment_date', 'next_appointment_date']
    
    def get_age(self, obj):
        return obj.get_age()
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    
    def validate_tc_number(self, value):
        """TC Kimlik numarası validasyonu"""
        if not value:
            raise serializers.ValidationError("TC Kimlik numarası zorunludur")
        
        # TC numarası 11 haneli olmalı
        if len(value) != 11:
            raise serializers.ValidationError("TC Kimlik numarası 11 haneli olmalıdır")
        
        # Sadece rakam olmalı
        if not value.isdigit():
            raise serializers.ValidationError("TC Kimlik numarası sadece rakam içermelidir")
        
        # İlk hane 0 olamaz
        if value[0] == '0':
            raise serializers.ValidationError("TC Kimlik numarası 0 ile başlayamaz")
        
        return value
    
    def validate_phone(self, value):
        """Telefon numarası validasyonu"""
        if not value:
            raise serializers.ValidationError("Telefon numarası zorunludur")
        
        # Sadece rakam ve boşluk karakterlerini kabul et
        clean_phone = re.sub(r'[^\d\s]', '', value)
        if len(clean_phone.replace(' ', '')) < 10:
            raise serializers.ValidationError("Geçerli bir telefon numarası giriniz")
        
        return value
    
    def validate_birth_date(self, value):
        """Doğum tarihi validasyonu"""
        from datetime import date
        today = date.today()
        
        if value > today:
            raise serializers.ValidationError("Doğum tarihi gelecek bir tarih olamaz")
        
        # 150 yaşından büyük olamaz
        if value < today.replace(year=today.year - 150):
            raise serializers.ValidationError("Geçerli bir doğum tarihi giriniz")
        
        return value