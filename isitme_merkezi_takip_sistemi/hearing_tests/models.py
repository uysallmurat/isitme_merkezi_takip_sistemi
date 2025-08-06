from django.db import models
from patients.models import Patient
from django.contrib.auth.models import User

class HearingTest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='hearing_tests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hearing_tests')  # Odyolog
    test_date = models.DateTimeField()
    test_type = models.CharField(max_length=50, choices=[
        ('Pure_Tone', 'Saf Ses Odyometrisi'),
        ('Speech', 'Konuşma Odyometrisi'),
        ('Impedance', 'Empedans Odyometrisi'),
        ('ABR', 'İşitsel Beyin Sapı Yanıtı'),
        ('OAE', 'Otoakustik Emisyon'),
        ('Other', 'Diğer')
    ])
    
    # Test sonuçları
    right_ear_250 = models.IntegerField(blank=True, null=True)  # dB HL
    right_ear_500 = models.IntegerField(blank=True, null=True)
    right_ear_1000 = models.IntegerField(blank=True, null=True)
    right_ear_2000 = models.IntegerField(blank=True, null=True)
    right_ear_4000 = models.IntegerField(blank=True, null=True)
    right_ear_8000 = models.IntegerField(blank=True, null=True)
    
    left_ear_250 = models.IntegerField(blank=True, null=True)  # dB HL
    left_ear_500 = models.IntegerField(blank=True, null=True)
    left_ear_1000 = models.IntegerField(blank=True, null=True)
    left_ear_2000 = models.IntegerField(blank=True, null=True)
    left_ear_4000 = models.IntegerField(blank=True, null=True)
    left_ear_8000 = models.IntegerField(blank=True, null=True)
    
    # Konuşma testi sonuçları
    right_ear_srt = models.IntegerField(blank=True, null=True)  # Speech Reception Threshold
    left_ear_srt = models.IntegerField(blank=True, null=True)
    right_ear_sds = models.IntegerField(blank=True, null=True)  # Speech Discrimination Score
    left_ear_sds = models.IntegerField(blank=True, null=True)
    
    # Test durumu
    STATUS_CHOICES = [
        ('Completed', 'Tamamlandı'),
        ('Incomplete', 'Tamamlanmadı'),
        ('Cancelled', 'İptal Edildi'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Completed')
    
    # Notlar ve sonuçlar
    notes = models.TextField(blank=True, null=True)
    diagnosis = models.TextField(blank=True, null=True)
    recommendations = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.first_name} {self.patient.last_name} - {self.test_type} - {self.test_date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-test_date']
