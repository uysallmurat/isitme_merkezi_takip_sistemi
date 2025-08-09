from django.db import models
from patients.models import Patient
from django.contrib.auth.models import User

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    appointment_date = models.DateTimeField()
    appointment_type = models.CharField(max_length=50, choices=[
        ('consultation', 'Konsültasyon'),
        ('hearing_test', 'İşitme Testi'),
        ('device_fitting', 'Cihaz Uygulaması'),
        ('follow_up', 'Kontrol'),
        ('maintenance', 'Bakım'),
    ], default='consultation')
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Planlandı'),
        ('completed', 'Tamamlandı'),
        ('cancelled', 'İptal Edildi')
    ], default='scheduled')

    def __str__(self):
        return f"{self.patient} - {self.appointment_date}"
