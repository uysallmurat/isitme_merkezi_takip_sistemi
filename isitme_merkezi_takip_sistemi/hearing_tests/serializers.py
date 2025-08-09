from rest_framework import serializers
from .models import HearingTest

class HearingTestSerializer(serializers.ModelSerializer):
    report_pdf = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = HearingTest
        fields = '__all__'
    
    def to_representation(self, instance):
        """API response'da patient name ve diğer bilgileri ekle"""
        data = super().to_representation(instance)
        
        # Patient name'i ekle
        if instance.patient:
            data['patient_name'] = f"{instance.patient.first_name} {instance.patient.last_name}"
        else:
            data['patient_name'] = 'Bilinmeyen Hasta'
        
        # Test tarihini formatla
        if instance.test_date:
            data['test_date_display'] = instance.test_date.strftime('%d.%m.%Y')
        
        # PDF durumu bilgisi ekle
        data['has_pdf'] = bool(instance.report_pdf)
        
        return data
    
    def to_internal_value(self, data):
        # Boş string değerleri None'a çevir
        for field_name in [
            'right_ear_250', 'right_ear_500', 'right_ear_1000', 'right_ear_2000', 'right_ear_4000', 'right_ear_8000',
            'left_ear_250', 'left_ear_500', 'left_ear_1000', 'left_ear_2000', 'left_ear_4000', 'left_ear_8000',
            'right_ear_srt', 'left_ear_srt', 'right_ear_sds', 'left_ear_sds'
        ]:
            if field_name in data and data[field_name] == '':
                data[field_name] = None
        
        return super().to_internal_value(data) 