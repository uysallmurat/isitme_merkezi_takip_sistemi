from rest_framework import serializers
from .models import Appointment
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class AppointmentSerializer(serializers.ModelSerializer):
    appointment_date_input = serializers.CharField(write_only=True, required=False)
    appointment_time_input = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        
    def to_representation(self, instance):
        """API response'da tarih ve saati ayrı ayrı göster"""
        data = super().to_representation(instance)
        if instance.appointment_date:
            data['appointment_date_display'] = instance.appointment_date.strftime('%Y-%m-%d')
            data['appointment_time_display'] = instance.appointment_date.strftime('%H:%M')
        
        # Patient name'i ekle
        if instance.patient:
            data['patient_name'] = f"{instance.patient.first_name} {instance.patient.last_name}"
        else:
            data['patient_name'] = 'Bilinmeyen Hasta'
            
        return data
    
    def create(self, validated_data):
        try:
            # Tarih ve saati birleştir
            appointment_date = validated_data.pop('appointment_date_input', None)
            appointment_time = validated_data.pop('appointment_time_input', None)
            
            if appointment_date and appointment_time:
                # Tarih ve saati birleştirerek DateTimeField oluştur
                datetime_str = f"{appointment_date} {appointment_time}"
                logger.info(f"Combining datetime: {datetime_str}")
                validated_data['appointment_date'] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
            else:
                # Eğer tarih veya saat eksikse, şu anki zamanı kullan
                validated_data['appointment_date'] = datetime.now()
            
            # User alanını None olarak ayarla (opsiyonel olduğu için)
            if 'user' not in validated_data:
                validated_data['user'] = None
            
            logger.info(f"Creating appointment with data: {validated_data}")
            return super().create(validated_data)
            
        except Exception as e:
            logger.error(f"Error creating appointment: {e}")
            logger.error(f"Validated data: {validated_data}")
            raise
    
    def update(self, instance, validated_data):
        try:
            # Tarih ve saati birleştir (eğer sağlanmışsa)
            appointment_date = validated_data.pop('appointment_date_input', None)
            appointment_time = validated_data.pop('appointment_time_input', None)
            
            if appointment_date and appointment_time:
                # Tarih ve saati birleştirerek DateTimeField oluştur
                datetime_str = f"{appointment_date} {appointment_time}"
                logger.info(f"Updating datetime: {datetime_str}")
                validated_data['appointment_date'] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
            elif appointment_date:
                # Sadece tarih sağlanmışsa, mevcut saati koru
                current_time = instance.appointment_date.strftime('%H:%M')
                datetime_str = f"{appointment_date} {current_time}"
                validated_data['appointment_date'] = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
            
            logger.info(f"Updating appointment with data: {validated_data}")
            return super().update(instance, validated_data)
            
        except Exception as e:
            logger.error(f"Error updating appointment: {e}")
            logger.error(f"Validated data: {validated_data}")
            raise