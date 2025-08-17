from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Patient(models.Model):
    STATUS_CHOICES = [
        ('active', 'Aktif'),
        ('inactive', 'Pasif'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Erkek'),
        ('F', 'Kadın'),
    ]
    
    HEARING_AID_TYPE_CHOICES = [
        ('BTE', 'BTE (Kulak Arkası)'),
        ('ITE', 'ITE (Kulak İçi)'),
        ('ITC', 'ITC (Kulak Kanalı)'),
        ('CIC', 'CIC (Tam Gizli)'),
        ('RIC', 'RIC (Kulak Arkası Açık)'),
        ('None', 'Kullanmıyor'),
    ]
    
    # Temel Bilgiler
    tc_number = models.CharField(max_length=11, verbose_name='TC Kimlik No', default='00000000000')
    first_name = models.CharField(max_length=50, verbose_name='Ad')
    last_name = models.CharField(max_length=50, verbose_name='Soyad')
    birth_date = models.DateField(verbose_name='Doğum Tarihi')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name='Cinsiyet')
    
    # İletişim Bilgileri
    phone = models.CharField(max_length=20, verbose_name='Telefon')
    email = models.EmailField(max_length=100, blank=True, verbose_name='E-posta')
    address = models.TextField(blank=True, verbose_name='Adres')
    city = models.CharField(max_length=50, blank=True, verbose_name='Şehir')
    district = models.CharField(max_length=50, blank=True, verbose_name='İlçe')
    
    # Tıbbi Bilgiler
    medical_history = models.TextField(blank=True, verbose_name='Tıbbi Geçmiş')
    allergies = models.TextField(blank=True, verbose_name='Alerjiler')
    current_medications = models.TextField(blank=True, verbose_name='Mevcut İlaçlar')
    
    # Acil Durum Bilgileri
    emergency_contact = models.CharField(max_length=100, blank=True, verbose_name='Acil Durum İletişim Kişisi')
    emergency_phone = models.CharField(max_length=20, blank=True, verbose_name='Acil Durum Telefonu')
    
    # İşitme Cihazı Bilgileri
    hearing_aid_type = models.CharField(max_length=10, choices=HEARING_AID_TYPE_CHOICES, blank=True, verbose_name='İşitme Cihazı Türü')
    hearing_aid_brand = models.CharField(max_length=100, blank=True, verbose_name='İşitme Cihazı Markası')
    hearing_aid_model = models.CharField(max_length=100, blank=True, verbose_name='İşitme Cihazı Modeli')
    hearing_aid_serial = models.CharField(max_length=100, blank=True, verbose_name='İşitme Cihazı Seri No')
    
    # Sosyal Bilgiler
    occupation = models.CharField(max_length=100, blank=True, verbose_name='Meslek')
    insurance_provider = models.CharField(max_length=100, blank=True, verbose_name='Sigorta Sağlayıcısı')
    insurance_number = models.CharField(max_length=50, blank=True, verbose_name='Sigorta Numarası')
    referring_doctor = models.CharField(max_length=100, blank=True, verbose_name='Sevk Eden Doktor')
    
    # Genel Bilgiler
    notes = models.TextField(blank=True, verbose_name='Notlar')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='Durum')
    
    # Sistem Bilgileri
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patients', null=True, blank=True, help_text='Kim ekledi')
    last_appointment_date = models.DateField(null=True, blank=True, verbose_name='Son Randevu Tarihi')
    next_appointment_date = models.DateField(null=True, blank=True, verbose_name='Sonraki Randevu Tarihi')
    total_appointments = models.IntegerField(default=0, verbose_name='Toplam Randevu Sayısı')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')

    class Meta:
        verbose_name = 'Hasta'
        verbose_name_plural = 'Hastalar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.tc_number})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_age(self):
        from datetime import date
        today = date.today()
        return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
